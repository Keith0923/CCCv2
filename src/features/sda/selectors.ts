import { advancedCorrelationSeed, fabricSiteSeed, policyContractSeed, policyGroupSeed } from './seed';

export function selectFabricOverview(site?: string) {
  const sites = site ? fabricSiteSeed.filter((row) => row.siteId === site) : fabricSiteSeed;
  return {
    sites,
    summary: {
      healthy: sites.filter((row) => row.fabricHealth === 'healthy').length,
      warning: sites.filter((row) => row.fabricHealth === 'warning').length,
      critical: sites.filter((row) => row.fabricHealth === 'critical').length,
      failedOnboarding: sites.filter((row) => row.onboardingStatus === 'failed').length
    }
  };
}

export function selectPolicyMatrix(group?: string) {
  const groups = group ? policyGroupSeed.filter((row) => row.id === group) : policyGroupSeed;
  const groupIds = new Set(groups.map((row) => row.id));
  const contracts = policyContractSeed.filter((row) => {
    if (!group) return true;
    return groupIds.has(row.fromGroup) || groupIds.has(row.toGroup);
  });
  return { groups, contracts };
}

export function selectAdvancedCorrelation(site?: string) {
  const rows = site ? advancedCorrelationSeed.filter((row) => row.siteId === site) : advancedCorrelationSeed;
  return {
    rows,
    summary: {
      high: rows.filter((row) => row.severity === 'high').length,
      medium: rows.filter((row) => row.severity === 'medium').length,
      low: rows.filter((row) => row.severity === 'low').length
    }
  };
}
