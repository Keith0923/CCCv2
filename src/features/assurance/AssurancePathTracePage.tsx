import { Link, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { EmptyState } from '../../components/EmptyState';
import { Panel } from '../../components/Panel';
import { StatusBadge } from '../../components/StatusBadge';
import { selectPathTraceContext, selectPathTraceSessions } from './pathTraceSelectors';

export function AssurancePathTracePage() {
  const [params] = useSearchParams();
  const client = params.get('client') ?? undefined;
  const device = params.get('device') ?? undefined;
  const site = params.get('site') ?? undefined;
  const issue = params.get('issue') ?? undefined;
  const traceId = params.get('trace') ?? undefined;

  const sessions = selectPathTraceSessions({ client, device, site, issue });
  const selected = selectPathTraceContext(traceId ?? sessions[0]?.id);

  const sourceHint = client ? `client:${client}` : device ? `device:${device}` : site ? `site:${site}` : 'seed-default';
  const destinationHint = selected?.trace.destination ?? 'auth-service';

  return (
    <div>
      <div className="page-header">
        <h1>Assurance Path Trace Lite</h1>
        <p>Connectivity path drill-down with hop-by-hop status.</p>
      </div>

      <Panel title="Trace Input (Lite)">
        <p>Source: {sourceHint}</p>
        <p>Destination: {destinationHint}</p>
      </Panel>

      <Panel title="Trace Session List">
        <DataTable
          columns={['Trace', 'Source', 'Destination', 'Result', 'Site', 'Actions']}
          rows={sessions.map((row) => [
            row.id,
            `${row.sourceType}:${row.sourceId}`,
            row.destination,
            <StatusBadge key={`${row.id}-result`} value={row.result === 'success' ? 'healthy' : row.result === 'partial' ? 'warning' : 'critical'} />,
            row.siteId,
            <>
              <Link to={`/assurance/path-trace?trace=${row.id}${row.relatedClientId ? `&client=${row.relatedClientId}` : ''}${row.relatedDeviceId ? `&device=${row.relatedDeviceId}` : ''}&site=${row.siteId}${row.relatedIssueId ? `&issue=${row.relatedIssueId}` : ''}`}>Open hops</Link>
              {' | '}
              <Link to={`/assurance/capture?${row.relatedClientId ? `client=${row.relatedClientId}&` : ''}${row.relatedDeviceId ? `device=${row.relatedDeviceId}&` : ''}site=${row.siteId}&trace=${row.id}`}>Capture Lite</Link>
            </>
          ])}
        />
      </Panel>

      <Panel title="Hop Detail">
        {!selected && <EmptyState title="No trace session" description="Adjust filters from issue/client/device/site context." />}
        {selected && (
          <DataTable
            columns={['Hop', 'Node Type', 'Node Name', 'Status', 'Note']}
            rows={selected.trace.hops.map((hop) => [
              hop.order,
              hop.nodeType,
              hop.nodeName,
              <StatusBadge key={`${selected.trace.id}-${hop.order}`} value={hop.status === 'ok' ? 'healthy' : hop.status === 'warn' ? 'warning' : 'critical'} />,
              hop.note ?? '-'
            ])}
          />
        )}
      </Panel>

      <Panel title="Related Context">
        <p>Related issue: {selected?.issue?.title ?? issue ?? '-'}</p>
        <p>Related client: {selected?.client?.name ?? client ?? '-'}</p>
        <p>Related device: {selected?.trace.relatedDeviceId ?? device ?? '-'}</p>
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        {selected?.trace.relatedDeviceId && <Link to={`/device-360/${selected.trace.relatedDeviceId}`}>Back to Device 360</Link>}
        {selected?.trace.relatedClientId && <Link to={`/client-360/${selected.trace.relatedClientId}?site=${selected.trace.siteId}${selected.trace.relatedIssueId ? `&issue=${selected.trace.relatedIssueId}` : ''}`}>Back to Client 360</Link>}
        <Link to={`/troubleshooting?site=${site ?? selected?.trace.siteId ?? ''}${selected?.trace.relatedDeviceId ? `&device=${selected.trace.relatedDeviceId}` : ''}${selected?.trace.relatedIssueId ? `&issue=${selected.trace.relatedIssueId}` : ''}`}>Go Troubleshooting</Link>
      </div>
    </div>
  );
}
