import { SeedData } from '../../domains/types';

export const phase1Seed: SeedData = {
  credentialProfiles: [
    { id: 'cred-1', name: 'Campus SSH', username: 'netops', protocol: 'ssh' },
    { id: 'cred-2', name: 'SNMPv3 Read', username: 'observer', protocol: 'snmpv3' }
  ],
  discoveryJobs: [
    { id: 'dj-100', name: 'HQ Full Discovery', discoveryType: 'cidr', credentialProfileId: 'cred-1', preferredManagementIp: 'loopback', status: 'success', startedAt: '2026-03-25T09:00:00Z', endedAt: '2026-03-25T09:02:30Z', resultId: 'dr-100' },
    { id: 'dj-101', name: 'Branch Mixed Discovery', discoveryType: 'ip-range', credentialProfileId: 'cred-1', preferredManagementIp: 'interface-vlan', status: 'partial', startedAt: '2026-03-25T10:00:00Z', endedAt: '2026-03-25T10:05:00Z', resultId: 'dr-101' },
    { id: 'dj-102', name: 'Legacy Segment', discoveryType: 'cdp', credentialProfileId: 'cred-2', preferredManagementIp: 'system', status: 'failed', startedAt: '2026-03-25T11:00:00Z', endedAt: '2026-03-25T11:01:00Z', resultId: 'dr-102' },
    { id: 'dj-103', name: 'In Progress Sweep', discoveryType: 'lldp', credentialProfileId: 'cred-1', preferredManagementIp: 'loopback', status: 'running', startedAt: '2026-03-25T11:30:00Z', resultId: 'dr-103' }
  ],
  discoveryResults: [
    { id: 'dr-100', jobId: 'dj-100', summary: { success: 12, partial: 0, failed: 0 }, discoveredDeviceIds: ['dev-1', 'dev-2', 'dev-3'] },
    { id: 'dr-101', jobId: 'dj-101', summary: { success: 4, partial: 3, failed: 1 }, discoveredDeviceIds: ['dev-4', 'dev-5', 'dev-6'] },
    { id: 'dr-102', jobId: 'dj-102', summary: { success: 0, partial: 0, failed: 7 }, reason: 'credential mismatch', discoveredDeviceIds: [] },
    { id: 'dr-103', jobId: 'dj-103', summary: { success: 0, partial: 0, failed: 0 }, discoveredDeviceIds: [] }
  ],
  devices: [
    { id: 'dev-1', name: 'HQ-Core-01', managementIp: '10.10.0.10', reachability: 'reachable', roleDetected: 'core', siteId: 'site-hq-f1', assignmentState: 'assigned', health: 'healthy', sourceDiscoveryJobId: 'dj-100', preferredManagementIpPolicy: 'loopback' },
    { id: 'dev-2', name: 'HQ-WLC-01', managementIp: '10.10.0.50', reachability: 'intermittent', roleDetected: 'wireless-controller', siteId: 'site-hq-f1', assignmentState: 'assigned', health: 'warning', sourceDiscoveryJobId: 'dj-100', preferredManagementIpPolicy: 'interface-vlan', preferredManagementIpCandidate: '172.16.0.50' },
    { id: 'dev-3', name: 'HQ-Access-44', managementIp: '10.10.1.44', reachability: 'reachable', roleDetected: 'access', siteId: 'site-hq-f2', assignmentState: 'unassigned', health: 'warning', sourceDiscoveryJobId: 'dj-100', preferredManagementIpPolicy: 'loopback' },
    { id: 'dev-4', name: 'BR1-Dist-01', managementIp: '10.20.0.2', reachability: 'reachable', roleDetected: 'distribution', siteId: 'site-br1-f1', assignmentState: 'assigned', health: 'healthy', sourceDiscoveryJobId: 'dj-101', preferredManagementIpPolicy: 'interface-vlan' },
    { id: 'dev-5', name: 'BR1-Unknown-01', managementIp: '10.20.0.99', reachability: 'reachable', roleDetected: 'unknown', siteId: 'site-br1-f1', assignmentState: 'pending', health: 'warning', sourceDiscoveryJobId: 'dj-101', preferredManagementIpPolicy: 'interface-vlan' },
    { id: 'dev-6', name: 'BR1-AP-11', managementIp: '10.20.1.11', reachability: 'unreachable', roleDetected: 'access', siteId: 'unassigned', assignmentState: 'unassigned', health: 'critical', sourceDiscoveryJobId: 'dj-101', preferredManagementIpPolicy: 'interface-vlan' }
  ],
  sites: [
    { id: 'site-hq-f1', name: 'HQ', building: 'Main', floor: '1F', health: 'healthy' },
    { id: 'site-hq-f2', name: 'HQ', building: 'Main', floor: '2F', health: 'healthy' },
    { id: 'site-br1-f1', name: 'Branch-1', building: 'Office', floor: '1F', health: 'degraded' },
    { id: 'unassigned', name: 'Unassigned', building: '-', floor: '-', health: 'degraded' }
  ],
  topologyNodes: [
    { id: 'node-1', deviceId: 'dev-1', siteId: 'site-hq-f1', role: 'core', shape: 'hex' },
    { id: 'node-2', deviceId: 'dev-2', siteId: 'site-hq-f1', role: 'wireless-controller', shape: 'square' },
    { id: 'node-3', deviceId: 'dev-3', siteId: 'site-hq-f2', role: 'access', shape: 'circle' },
    { id: 'node-4', deviceId: 'dev-4', siteId: 'site-br1-f1', role: 'distribution', shape: 'square' },
    { id: 'node-5', deviceId: 'dev-5', siteId: 'site-br1-f1', role: 'unknown', shape: 'circle' }
  ],
  topologyLinks: [
    { id: 'link-1', sourceNodeId: 'node-1', targetNodeId: 'node-2', quality: 'good' },
    { id: 'link-2', sourceNodeId: 'node-1', targetNodeId: 'node-3', quality: 'good' },
    { id: 'link-3', sourceNodeId: 'node-4', targetNodeId: 'node-5', quality: 'unstable' }
  ],
  device360Contexts: [
    { deviceId: 'dev-2', currentHealth: 'warning', currentIssues: ['WLC management IP fallback required'], recommendedNextAction: 'Set preferred management IP to loopback and re-discover.' },
    { deviceId: 'dev-3', currentHealth: 'warning', currentIssues: ['Discovered but unassigned'], recommendedNextAction: 'Assign site to include in topology hierarchy.' },
    { deviceId: 'dev-5', currentHealth: 'warning', currentIssues: ['Role misclassified'], recommendedNextAction: 'Correct role to access switch and refresh topology.' }
  ],
  issues: [
    { id: 'iss-1', severity: 'high', message: 'Credential mismatch blocked discovery in legacy segment', siteId: 'site-br1-f1' },
    { id: 'iss-2', severity: 'medium', message: 'Unassigned discovered device in HQ', deviceId: 'dev-3' },
    { id: 'iss-3', severity: 'medium', message: 'Topology appears unnatural due to unknown role', deviceId: 'dev-5' }
  ],
  timelineEvents: [
    { id: 'ev-1', deviceId: 'dev-3', at: '2026-03-25T09:03:00Z', type: 'discovered', message: 'Discovered by HQ Full Discovery' },
    { id: 'ev-2', deviceId: 'dev-3', at: '2026-03-25T09:20:00Z', type: 'issue-detected', message: 'Marked as unassigned device' },
    { id: 'ev-3', deviceId: 'dev-5', at: '2026-03-25T10:07:00Z', type: 'discovered', message: 'Discovered with role=unknown' },
    { id: 'ev-4', deviceId: 'dev-5', at: '2026-03-25T10:16:00Z', type: 'role-corrected', message: 'Role corrected after topology review' },
    { id: 'ev-5', deviceId: 'dev-2', at: '2026-03-25T09:08:00Z', type: 'issue-detected', message: 'WLC unreachable on interface-vlan IP' }
  ],
  jobs: [
    { id: 'job-1', module: 'discovery', status: 'running', createdAt: '2026-03-25T11:30:00Z' },
    { id: 'job-2', module: 'inventory', status: 'success', createdAt: '2026-03-25T10:30:00Z' },
    { id: 'job-3', module: 'topology', status: 'partial', createdAt: '2026-03-25T10:40:00Z' }
  ]
};
