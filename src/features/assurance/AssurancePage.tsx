import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { SummaryStrip } from '../../components/SummaryStrip';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from './selectors';
import { selectAssuranceTrend } from './clientSelectors';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';

export function AssurancePage() {
  const { data } = useAppState();
  const [params] = useSearchParams();
  const siteFocus = params.get('site') ?? '';
  const issueFocus = params.get('issue') ?? '';
  const trendRange = (params.get('range') as '1h' | '24h' | '7d' | null) ?? '24h';

  const summary = selectAssuranceSummary(data, siteFocus || undefined);
  const trend = selectAssuranceTrend(trendRange);
  const filteredImpacted = issueFocus
    ? summary.impactedDevices.filter((row) => row.categories.includes(issueFocus as any))
    : summary.impactedDevices;

  return (
    <div>
      <div className="page-header">
        <h1>Assurance Operations</h1>
        <p>Health dashboard and drill-down entry for clients/devices/issues/events.</p>
      </div>

      <div className="filter-strip">
        <select value={trendRange} onChange={() => undefined}>
          <option>Time: {trendRange}</option>
          <option>1h</option>
          <option>24h</option>
          <option>7d</option>
        </select>
        <select><option>Site: {siteFocus || 'all'}</option></select>
        <select><option>Domain: enterprise</option><option>wireless</option><option>campus</option></select>
      </div>

      <div className="assurance-tabs">
        <Link to={siteFocus ? `/assurance/clients?site=${siteFocus}` : '/assurance/clients'}>Clients</Link>
        <Link to={siteFocus ? `/assurance/issues?site=${siteFocus}` : '/assurance/issues'}>Issues/Events</Link>
        <Link to={siteFocus ? `/assurance/path-trace?site=${siteFocus}` : '/assurance/path-trace'}>Path Trace</Link>
        <Link to={siteFocus ? `/assurance/capture?site=${siteFocus}` : '/assurance/capture'}>Capture</Link>
      </div>

      <SummaryStrip
        items={[
          { label: 'Healthy Sites', value: summary.healthTotals.healthySites },
          { label: 'Degraded Sites', value: summary.healthTotals.degradedSites },
          { label: 'Impacted Devices', value: summary.healthTotals.impactedDevices },
          { label: 'Focused Site', value: siteFocus || 'all' }
        ]}
      />

      <div className="hub-grid">
        <Panel title="Trend Dashlet">
          <p>Range: {trendRange} / Avg health: {trend.avgHealth}</p>
          <p>Worst site: {trend.worstSite} / floor: {trend.worstFloor} / client: {trend.worstClient}</p>
        </Panel>

        <Panel title="Issue Mix Dashlet">
          <p><IssueTag value="unassigned" /> {summary.categorySummary.unassigned}</p>
          <p><IssueTag value="mis-role" /> {summary.categorySummary['mis-role']}</p>
          <p><IssueTag value="mgmt-ambiguity" /> {summary.categorySummary['mgmt-ambiguity']}</p>
        </Panel>
      </div>

      <Panel title="Site Health Summary">
        <DataTable
          columns={['Site', 'Health', 'Impacted', 'Total Devices', 'Actions']}
          rows={summary.siteSummary.map((site) => [
            site.name,
            <StatusBadge key={`${site.siteId}-health`} value={site.health} />,
            site.impacted,
            site.totalDevices,
            <>
              <Link to={`/assurance?site=${site.siteId}`}>Focus</Link>
              {' | '}
              <Link to={`/topology?site=${site.siteId}`}>Topology</Link>
              {' | '}
              <Link to={`/troubleshooting?site=${site.siteId}`}>Troubleshooting</Link>
            </>
          ])}
        />
      </Panel>

      <Panel title="Impacted Entities">
        <DataTable
          columns={['Device', 'Site', 'Health', 'Issue Categories', 'Actions']}
          rows={filteredImpacted.map((row) => [
            row.device.name,
            row.device.siteId,
            <StatusBadge key={`${row.device.id}-health`} value={row.device.health} />,
            <>{row.categories.map((category) => <IssueTag key={category} value={category} />)}</>,
            <>
              <Link to={`/device-360/${row.device.id}`}>Device 360</Link>
              {' | '}
              <Link to={`/assurance/issues?site=${row.device.siteId}&issue=${row.categories[0]}`}>Issues</Link>
            </>
          ])}
        />
      </Panel>
    </div>
  );
}
