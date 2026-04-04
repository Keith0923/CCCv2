export type ComplianceStatus = 'compliant' | 'non-compliant' | 'unknown';
export type ComplianceReasonCategory = 'config-drift' | 'intent-mismatch' | 'missing-setting' | 'stale-policy';

export interface ComplianceFinding {
  id: string;
  deviceId: string;
  status: ComplianceStatus;
  reasonCategory?: ComplianceReasonCategory;
  finding: string;
  policy: string;
  recommendedNextView: 'device-360' | 'topology' | 'assurance' | 'troubleshooting';
  checkedAt: string;
}

export const complianceSeed: ComplianceFinding[] = [
  {
    id: 'cmp-1',
    deviceId: 'dev-1',
    status: 'non-compliant',
    reasonCategory: 'intent-mismatch',
    finding: 'Access policy expects voice VLAN 20 but running policy maps voice to VLAN 30.',
    policy: 'Campus Access Intent v2',
    recommendedNextView: 'device-360',
    checkedAt: '2026-03-31T08:30:00.000Z'
  },
  {
    id: 'cmp-2',
    deviceId: 'dev-2',
    status: 'non-compliant',
    reasonCategory: 'config-drift',
    finding: 'NTP source interface drifted from Loopback0 to Vlan1 after manual change.',
    policy: 'Core Baseline Policy',
    recommendedNextView: 'topology',
    checkedAt: '2026-03-31T08:42:00.000Z'
  },
  {
    id: 'cmp-3',
    deviceId: 'dev-3',
    status: 'compliant',
    finding: 'All checked controls align with policy baseline.',
    policy: 'Distribution Baseline Policy',
    recommendedNextView: 'assurance',
    checkedAt: '2026-03-31T08:51:00.000Z'
  },
  {
    id: 'cmp-4',
    deviceId: 'dev-4',
    status: 'unknown',
    finding: 'Last policy snapshot is stale; no recent compliance run in last 24h.',
    policy: 'Edge Baseline Policy',
    recommendedNextView: 'troubleshooting',
    checkedAt: '2026-03-30T14:15:00.000Z'
  }
];
