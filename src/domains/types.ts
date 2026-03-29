export type JobStatus = 'queued' | 'running' | 'success' | 'partial' | 'failed';
export type DiscoveryType = 'ip-range' | 'cidr' | 'cdp' | 'lldp';
export type AssignmentState = 'assigned' | 'unassigned' | 'pending';
export type Reachability = 'reachable' | 'intermittent' | 'unreachable';
export type DeviceRole = 'core' | 'distribution' | 'access' | 'wireless-controller' | 'unknown';
export type PreferredManagementIpPolicy = 'loopback' | 'interface-vlan' | 'system';

export interface DiscoveryJob {
  id: string;
  name: string;
  discoveryType: DiscoveryType;
  credentialProfileId: string;
  preferredManagementIp: PreferredManagementIpPolicy;
  status: JobStatus;
  startedAt: string;
  endedAt?: string;
  resultId: string;
}

export interface CredentialProfile {
  id: string;
  name: string;
  username: string;
  protocol: 'ssh' | 'snmpv3';
}

export interface DiscoveryResult {
  id: string;
  jobId: string;
  summary: { success: number; partial: number; failed: number };
  reason?: string;
  discoveredDeviceIds: string[];
}

export interface Device {
  id: string;
  name: string;
  managementIp: string;
  reachability: Reachability;
  roleDetected: DeviceRole;
  roleOverride?: DeviceRole;
  siteId: string;
  assignmentState: InventoryAssignmentState;
  health: 'healthy' | 'warning' | 'critical';
  sourceDiscoveryJobId: string;
  preferredManagementIpPolicy: PreferredManagementIpPolicy;
  preferredManagementIpCandidate?: string;
}

export type InventoryAssignmentState = AssignmentState;

export interface Site {
  id: string;
  name: string;
  building: string;
  floor: string;
  health: 'healthy' | 'degraded';
}

export interface TopologyNode {
  id: string;
  deviceId: string;
  siteId: string;
  role: DeviceRole;
  shape: 'circle' | 'square' | 'hex';
}

export interface TopologyLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  quality: 'good' | 'unstable';
}

export interface Device360Context {
  deviceId: string;
  currentHealth: 'healthy' | 'warning' | 'critical';
  currentIssues: string[];
  recommendedNextAction: string;
}

export interface Issue {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  deviceId?: string;
  siteId?: string;
}

export interface HealthSummary {
  healthySites: number;
  degradedSites: number;
  healthyDevices: number;
  problematicDevices: number;
}

export interface TimelineEvent {
  id: string;
  deviceId: string;
  at: string;
  type: 'discovered' | 'assigned' | 'role-corrected' | 'issue-detected' | 'normalized' | 'policy-updated';
  message: string;
}

export interface Job {
  id: string;
  module: 'discovery' | 'inventory' | 'topology';
  status: JobStatus;
  createdAt: string;
}

export interface SeedData {
  credentialProfiles: CredentialProfile[];
  discoveryJobs: DiscoveryJob[];
  discoveryResults: DiscoveryResult[];
  devices: Device[];
  sites: Site[];
  topologyNodes: TopologyNode[];
  topologyLinks: TopologyLink[];
  device360Contexts: Device360Context[];
  issues: Issue[];
  timelineEvents: TimelineEvent[];
  jobs: Job[];
}
