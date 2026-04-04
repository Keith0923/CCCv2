export interface FabricSiteLite {
  siteId: string;
  siteRole: 'campus' | 'branch';
  fabricRole: 'border' | 'control-plane' | 'edge';
  fabricHealth: 'healthy' | 'warning' | 'critical';
  onboardingStatus: 'success' | 'partial' | 'failed';
  onboardingCount: number;
}

export interface PolicyGroupLite {
  id: string;
  name: string;
  type: 'endpoint-group' | 'scalable-group';
}

export interface PolicyContractLite {
  fromGroup: string;
  toGroup: string;
  relation: 'allow' | 'deny' | 'unknown';
}

export interface AdvancedCorrelationLite {
  id: string;
  siteId: string;
  impactedEndpoint: string;
  impactedPolicyGroup: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
}

export const fabricSiteSeed: FabricSiteLite[] = [
  { siteId: 'site-hq-f1', siteRole: 'campus', fabricRole: 'border', fabricHealth: 'warning', onboardingStatus: 'partial', onboardingCount: 32 },
  { siteId: 'site-hq-f2', siteRole: 'campus', fabricRole: 'edge', fabricHealth: 'healthy', onboardingStatus: 'success', onboardingCount: 21 },
  { siteId: 'site-br1-f1', siteRole: 'branch', fabricRole: 'edge', fabricHealth: 'warning', onboardingStatus: 'failed', onboardingCount: 8 }
];

export const policyGroupSeed: PolicyGroupLite[] = [
  { id: 'grp-user', name: 'User Endpoints', type: 'endpoint-group' },
  { id: 'grp-voice', name: 'Voice Endpoints', type: 'endpoint-group' },
  { id: 'grp-iot', name: 'IoT Devices', type: 'endpoint-group' },
  { id: 'sgt-ops', name: 'Ops SGT', type: 'scalable-group' }
];

export const policyContractSeed: PolicyContractLite[] = [
  { fromGroup: 'grp-user', toGroup: 'sgt-ops', relation: 'allow' },
  { fromGroup: 'grp-iot', toGroup: 'sgt-ops', relation: 'deny' },
  { fromGroup: 'grp-voice', toGroup: 'sgt-ops', relation: 'unknown' }
];

export const advancedCorrelationSeed: AdvancedCorrelationLite[] = [
  { id: 'corr-1', siteId: 'site-hq-f1', impactedEndpoint: 'Client-77', impactedPolicyGroup: 'grp-user', issue: 'Policy contract mismatch after onboarding.', severity: 'high' },
  { id: 'corr-2', siteId: 'site-br1-f1', impactedEndpoint: 'BR1-AP-11', impactedPolicyGroup: 'grp-iot', issue: 'Endpoint onboarding failed and policy assignment is stale.', severity: 'medium' },
  { id: 'corr-3', siteId: 'site-hq-f2', impactedEndpoint: 'Client-88', impactedPolicyGroup: 'grp-voice', issue: 'Voice group contract state unknown.', severity: 'low' }
];
