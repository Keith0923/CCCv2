import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { selectRecentActivities } from './selectors';

export function ActivitiesPage() {
  const { commandRuns, provisionTasks, softwareTasks } = useAppState();
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const rows = selectRecentActivities({ commandRuns, provisionTasks, softwareTasks });

  return (
    <div>
      <div className="page-header">
        <h1>Activities / Tasks</h1>
        <p>Recent command runs and task results in one lightweight feed.</p>
      </div>

      <Panel title="Context">
        <p>Site: {site || 'all'} / Device: {device || 'not fixed'} / Issue: {issue || 'none'}</p>
      </Panel>

      <Panel title="Recent Activities">
        <DataTable
          columns={['ID', 'Type', 'Target', 'Context', 'Status', 'Created']}
          rows={rows.map((row) => [
            row.id,
            row.type,
            row.target,
            row.context,
            <StatusBadge key={row.id} value={row.status} />,
            row.createdAt
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={device ? `/device-360/${device}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to={site ? `/assurance?site=${site}` : '/assurance'}>Back to Assurance</Link>
        <Link to={device ? `/troubleshooting?site=${site}&device=${device}&issue=${issue}` : '/troubleshooting'}>Back to Troubleshooting</Link>
        <Link to={device ? `/command-runner?site=${site}&device=${device}&issue=${issue}` : '/command-runner'}>Back to Command Runner</Link>
        <Link to={device ? `/compliance?site=${site}&device=${device}&issue=${issue}` : '/compliance'}>Go Compliance</Link>
        <Link to={device ? `/platform?site=${site}&device=${device}&issue=${issue}` : '/platform'}>Go Platform</Link>
        <Link to={device ? `/platform/itsm?site=${site}&issue=${issue}` : '/platform/itsm'}>Go ITSM Workflow</Link>
      </div>
    </div>
  );
}
