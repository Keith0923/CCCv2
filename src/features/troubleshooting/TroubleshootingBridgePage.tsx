import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { useAppState } from '../../app/state';
import { selectTroubleshootingContext } from './selectors';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';

export function TroubleshootingBridgePage() {
  const { data } = useAppState();
  const [params] = useSearchParams();

  const context = selectTroubleshootingContext(data, {
    site: params.get('site') ?? undefined,
    device: params.get('device') ?? undefined,
    issue: params.get('issue') ?? undefined
  });

  return (
    <div>
      <div className="page-header">
        <h1>Troubleshooting Bridge</h1>
        <p>Thin bridge: classify issue context and route to next best view.</p>
      </div>

      <Panel title="Context Summary">
        <p>Site: {context.siteId || 'all'}</p>
        <p>Device: {context.device?.name ?? 'not fixed'}</p>
        <p>Issue context: <IssueTag value={context.issue} /></p>
        <p>Current health: <StatusBadge value={context.device?.health ?? 'warning'} /></p>
      </Panel>

      <Panel title="Suspected Category">
        <p>{context.suspectedCategory}</p>
      </Panel>

      <Panel title="Why This Is Flagged">
        <p>{context.whyFlagged}</p>
      </Panel>

      <Panel title="Recommended Next Step">
        <p>Recommended next view: {context.recommendedNextView}</p>
        <p><Link to={context.device ? `/command-runner?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/command-runner?site=${context.siteId}&issue=${context.issue}`}>Open in Command Runner</Link> | <Link to={context.device ? `/platform/events?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/platform/events?site=${context.siteId}&issue=${context.issue}`}>Open Event Notifications</Link> | <Link to={context.device ? `/assurance/path-trace?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/assurance/path-trace?site=${context.siteId}&issue=${context.issue}`}>Open Path Trace</Link></p>
      </Panel>

      <Panel title="Related Targets">
        <DataTable
          columns={['Device', 'Site', 'Health', 'Actions']}
          rows={context.issueDevices.map((d) => [
            d.name,
            d.siteId,
            <StatusBadge key={`${d.id}-h`} value={d.health} />,
            <>
              <Link to={`/device-360/${d.id}`}>Device 360</Link>
              {' | '}
              <Link to={`/topology?site=${d.siteId}`}>Topology</Link>
              {' | '}
              <Link to={`/assurance?site=${d.siteId}&issue=${context.issue}`}>Assurance</Link>
              {' | '}
              <Link to={`/provision?site=${d.siteId}&device=${d.id}&issue=${context.issue}`}>Provision</Link>
              {' | '}
              <Link to={`/command-runner?site=${d.siteId}&device=${d.id}&issue=${context.issue}`}>Command Runner</Link>
              {' | '}
              <Link to={`/platform?site=${d.siteId}&device=${d.id}&issue=${context.issue}`}>Platform</Link>
            </>
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to="/assurance">Back to Assurance</Link>
        <Link to={context.siteId ? `/topology?site=${context.siteId}` : '/topology'}>Back to Topology</Link>
        {context.device && <Link to={`/device-360/${context.device.id}`}>Back to Device 360</Link>}
        <Link to={context.device ? `/provision?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/provision?site=${context.siteId}&issue=${context.issue}`}>Go Provision</Link>
        <Link to={context.device ? `/command-runner?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/command-runner?site=${context.siteId}&issue=${context.issue}`}>Go Command Runner</Link>
        <Link to={context.device ? `/activities?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/activities?site=${context.siteId}&issue=${context.issue}`}>Recent Activities</Link>
        <Link to={context.device ? `/assurance/path-trace?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/assurance/path-trace?site=${context.siteId}&issue=${context.issue}`}>Path Trace</Link>
        <Link to={context.device ? `/platform?site=${context.siteId}&device=${context.device.id}&issue=${context.issue}` : `/platform?site=${context.siteId}&issue=${context.issue}`}>Go Platform</Link>
      </div>
    </div>
  );
}
