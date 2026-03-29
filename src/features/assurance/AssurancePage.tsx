import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from './selectors';

export function AssurancePage() {
  const { data } = useAppState();
  const [params] = useSearchParams();
  const siteFocus = params.get('site') ?? '';
  const issueFocus = params.get('issue') ?? '';

  const summary = selectAssuranceSummary(data, siteFocus || undefined);

  const filteredImpacted = issueFocus
    ? summary.impactedDevices.filter((row) => row.categories.includes(issueFocus as any))
    : summary.impactedDevices;

  return (
    <div>
      <h1>Assurance Lite</h1>

      <Panel title="Site Health Summary">
        <DataTable
          columns={['Site', 'Health', 'Impacted', 'Actions']}
          rows={summary.siteSummary.map((site) => [
            site.name,
            site.health,
            site.impacted,
            <>
              <Link to={`/assurance?site=${site.siteId}`}>Focus</Link>
              {' | '}
              <Link to={`/topology?site=${site.siteId}`}>Topology</Link>
            </>
          ])}
        />
      </Panel>

      <Panel title="Issue Category Summary">
        <ul>
          <li>unassigned: {summary.categorySummary.unassigned} <Link to="/assurance?issue=unassigned">filter</Link></li>
          <li>mis-role: {summary.categorySummary['mis-role']} <Link to="/assurance?issue=mis-role">filter</Link></li>
          <li>mgmt-ambiguity: {summary.categorySummary['mgmt-ambiguity']} <Link to="/assurance?issue=mgmt-ambiguity">filter</Link></li>
        </ul>
      </Panel>

      <Panel title="Impacted Devices List">
        <DataTable
          columns={['Device', 'Site', 'Health', 'Issue Categories', 'Actions']}
          rows={filteredImpacted.map((row) => [
            row.device.name,
            row.device.siteId,
            row.device.health,
            row.categories.join(', '),
            <>
              <Link to={`/device-360/${row.device.id}`}>Device 360</Link>
              {' | '}
              <Link to={`/topology?site=${row.device.siteId}`}>Topology</Link>
            </>
          ])}
        />
      </Panel>
    </div>
  );
}
