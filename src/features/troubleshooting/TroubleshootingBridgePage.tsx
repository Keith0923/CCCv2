import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { useAppState } from '../../app/state';
import { selectTroubleshootingContext } from './selectors';

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
      <h1>Troubleshooting Bridge</h1>

      <Panel title="Context Summary">
        <p>Site: {context.siteId || 'all'}</p>
        <p>Device: {context.device?.name ?? 'not fixed'}</p>
        <p>Issue context: {context.issue}</p>
        <p>Current health: {context.device?.health ?? 'mixed'}</p>
      </Panel>

      <Panel title="Suspected Category">
        <p>{context.suspectedCategory}</p>
      </Panel>

      <Panel title="Why This Is Flagged">
        <p>{context.whyFlagged}</p>
      </Panel>

      <Panel title="Recommended Next Step">
        <p>Recommended next view: {context.recommendedNextView}</p>
      </Panel>

      <Panel title="Related Targets">
        <DataTable
          columns={['Device', 'Site', 'Health', 'Actions']}
          rows={context.issueDevices.map((d) => [
            d.name,
            d.siteId,
            d.health,
            <>
              <Link to={`/device-360/${d.id}`}>Device 360</Link>
              {' | '}
              <Link to={`/topology?site=${d.siteId}`}>Topology</Link>
              {' | '}
              <Link to={`/assurance?site=${d.siteId}&issue=${context.issue}`}>Assurance</Link>
            </>
          ])}
        />
      </Panel>
    </div>
  );
}
