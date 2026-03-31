import { SeedData } from '../../domains/types';
import { complianceSeed, ComplianceReasonCategory, ComplianceStatus } from './seed';

type ComplianceDeviceRow = {
  deviceId: string;
  deviceName: string;
  siteId: string;
  status: ComplianceStatus;
  reasonCategory?: ComplianceReasonCategory;
  policy: string;
  finding: string;
  checkedAt: string;
};

export function selectComplianceSummary(data: SeedData, site?: string) {
  const devices = site ? data.devices.filter((d) => d.siteId === site) : data.devices;
  const deviceMap = new Map(devices.map((d) => [d.id, d]));

  const rows: ComplianceDeviceRow[] = complianceSeed
    .filter((finding) => deviceMap.has(finding.deviceId))
    .map((finding) => {
      const device = deviceMap.get(finding.deviceId)!;
      return {
        deviceId: device.id,
        deviceName: device.name,
        siteId: device.siteId,
        status: finding.status,
        reasonCategory: finding.reasonCategory,
        policy: finding.policy,
        finding: finding.finding,
        checkedAt: finding.checkedAt
      };
    });

  const totals = {
    compliant: rows.filter((r) => r.status === 'compliant').length,
    nonCompliant: rows.filter((r) => r.status === 'non-compliant').length,
    unknown: rows.filter((r) => r.status === 'unknown').length
  };

  const reasonSummary: Record<ComplianceReasonCategory, number> = {
    'config-drift': rows.filter((r) => r.reasonCategory === 'config-drift').length,
    'intent-mismatch': rows.filter((r) => r.reasonCategory === 'intent-mismatch').length,
    'missing-setting': rows.filter((r) => r.reasonCategory === 'missing-setting').length,
    'stale-policy': rows.filter((r) => r.reasonCategory === 'stale-policy').length
  };

  return { rows, totals, reasonSummary };
}

export function selectComplianceDeviceDetail(data: SeedData, deviceId: string) {
  const device = data.devices.find((d) => d.id === deviceId);
  const finding = complianceSeed.find((row) => row.deviceId === deviceId);
  if (!device) return undefined;

  return {
    device,
    status: finding?.status ?? 'unknown',
    policy: finding?.policy ?? 'No policy attached',
    reasonCategory: finding?.reasonCategory,
    finding: finding?.finding ?? 'No recent compliance finding for this device.',
    checkedAt: finding?.checkedAt ?? 'not-checked',
    recommendedNextView: finding?.recommendedNextView ?? 'assurance'
  };
}
