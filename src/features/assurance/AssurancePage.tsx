import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { SummaryStrip } from '../../components/SummaryStrip';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from './selectors';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';

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
      <div className="page-header">
        <h1>Assurance Lite</h1>
        <p>Operational posture summary and next investigation targets.</p>
      </div>

      <SummaryStrip
        items={[
          { label: 'Healthy Sites', value: summary.healthTotals.healthySites },
          { label: 'Degraded Sites', value: summary.healthTotals.degradedSites },
          { label: 'Impacted Devices', value: summary.healthTotals.impactedDevices },
          { label: 'Focused Site', value: siteFocus || 'all' }
        ]}
      />

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
              {' | '}
              <Link to={`/software/images?site=${site.siteId}`}>Software</Link>
              {' | '}
              <Link to={`/activities?site=${site.siteId}`}>Activities</Link>
              {' | '}
              <Link to={`/compliance?site=${site.siteId}`}>Compliance</Link>
              {' | '}
              <Link to={`/platform?site=${site.siteId}`}>Platform</Link>
              {' | '}
              <Link to={`/wireless/maps?site=${site.siteId}`}>Wireless Maps</Link>
            </>
          ])}
        />
      </Panel>

      <Panel title="Issue Category Summary">
        <ul>
          <li><IssueTag value="unassigned" /> {summary.categorySummary.unassigned} <Link to="/assurance?issue=unassigned">filter</Link> | <Link to="/troubleshooting?issue=unassigned">bridge</Link> | <Link to="/command-runner?issue=unassigned">command</Link></li>
          <li><IssueTag value="mis-role" /> {summary.categorySummary['mis-role']} <Link to="/assurance?issue=mis-role">filter</Link> | <Link to="/troubleshooting?issue=mis-role">bridge</Link> | <Link to="/command-runner?issue=mis-role">command</Link></li>
          <li><IssueTag value="mgmt-ambiguity" /> {summary.categorySummary['mgmt-ambiguity']} <Link to="/assurance?issue=mgmt-ambiguity">filter</Link> | <Link to="/troubleshooting?issue=mgmt-ambiguity">bridge</Link> | <Link to="/software/images?issue=mgmt-ambiguity">software</Link> | <Link to="/command-runner?issue=mgmt-ambiguity">command</Link></li>
        </ul>
      </Panel>

      <Panel title="Impacted Devices List">
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
              <Link to={`/topology?site=${row.device.siteId}`}>Topology</Link>
              {' | '}
              <Link to={`/troubleshooting?device=${row.device.id}&site=${row.device.siteId}&issue=${row.categories[0]}`}>Troubleshooting</Link>
              {' | '}
              <Link to={`/software/images?device=${row.device.id}&site=${row.device.siteId}&issue=${row.categories[0]}`}>Software</Link>
              {' | '}
              <Link to={`/command-runner?device=${row.device.id}&site=${row.device.siteId}&issue=${row.categories[0]}`}>Command Runner</Link>
              {' | '}
              <Link to={`/compliance?device=${row.device.id}&site=${row.device.siteId}&issue=${row.categories[0]}`}>Compliance</Link>
              {' | '}
              <Link to={`/platform?device=${row.device.id}&site=${row.device.siteId}&issue=${row.categories[0]}`}>Platform</Link>
              {' | '}
              <Link to={`/wireless/security?device=${row.device.id}&site=${row.device.siteId}&issue=${row.categories[0]}`}>Wireless Security</Link>
            </>
          ])}
        />
      </Panel>
    </div>
  );
}
