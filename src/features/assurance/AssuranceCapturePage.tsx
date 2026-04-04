import { Link, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { EmptyState } from '../../components/EmptyState';
import { Panel } from '../../components/Panel';
import { StatusBadge } from '../../components/StatusBadge';
import { selectCaptureSessions } from './pathTraceSelectors';

export function AssuranceCapturePage() {
  const [params] = useSearchParams();
  const client = params.get('client') ?? undefined;
  const device = params.get('device') ?? undefined;
  const site = params.get('site') ?? undefined;
  const trace = params.get('trace') ?? undefined;

  const sessions = selectCaptureSessions({ client, device, site });
  const selected = sessions[0];

  return (
    <div>
      <div className="page-header">
        <h1>Intelligent Capture Lite</h1>
        <p>Minimal follow-up observations after Path Trace checks.</p>
      </div>

      <Panel title="Capture Session Summary">
        <DataTable
          columns={['Session', 'Target', 'Reason', 'Status', 'Observation']}
          rows={sessions.map((row) => [
            row.id,
            `${row.targetType}:${row.targetId}`,
            row.reason,
            <StatusBadge key={`${row.id}-status`} value={row.status === 'completed' ? 'healthy' : row.status === 'running' ? 'warning' : row.status === 'queued' ? 'warning' : 'critical'} />,
            row.observation
          ])}
        />
      </Panel>

      <Panel title="Session Detail (Lite)">
        {!selected && <EmptyState title="No capture session" description="Open from Path Trace or issue context to pre-fill target." />}
        {selected && (
          <>
            <p>Target: {selected.targetType}:{selected.targetId}</p>
            <p>Reason: {selected.reason}</p>
            <p>Status: {selected.status}</p>
            <p>Observation: {selected.observation}</p>
          </>
        )}
      </Panel>

      <div className="quick-links">
        <Link to={trace ? `/assurance/path-trace?trace=${trace}${client ? `&client=${client}` : ''}${device ? `&device=${device}` : ''}${site ? `&site=${site}` : ''}` : '/assurance/path-trace'}>Back to Path Trace</Link>
        <Link to={site ? `/assurance?site=${site}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        {device && <Link to={`/device-360/${device}`}>Back to Device 360</Link>}
        {client && <Link to={`/client-360/${client}${site ? `?site=${site}` : ''}`}>Back to Client 360</Link>}
      </div>
    </div>
  );
}
