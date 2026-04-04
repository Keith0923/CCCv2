import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from '../assurance/selectors';
import { selectAssuranceIssues } from '../assurance/clientSelectors';
import { StatusChip } from '../../components/StatusChip';
import { PageHeader } from '../../components/PageHeader';
import { FilterStrip } from '../../components/FilterStrip';
import { SummaryStrip } from '../../components/SummaryStrip';
import { DashletCard } from '../../components/DashletCard';
import { DetailRailSection } from '../../components/DetailRailSection';

export function DashboardPage() {
  const { data } = useAppState();
  const assurance = selectAssuranceSummary(data);
  const issues = selectAssuranceIssues();
  const selectedIssue = issues[0];

  return (
    <div>
      <PageHeader title="Operations Hub" subtitle="Monitoring and drill-down command center." />

      <FilterStrip>
        <select><option>Time: 24h</option><option>1h</option><option>7d</option></select>
        <select><option>Site: All</option></select>
        <select><option>Domain: Campus</option><option>Wireless</option><option>SDA</option></select>
        <button type="button">Refresh</button>
      </FilterStrip>

      <SummaryStrip items={[
        { label: 'Running Discovery', value: data.discoveryJobs.filter((j) => j.status === 'running').length },
        { label: 'Open Issues', value: issues.filter((i) => i.status !== 'resolved').length },
        { label: 'Degraded Sites', value: assurance.healthTotals.degradedSites },
        { label: 'Impacted Devices', value: assurance.healthTotals.impactedDevices }
      ]} />

      <div className="investigation-layout">
        <div className="hub-grid">
          <DashletCard title="Recent Discovery">
            <DataList rows={data.discoveryJobs.slice(0, 4).map((j) => ({ title: j.name, meta: `${j.discoveryType} / ${j.credentialProfileId}`, status: j.status, action: <Link to={`/discovery?job=${j.id}`}>Open</Link> }))} />
          </DashletCard>

          <DashletCard title="Operational Focus">
            <DataList rows={assurance.siteSummary.slice(0, 4).map((site) => ({ title: site.name, meta: `impacted ${site.impacted}/${site.totalDevices}`, status: site.health, action: <Link to={`/assurance?site=${site.siteId}`}>Inspect</Link> }))} />
          </DashletCard>

          <DashletCard title="Task & Event Watch">
            <DataList rows={issues.slice(0, 4).map((i) => ({ title: i.title, meta: `${i.siteId} / ${i.category}`, status: i.status, action: <Link to={`/assurance/issues?site=${i.siteId}&issue=${i.id}`}>Drill-down</Link> }))} />
          </DashletCard>

          <DashletCard title="Impacted Entities">
            <DataList rows={assurance.impactedDevices.slice(0, 4).map((row) => ({ title: row.device.name, meta: `${row.device.siteId} / ${row.categories.join(', ')}`, status: row.device.health, action: <Link to={`/device-360/${row.device.id}`}>Investigate</Link> }))} />
          </DashletCard>
        </div>

        <div className="right-ops-rail">
          <DetailRailSection title="Selected Issue">
            {selectedIssue ? (
              <>
                <p>{selectedIssue.title}</p>
                <p>Site: {selectedIssue.siteId}</p>
                <p>Status: <StatusChip value={selectedIssue.status} /></p>
              </>
            ) : <p>No open issue</p>}
          </DetailRailSection>

          <DetailRailSection title="Quick Actions">
            <div className="quick-links">
              <Link to="/assurance">Assurance</Link>
              <Link to="/inventory">Inventory</Link>
              <Link to="/topology">Topology</Link>
              <Link to="/assurance/path-trace">Path Trace</Link>
            </div>
          </DetailRailSection>
        </div>
      </div>
    </div>
  );
}

function DataList({ rows }: { rows: Array<{ title: string; meta: string; status: string; action: ReactNode }> }) {
  return (
    <table className="data-table compact-table">
      <thead><tr><th>Item</th><th>Meta</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.title}-${r.meta}`}>
            <td>{r.title}</td><td>{r.meta}</td><td><StatusChip value={r.status} /></td><td>{r.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
