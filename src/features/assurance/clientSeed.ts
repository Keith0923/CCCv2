export type ClientHealth = 'healthy' | 'warning' | 'critical';
export type ClientOnboarding = 'onboarded' | 'auth-failed' | 'dhcp-pending';
export type ClientConnectivity = 'good' | 'intermittent' | 'disconnected';

export interface ClientLite {
  id: string;
  name: string;
  siteId: string;
  floor: string;
  apName: string;
  relatedDeviceId: string;
  health: ClientHealth;
  onboarding: ClientOnboarding;
  connectivity: ClientConnectivity;
}

export interface AssuranceIssueEventLite {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  category: 'connectivity' | 'monitoring' | 'device-health' | 'network-health';
  status: 'open' | 'acknowledged' | 'resolved';
  siteId: string;
  deviceId?: string;
  clientId?: string;
}

export interface AssuranceTrendLite {
  range: '1h' | '24h' | '7d';
  avgHealth: number;
  worstSite: string;
  worstFloor: string;
  worstClient: string;
}

export const clientSeed: ClientLite[] = [
  { id: 'cli-1', name: 'Client-77', siteId: 'site-hq-f1', floor: '1F', apName: 'AP-East', relatedDeviceId: 'dev-2', health: 'warning', onboarding: 'onboarded', connectivity: 'intermittent' },
  { id: 'cli-2', name: 'Client-23', siteId: 'site-hq-f1', floor: '1F', apName: 'AP-Lobby', relatedDeviceId: 'dev-2', health: 'healthy', onboarding: 'onboarded', connectivity: 'good' },
  { id: 'cli-3', name: 'Client-88', siteId: 'site-hq-f2', floor: '2F', apName: 'AP-HQ2-West', relatedDeviceId: 'dev-3', health: 'warning', onboarding: 'dhcp-pending', connectivity: 'intermittent' },
  { id: 'cli-4', name: 'Client-12', siteId: 'site-br1-f1', floor: '1F', apName: 'AP-Core', relatedDeviceId: 'dev-4', health: 'critical', onboarding: 'auth-failed', connectivity: 'disconnected' }
];

export const assuranceIssueEventSeed: AssuranceIssueEventLite[] = [
  { id: 'aie-1', title: 'Client authentication failures elevated', severity: 'high', category: 'connectivity', status: 'open', siteId: 'site-br1-f1', clientId: 'cli-4', deviceId: 'dev-4' },
  { id: 'aie-2', title: 'WLC telemetry delay detected', severity: 'medium', category: 'monitoring', status: 'acknowledged', siteId: 'site-hq-f1', deviceId: 'dev-2' },
  { id: 'aie-3', title: 'Access edge health below threshold', severity: 'medium', category: 'device-health', status: 'open', siteId: 'site-hq-f2', deviceId: 'dev-3' },
  { id: 'aie-4', title: 'Fabric branch path instability', severity: 'low', category: 'network-health', status: 'resolved', siteId: 'site-br1-f1', deviceId: 'dev-5' }
];

export const assuranceTrendSeed: AssuranceTrendLite[] = [
  { range: '1h', avgHealth: 82, worstSite: 'site-br1-f1', worstFloor: '1F', worstClient: 'Client-12' },
  { range: '24h', avgHealth: 86, worstSite: 'site-hq-f1', worstFloor: '1F', worstClient: 'Client-77' },
  { range: '7d', avgHealth: 88, worstSite: 'site-br1-f1', worstFloor: '1F', worstClient: 'Client-12' }
];
