import { SeedData } from '../../domains/types';
import { assuranceIssueEventSeed, assuranceTrendSeed, clientSeed } from './clientSeed';

export function selectClientHealth(site?: string) {
  return site ? clientSeed.filter((row) => row.siteId === site) : clientSeed;
}

export function selectClient360(clientId: string, data: SeedData) {
  const client = clientSeed.find((row) => row.id === clientId);
  if (!client) return undefined;
  const relatedIssues = assuranceIssueEventSeed.filter((issue) => issue.clientId === client.id || issue.deviceId === client.relatedDeviceId);
  const relatedDevice = data.devices.find((device) => device.id === client.relatedDeviceId);
  return { client, relatedIssues, relatedDevice };
}

export function selectAssuranceIssues(site?: string) {
  return site ? assuranceIssueEventSeed.filter((row) => row.siteId === site) : assuranceIssueEventSeed;
}

export function selectAssuranceTrend(range: '1h' | '24h' | '7d') {
  return assuranceTrendSeed.find((row) => row.range === range) ?? assuranceTrendSeed[1];
}
