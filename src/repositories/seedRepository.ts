import { phase1Seed } from '../data/seed/phase1Seed';
import { Device, DiscoveryJob, DiscoveryResult, SeedData, TopologyNode } from '../domains/types';

type NewDiscoveryInput = {
  name: string;
  discoveryType: DiscoveryJob['discoveryType'];
  credentialProfileId: string;
  preferredManagementIp: DiscoveryJob['preferredManagementIp'];
  status: DiscoveryJob['status'];
};

const nowIso = () => new Date().toISOString();

export class SeedRepository {
  private data: SeedData = structuredClone(phase1Seed);

  getAll(): SeedData {
    return this.data;
  }

  addDiscoveryFlow(input: NewDiscoveryInput): DiscoveryJob {
    const suffix = String(Date.now());
    const jobId = `dj-${suffix}`;
    const resultId = `dr-${suffix}`;

    const summaryByStatus = {
      success: { success: 3, partial: 0, failed: 0 },
      partial: { success: 1, partial: 1, failed: 1 },
      failed: { success: 0, partial: 0, failed: 3 },
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
      .map((d, i) => ({
        id: `node-${suffix}-${i}`,
        deviceId: d.id,
        siteId: d.siteId,
        role: d.role,
        shape: d.role === 'core' ? 'hex' : d.role === 'distribution' ? 'square' : 'circle'
      }));

    this.data.discoveryJobs = [job, ...this.data.discoveryJobs];
    this.data.discoveryResults = [discoveryResult, ...this.data.discoveryResults];
    this.data.devices = [...generatedDevices, ...this.data.devices];
    this.data.topologyNodes = [...generatedNodes, ...this.data.topologyNodes];
    this.data.jobs = [
      { id: `job-${suffix}`, module: 'discovery', status: input.status, createdAt: nowIso() },
      ...this.data.jobs
    ];

    return job;
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
          role: 'unknown',
          siteId: 'unassigned',
          assignmentState: 'unassigned',
          health: 'critical',
          sourceDiscoveryJobId: job.id
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
          role: 'access',
          siteId: siteByType[job.discoveryType],
          assignmentState: 'assigned',
          health: 'healthy',
          sourceDiscoveryJobId: job.id
        },
        {
          id: `dev-${job.id}-warn-1`,
          name: `${job.name}-Unknown-1`,
          managementIp: '10.88.1.11',
          reachability: 'intermittent',
          role: 'unknown',
          siteId: 'unassigned',
          assignmentState: 'unassigned',
          health: 'warning',
          sourceDiscoveryJobId: job.id,
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
        role: 'core',
        siteId: siteByType[job.discoveryType],
        assignmentState: 'assigned',
        health: 'healthy',
        sourceDiscoveryJobId: job.id
      },
      {
        id: `dev-${job.id}-ok-2`,
        name: `${job.name}-Access-2`,
        managementIp: '10.77.0.2',
        reachability: 'reachable',
        role: 'access',
        siteId: siteByType[job.discoveryType],
        assignmentState: 'assigned',
        health: 'healthy',
        sourceDiscoveryJobId: job.id
      }
    ];
  }

  getDevicesByJob(jobId: string): Device[] {
    return this.data.devices.filter((d) => d.sourceDiscoveryJobId === jobId);
  }
}

export const seedRepository = new SeedRepository();
