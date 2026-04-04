import { phase1Seed } from '../data/seed/phase1Seed';
import {
  Device,
  DeviceRole,
  DiscoveryJob,
  DiscoveryResult,
  PreferredManagementIpPolicy,
  SeedData,
  TopologyNode,
  TimelineEvent
} from '../domains/types';

type NewDiscoveryInput = {
  name: string;
  discoveryType: DiscoveryJob['discoveryType'];
  credentialProfileId: string;
  preferredManagementIp: DiscoveryJob['preferredManagementIp'];
  status: DiscoveryJob['status'];
};

type NormalizationPatch = {
  siteId?: string;
  roleOverride?: DeviceRole;
  preferredManagementIpPolicy?: PreferredManagementIpPolicy;
};

const nowIso = () => new Date().toISOString();
const effectiveRole = (d: Device): DeviceRole => d.roleOverride ?? d.roleDetected;

export class SeedRepository {
  private data: SeedData = structuredClone(phase1Seed);

  getAll(): SeedData {
    return structuredClone(this.data);
  }

  addDiscoveryFlow(input: NewDiscoveryInput): DiscoveryJob {
    const suffix = String(Date.now());
    const jobId = `dj-${suffix}`;
    const resultId = `dr-${suffix}`;

    const summaryByStatus = {
      success: { success: 2, partial: 0, failed: 0 },
      partial: { success: 1, partial: 1, failed: 0 },
      failed: { success: 0, partial: 0, failed: 1 },
      queued: { success: 0, partial: 0, failed: 0 },
      running: { success: 0, partial: 0, failed: 0 }
    } as const;

    const job: DiscoveryJob = {
      id: jobId,
      name: input.name,
      discoveryType: input.discoveryType,
      credentialProfileId: input.credentialProfileId,
      preferredManagementIp: input.preferredManagementIp,
      status: input.status,
      startedAt: nowIso(),
      endedAt: input.status === 'running' || input.status === 'queued' ? undefined : nowIso(),
      resultId
    };

    const discoveryResult: DiscoveryResult = {
      id: resultId,
      jobId,
      summary: summaryByStatus[input.status],
      reason: input.status === 'failed' ? 'credential mismatch' : undefined,
      discoveredDeviceIds: []
    };

    const generatedDevices: Device[] = this.generateDevicesFromDiscovery(job, input.status);
    discoveryResult.discoveredDeviceIds = generatedDevices.map((d) => d.id);

    const generatedNodes: TopologyNode[] = generatedDevices
      .filter((d) => d.assignmentState !== 'unassigned')
      .map((d, i) => this.toTopologyNode(d, `${suffix}-${i}`));

    this.data.discoveryJobs = [job, ...this.data.discoveryJobs];
    this.data.discoveryResults = [discoveryResult, ...this.data.discoveryResults];
    this.data.devices = [...generatedDevices, ...this.data.devices];
    this.data.topologyNodes = [...generatedNodes, ...this.data.topologyNodes];
    this.data.jobs = [{ id: `job-${suffix}`, module: 'discovery', status: input.status, createdAt: nowIso() }, ...this.data.jobs];

    generatedDevices.forEach((d) => {
      this.appendEvent({
        id: `ev-${Date.now()}-${d.id}`,
        deviceId: d.id,
        at: nowIso(),
        type: 'discovered',
        message: `Discovered via ${job.name} (${job.status})`
      });
    });

    return job;
  }

  normalizeDevice(deviceId: string, patch: NormalizationPatch) {
    const target = this.data.devices.find((d) => d.id === deviceId);
    if (!target) return;

    if (patch.siteId && patch.siteId !== target.siteId) {
      target.siteId = patch.siteId;
      target.assignmentState = patch.siteId === 'unassigned' ? 'unassigned' : 'assigned';
      this.appendEvent({
        id: `ev-${Date.now()}-site-${deviceId}`,
        deviceId,
        at: nowIso(),
        type: 'assigned',
        message: `Site assignment updated to ${patch.siteId}`
      });
    }

    if (patch.roleOverride && patch.roleOverride !== target.roleOverride) {
      target.roleOverride = patch.roleOverride;
      this.appendEvent({
        id: `ev-${Date.now()}-role-${deviceId}`,
        deviceId,
        at: nowIso(),
        type: 'role-corrected',
        message: `Admin role override set to ${patch.roleOverride}`
      });
    }

    if (patch.preferredManagementIpPolicy && patch.preferredManagementIpPolicy !== target.preferredManagementIpPolicy) {
      target.preferredManagementIpPolicy = patch.preferredManagementIpPolicy;
      if (patch.preferredManagementIpPolicy === 'loopback') {
        target.reachability = 'reachable';
      } else if (patch.preferredManagementIpPolicy === 'interface-vlan' && target.preferredManagementIpCandidate) {
        target.reachability = 'intermittent';
      }
      this.appendEvent({
        id: `ev-${Date.now()}-policy-${deviceId}`,
        deviceId,
        at: nowIso(),
        type: 'policy-updated',
        message: `Preferred management IP policy set to ${patch.preferredManagementIpPolicy}`
      });
    }

    this.recomputeDeviceHealth(target);
    this.upsertTopologyNode(target);
    this.refreshDevice360Context(target);
  }

  private generateDevicesFromDiscovery(job: DiscoveryJob, status: DiscoveryJob['status']): Device[] {
    const siteByType: Record<DiscoveryJob['discoveryType'], string> = {
      'ip-range': 'site-hq-f2',
      cidr: 'site-hq-f1',
      cdp: 'site-br1-f1',
      lldp: 'site-br1-f1'
    };

    if (status === 'failed') {
      return [
        {
          id: `dev-${job.id}-fail-1`,
          name: `${job.name}-Unreachable-1`,
          managementIp: '10.99.1.10',
          reachability: 'unreachable',
          roleDetected: 'unknown',
          siteId: 'unassigned',
          assignmentState: 'unassigned',
          health: 'critical',
          sourceDiscoveryJobId: job.id,
          preferredManagementIpPolicy: job.preferredManagementIp
        }
      ];
    }

    if (status === 'partial') {
      return [
        {
          id: `dev-${job.id}-ok-1`,
          name: `${job.name}-Access-1`,
          managementIp: '10.88.1.10',
          reachability: 'reachable',
          roleDetected: 'access',
          siteId: siteByType[job.discoveryType],
          assignmentState: 'assigned',
          health: 'healthy',
          sourceDiscoveryJobId: job.id,
          preferredManagementIpPolicy: job.preferredManagementIp
        },
        {
          id: `dev-${job.id}-warn-1`,
          name: `${job.name}-Unknown-1`,
          managementIp: '10.88.1.11',
          reachability: 'intermittent',
          roleDetected: 'unknown',
          siteId: 'unassigned',
          assignmentState: 'unassigned',
          health: 'warning',
          sourceDiscoveryJobId: job.id,
          preferredManagementIpPolicy: job.preferredManagementIp,
          preferredManagementIpCandidate: job.preferredManagementIp === 'loopback' ? '172.31.0.11' : '10.88.1.11'
        }
      ];
    }

    return [
      {
        id: `dev-${job.id}-ok-1`,
        name: `${job.name}-Core-1`,
        managementIp: '10.77.0.1',
        reachability: 'reachable',
        roleDetected: 'core',
        siteId: siteByType[job.discoveryType],
        assignmentState: 'assigned',
        health: 'healthy',
        sourceDiscoveryJobId: job.id,
        preferredManagementIpPolicy: job.preferredManagementIp
      },
      {
        id: `dev-${job.id}-ok-2`,
        name: `${job.name}-Access-2`,
        managementIp: '10.77.0.2',
        reachability: 'reachable',
        roleDetected: 'access',
        siteId: siteByType[job.discoveryType],
        assignmentState: 'assigned',
        health: 'healthy',
        sourceDiscoveryJobId: job.id,
        preferredManagementIpPolicy: job.preferredManagementIp
      }
    ];
  }

  private toTopologyNode(device: Device, suffix: string): TopologyNode {
    const role = effectiveRole(device);
    return {
      id: `node-${suffix}`,
      deviceId: device.id,
      siteId: device.siteId,
      role,
      shape: role === 'core' ? 'hex' : role === 'distribution' ? 'square' : 'circle'
    };
  }

  private upsertTopologyNode(device: Device) {
    const idx = this.data.topologyNodes.findIndex((n) => n.deviceId === device.id);
    if (device.assignmentState === 'unassigned') {
      if (idx >= 0) this.data.topologyNodes.splice(idx, 1);
      return;
    }

    const next = this.toTopologyNode(device, `${Date.now()}-${device.id}`);
    if (idx >= 0) {
      this.data.topologyNodes[idx] = { ...this.data.topologyNodes[idx], siteId: device.siteId, role: next.role, shape: next.shape };
      return;
    }
    this.data.topologyNodes.unshift(next);
  }

  private recomputeDeviceHealth(device: Device) {
    const role = effectiveRole(device);
    const issues = [
      device.assignmentState !== 'assigned',
      role === 'unknown',
      device.reachability === 'unreachable'
    ].filter(Boolean).length;

    device.health = issues === 0 ? 'healthy' : issues === 1 ? 'warning' : 'critical';

    this.appendEvent({
      id: `ev-${Date.now()}-norm-${device.id}`,
      deviceId: device.id,
      at: nowIso(),
      type: 'normalized',
      message: `Normalization applied: role=${role}, assignment=${device.assignmentState}, reachability=${device.reachability}`
    });
  }

  private refreshDevice360Context(device: Device) {
    const role = effectiveRole(device);
    const issues: string[] = [];

    if (device.assignmentState !== 'assigned') issues.push('Site assignment required');
    if (role === 'unknown') issues.push('Role normalization required');
    if (device.reachability !== 'reachable') issues.push('Management reachability ambiguity remains');

    const context = this.data.device360Contexts.find((c) => c.deviceId === device.id);
    const payload = {
      deviceId: device.id,
      currentHealth: device.health,
      currentIssues: issues,
      recommendedNextAction: issues.length === 0 ? 'No action required.' : 'Complete remaining normalization actions in Inventory.'
    } as const;

    if (context) Object.assign(context, payload);
    else this.data.device360Contexts.unshift({ ...payload });
  }

  private appendEvent(event: TimelineEvent) {
    this.data.timelineEvents.unshift(event);
  }

  getDevicesByJob(jobId: string): Device[] {
    return this.data.devices.filter((d) => d.sourceDiscoveryJobId === jobId);
  }
}

export const seedRepository = new SeedRepository();
