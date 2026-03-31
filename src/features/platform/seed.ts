export type ApiCategory = 'discovery' | 'inventory' | 'topology' | 'assurance-events';

export interface ApiEndpointLite {
  id: string;
  category: ApiCategory;
  method: 'GET' | 'POST';
  path: string;
  purpose: string;
}

export interface EventLite {
  id: string;
  category: 'device-issue' | 'site-health-change' | 'compliance-violation';
  severity: 'low' | 'medium' | 'high';
  summary: string;
  samplePayload: string;
}

export interface DestinationLite {
  id: string;
  type: 'webhook' | 'email' | 'syslog' | 'snmp-trap';
  target: string;
  status: 'active' | 'paused';
}

export const apiCatalogSeed: ApiEndpointLite[] = [
  { id: 'api-1', category: 'discovery', method: 'POST', path: '/dna/intent/api/v1/discovery', purpose: 'Start discovery workflow in automation pipelines.' },
  { id: 'api-2', category: 'inventory', method: 'GET', path: '/dna/intent/api/v1/network-device', purpose: 'Fetch device inventory for CMDB or scripts.' },
  { id: 'api-3', category: 'topology', method: 'GET', path: '/dna/intent/api/v1/topology/physical-topology', purpose: 'Read physical links for dependency mapping.' },
  { id: 'api-4', category: 'assurance-events', method: 'GET', path: '/dna/intent/api/v1/issues', purpose: 'Pull current issues for incident enrichment.' }
];

export const eventSeed: EventLite[] = [
  {
    id: 'evt-1',
    category: 'device-issue',
    severity: 'high',
    summary: 'Core switch reachability degraded.',
    samplePayload: '{"event":"device-issue","deviceId":"dev-2","issue":"mgmt-ambiguity"}'
  },
  {
    id: 'evt-2',
    category: 'site-health-change',
    severity: 'medium',
    summary: 'Site SJC-Campus changed from healthy to degraded.',
    samplePayload: '{"event":"site-health-change","site":"SJC-Campus","health":"degraded"}'
  },
  {
    id: 'evt-3',
    category: 'compliance-violation',
    severity: 'medium',
    summary: 'Policy intent mismatch on access switch.',
    samplePayload: '{"event":"compliance-violation","deviceId":"dev-1","reason":"intent-mismatch"}'
  }
];

export const destinationSeed: DestinationLite[] = [
  { id: 'dest-1', type: 'webhook', target: 'https://ops.example.local/hooks/catc', status: 'active' },
  { id: 'dest-2', type: 'email', target: 'noc@example.local', status: 'active' },
  { id: 'dest-3', type: 'syslog', target: '10.10.50.20:514', status: 'paused' },
  { id: 'dest-4', type: 'snmp-trap', target: '10.10.60.15:162', status: 'active' }
];
