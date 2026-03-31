export type ConnectorType = 'servicenow' | 'generic-rest' | 'pagerduty' | 'webex';
export type DeliveryState = 'success' | 'partial' | 'failed' | 'disabled';

export interface ConnectorLite {
  id: string;
  name: string;
  type: ConnectorType;
  status: 'active' | 'paused';
  purpose: string;
}

export interface SubscriptionLite {
  id: string;
  eventCategory: 'device-issue' | 'site-health-change' | 'compliance-violation' | 'software-task-failure';
  connectorId: string;
  enabled: boolean;
}

export interface DeliveryLogLite {
  id: string;
  eventCategory: SubscriptionLite['eventCategory'];
  connectorId: string;
  result: DeliveryState;
  detail: string;
  createdAt: string;
}

export const connectorSeed: ConnectorLite[] = [
  { id: 'conn-1', name: 'ServiceNow Incident Bridge', type: 'servicenow', status: 'active', purpose: 'Create incident records for high-impact events.' },
  { id: 'conn-2', name: 'Ops Generic REST', type: 'generic-rest', status: 'active', purpose: 'Forward normalized events to external middleware.' },
  { id: 'conn-3', name: 'PagerDuty NOC Escalation', type: 'pagerduty', status: 'paused', purpose: 'Page on-call rotation for urgent outages.' },
  { id: 'conn-4', name: 'Webex Ops Space', type: 'webex', status: 'active', purpose: 'Post event notifications to collaboration room.' }
];

export const subscriptionSeed: SubscriptionLite[] = [
  { id: 'sub-1', eventCategory: 'device-issue', connectorId: 'conn-1', enabled: true },
  { id: 'sub-2', eventCategory: 'site-health-change', connectorId: 'conn-2', enabled: true },
  { id: 'sub-3', eventCategory: 'compliance-violation', connectorId: 'conn-4', enabled: true },
  { id: 'sub-4', eventCategory: 'software-task-failure', connectorId: 'conn-3', enabled: false }
];

export const deliveryLogSeed: DeliveryLogLite[] = [
  { id: 'dl-1', eventCategory: 'device-issue', connectorId: 'conn-1', result: 'success', detail: 'Incident payload accepted with ticket INC001245.', createdAt: '2026-03-31T09:10:00.000Z' },
  { id: 'dl-2', eventCategory: 'site-health-change', connectorId: 'conn-2', result: 'partial', detail: 'Primary endpoint accepted; fallback endpoint timed out.', createdAt: '2026-03-31T09:04:00.000Z' },
  { id: 'dl-3', eventCategory: 'compliance-violation', connectorId: 'conn-4', result: 'success', detail: 'Message delivered to Webex space #ops-events.', createdAt: '2026-03-31T08:58:00.000Z' },
  { id: 'dl-4', eventCategory: 'software-task-failure', connectorId: 'conn-3', result: 'disabled', detail: 'Delivery skipped because connector is paused.', createdAt: '2026-03-31T08:52:00.000Z' }
];
