import { Device, SeedData } from '../../domains/types';

export type IssueCategory = 'unassigned' | 'mis-role' | 'mgmt-ambiguity';

export function getEffectiveRole(device: Device) {
  return device.roleOverride ?? device.roleDetected;
}

export function getIssueCategories(device: Device): IssueCategory[] {
  const categories: IssueCategory[] = [];
  if (device.assignmentState !== 'assigned') categories.push('unassigned');
  if (getEffectiveRole(device) === 'unknown') categories.push('mis-role');
  if (device.reachability !== 'reachable') categories.push('mgmt-ambiguity');
  return categories;
}

export function selectAssuranceSummary(data: SeedData, focusedSite?: string) {
  const siteFiltered = focusedSite ? data.devices.filter((d) => d.siteId === focusedSite) : data.devices;

  const siteSummary = data.sites
    .filter((s) => !focusedSite || s.id === focusedSite)
    .map((site) => {
      const devices = data.devices.filter((d) => d.siteId === site.id);
      const impacted = devices.filter((d) => getIssueCategories(d).length > 0).length;
      return {
        siteId: site.id,
        name: `${site.name} / ${site.building} / ${site.floor}`,
        health: impacted > 0 ? 'degraded' : 'healthy',
        impacted,
        totalDevices: devices.length
      };
    });

  const categorySummary = {
    unassigned: siteFiltered.filter((d) => d.assignmentState !== 'assigned').length,
    'mis-role': siteFiltered.filter((d) => getEffectiveRole(d) === 'unknown').length,
    'mgmt-ambiguity': siteFiltered.filter((d) => d.reachability !== 'reachable').length
  };

  const impactedDevices = siteFiltered
    .map((device) => ({ device, categories: getIssueCategories(device) }))
    .filter((row) => row.categories.length > 0)
    .sort((a, b) => b.categories.length - a.categories.length);

  const healthTotals = {
    healthySites: siteSummary.filter((s) => s.health === 'healthy').length,
    degradedSites: siteSummary.filter((s) => s.health === 'degraded').length,
    impactedDevices: impactedDevices.length
  };

  return { siteSummary, categorySummary, impactedDevices, healthTotals };
}
