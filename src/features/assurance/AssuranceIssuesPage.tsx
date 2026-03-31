import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { selectAssuranceIssues } from './clientSelectors';

export function AssuranceIssuesPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';

  const rows = selectAssuranceIssues(site || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>Assurance Issues / Events Lite</h1>
        <p>Severity/category/status with downstream troubleshooting actions.</p>
      </div>

      <Panel title="Issue / Event List">
        <DataTable
          columns={['Title', 'Severity', 'Category', 'Status', 'Site', 'Device', 'Client', 'Actions']}
          rows={rows.map((row) => [
            row.title,
            <StatusBadge key={`${row.id}-sev`} value={row.severity === 'high' ? 'critical' : row.severity === 'medium' ? 'warning' : 'healthy'} />,
            row.category,
            row.status,
            row.siteId,
            row.deviceId ?? '-',
            row.clientId ?? '-',
            <>
              {row.deviceId ? <Link to={`/device-360/${row.deviceId}`}>Device 360</Link> : '-'}
              {' | '}
              {row.clientId ? <Link to={`/client-360/${row.clientId}?site=${row.siteId}&issue=${issue}`}>Client 360</Link> : '-'}
              {' | '}
              <Link to={`/troubleshooting?site=${row.siteId}&device=${row.deviceId ?? ''}&issue=${row.category}`}>Troubleshooting</Link>
              {' | '}
              <Link to={`/command-runner?site=${row.siteId}&device=${row.deviceId ?? ''}&issue=${row.category}`}>Command Runner</Link>
              {' | '}
              <Link to={`/assurance/path-trace?site=${row.siteId}${row.deviceId ? `&device=${row.deviceId}` : ''}${row.clientId ? `&client=${row.clientId}` : ''}&issue=${row.id}`}>Path Trace</Link>
              {' | '}
              <Link to={`/assurance/capture?site=${row.siteId}${row.deviceId ? `&device=${row.deviceId}` : ''}${row.clientId ? `&client=${row.clientId}` : ''}`}>Capture Lite</Link>
            </>
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/assurance/clients?site=${site}&issue=${issue}` : '/assurance/clients'}>Go Client Health</Link>
      </div>
    </div>
  );
}
