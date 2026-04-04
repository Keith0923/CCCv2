import { apiCatalogSeed, destinationSeed, eventSeed } from './seed';

export function selectApiCategorySummary() {
  return {
    discovery: apiCatalogSeed.filter((x) => x.category === 'discovery').length,
    inventory: apiCatalogSeed.filter((x) => x.category === 'inventory').length,
    topology: apiCatalogSeed.filter((x) => x.category === 'topology').length,
    assuranceEvents: apiCatalogSeed.filter((x) => x.category === 'assurance-events').length
  };
}

export function selectEventSummary() {
  return {
    high: eventSeed.filter((x) => x.severity === 'high').length,
    medium: eventSeed.filter((x) => x.severity === 'medium').length,
    low: eventSeed.filter((x) => x.severity === 'low').length,
    categories: {
      deviceIssue: eventSeed.filter((x) => x.category === 'device-issue').length,
      siteHealthChange: eventSeed.filter((x) => x.category === 'site-health-change').length,
      complianceViolation: eventSeed.filter((x) => x.category === 'compliance-violation').length
    },
    destinations: destinationSeed.length
  };
}
