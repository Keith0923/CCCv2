import { SeedData } from '../../domains/types';
import { getIssueCategories } from '../assurance/selectors';

export function selectTroubleshootingContext(data: SeedData, params: { site?: string; device?: string; issue?: string }) {
  const device = params.device ? data.devices.find((d) => d.id === params.device) : undefined;
  const siteId = params.site ?? device?.siteId ?? '';
  const scopedDevices = siteId ? data.devices.filter((d) => d.siteId === siteId) : data.devices;

  const issue = params.issue ?? (device ? getIssueCategories(device)[0] : 'unassigned');
  const issueDevices = scopedDevices.filter((d) => getIssueCategories(d).includes(issue as any));

  const suspectedCategory = issue === 'mis-role'
    ? 'role normalization gap'
    : issue === 'mgmt-ambiguity'
      ? 'management reachability/policy ambiguity'
      : 'assignment/site mapping gap';

  const whyFlagged =
    issue === 'mis-role'
      ? 'Effective role remains unknown after discovery/normalization.'
      : issue === 'mgmt-ambiguity'
        ? 'Device reachability is not fully reachable for management path.'
        : 'Device is not assigned to an operational site context.';

  const recommendedNextView =
    issue === 'mis-role' ? 'Device 360' : issue === 'mgmt-ambiguity' ? 'Topology and Device 360' : 'Inventory and Topology';

  return {
    siteId,
    device,
    issue,
    issueDevices,
    suspectedCategory,
    whyFlagged,
    recommendedNextView
  };
}
