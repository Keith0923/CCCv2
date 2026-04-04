import { assuranceIssueEventSeed, clientSeed } from './clientSeed';
import { captureSessionSeed, pathTraceSeed } from './pathTraceSeed';

export function selectPathTraceSessions(filters: { client?: string; device?: string; site?: string; issue?: string }) {
  return pathTraceSeed.filter((row) => {
    if (filters.client && row.relatedClientId !== filters.client && row.sourceId !== filters.client) return false;
    if (filters.device && row.relatedDeviceId !== filters.device && row.sourceId !== filters.device) return false;
    if (filters.site && row.siteId !== filters.site && row.sourceId !== filters.site) return false;
    if (filters.issue && row.relatedIssueId !== filters.issue) return false;
    return true;
  });
}

export function selectPathTraceContext(traceId?: string) {
  const trace = traceId ? pathTraceSeed.find((row) => row.id === traceId) : undefined;
  if (!trace) return undefined;

  const issue = trace.relatedIssueId ? assuranceIssueEventSeed.find((row) => row.id === trace.relatedIssueId) : undefined;
  const client = trace.relatedClientId ? clientSeed.find((row) => row.id === trace.relatedClientId) : undefined;

  return { trace, issue, client };
}

export function selectCaptureSessions(filters: { client?: string; device?: string; site?: string }) {
  return captureSessionSeed.filter((row) => {
    if (filters.client && !(row.targetType === 'client' && row.targetId === filters.client)) return false;
    if (filters.device && !(row.targetType === 'device' && row.targetId === filters.device)) return false;
    if (filters.site && row.siteId !== filters.site) return false;
    return true;
  });
}
