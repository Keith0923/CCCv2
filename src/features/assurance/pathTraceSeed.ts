export type PathTraceResult = 'success' | 'partial' | 'failed';

export interface PathTraceHop {
  order: number;
  nodeType: 'client' | 'ap' | 'switch' | 'router' | 'wlc' | 'service';
  nodeName: string;
  status: 'ok' | 'warn' | 'down';
  note?: string;
}

export interface PathTraceSessionLite {
  id: string;
  sourceType: 'client' | 'device' | 'site';
  sourceId: string;
  destination: string;
  siteId: string;
  relatedIssueId?: string;
  relatedDeviceId?: string;
  relatedClientId?: string;
  result: PathTraceResult;
  hops: PathTraceHop[];
}

export interface CaptureSessionLite {
  id: string;
  targetType: 'client' | 'ap' | 'device';
  targetId: string;
  siteId: string;
  reason: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  observation: string;
  linkedPathTraceId?: string;
}

export const pathTraceSeed: PathTraceSessionLite[] = [
  {
    id: 'pt-1',
    sourceType: 'client',
    sourceId: 'cli-4',
    destination: 'auth-service',
    siteId: 'site-br1-f1',
    relatedIssueId: 'aie-1',
    relatedDeviceId: 'dev-4',
    relatedClientId: 'cli-4',
    result: 'failed',
    hops: [
      { order: 1, nodeType: 'client', nodeName: 'Client-12', status: 'ok' },
      { order: 2, nodeType: 'ap', nodeName: 'AP-Core', status: 'ok' },
      { order: 3, nodeType: 'switch', nodeName: 'BR1-Access-1', status: 'warn', note: 'High retry rate' },
      { order: 4, nodeType: 'service', nodeName: 'Auth-Service', status: 'down', note: 'RADIUS timeout' }
    ]
  },
  {
    id: 'pt-2',
    sourceType: 'device',
    sourceId: 'dev-2',
    destination: 'dnac-controller',
    siteId: 'site-hq-f1',
    relatedIssueId: 'aie-2',
    relatedDeviceId: 'dev-2',
    result: 'partial',
    hops: [
      { order: 1, nodeType: 'switch', nodeName: 'HQ1-Access-2', status: 'ok' },
      { order: 2, nodeType: 'wlc', nodeName: 'WLC-Cluster-A', status: 'warn', note: 'Telemetry lag' },
      { order: 3, nodeType: 'service', nodeName: 'DNAC-Control', status: 'ok' }
    ]
  },
  {
    id: 'pt-3',
    sourceType: 'site',
    sourceId: 'site-hq-f2',
    destination: 'gateway',
    siteId: 'site-hq-f2',
    relatedIssueId: 'aie-3',
    relatedDeviceId: 'dev-3',
    result: 'success',
    hops: [
      { order: 1, nodeType: 'switch', nodeName: 'HQ2-Access-3', status: 'ok' },
      { order: 2, nodeType: 'router', nodeName: 'HQ2-Distribution-1', status: 'ok' },
      { order: 3, nodeType: 'service', nodeName: 'Northbound-Gateway', status: 'ok' }
    ]
  }
];

export const captureSessionSeed: CaptureSessionLite[] = [
  {
    id: 'cap-1',
    targetType: 'client',
    targetId: 'cli-4',
    siteId: 'site-br1-f1',
    reason: 'Path Trace failed at auth hop',
    status: 'completed',
    observation: 'EAP retransmission spikes before auth timeout.',
    linkedPathTraceId: 'pt-1'
  },
  {
    id: 'cap-2',
    targetType: 'device',
    targetId: 'dev-2',
    siteId: 'site-hq-f1',
    reason: 'Telemetry jitter observed in path trace',
    status: 'running',
    observation: 'Control-plane queue depth intermittently high.',
    linkedPathTraceId: 'pt-2'
  }
];
