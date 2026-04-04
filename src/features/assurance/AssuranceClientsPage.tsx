import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { selectClientHealth } from './clientSelectors';

export function AssuranceClientsPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';
  const rows = selectClientHealth(site || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>Assurance Client Health Lite</h1>
        <p>Client onboarding/connectivity posture with links to Client 360.</p>
      </div>

      <Panel title="Client Health List">
        <DataTable
          columns={['Client', 'Site', 'Floor', 'AP', 'Health', 'Onboarding', 'Connectivity', 'Actions']}
          rows={rows.map((row) => [
            row.name,
            row.siteId,
            row.floor,
            row.apName,
            <StatusBadge key={`${row.id}-health`} value={row.health} />,
            row.onboarding,
            row.connectivity,
            <>
              <Link to={`/client-360/${row.id}?site=${row.siteId}&issue=${issue}`}>Client 360</Link>
              {' | '}
              <Link to={`/device-360/${row.relatedDeviceId}`}>Device 360</Link>
              {' | '}
              <Link to={`/assurance/issues?site=${row.siteId}`}>Issues/Events</Link>
            </>
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
      </div>
    </div>
  );
}
