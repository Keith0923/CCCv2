import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from '../assurance/selectors';
import { StatusBadge } from '../../components/StatusBadge';
import { selectAssuranceIssues } from '../assurance/clientSelectors';

export function DashboardPage() {
  const { data } = useAppState();
  const unassigned = data.devices.filter((d) => d.assignmentState === 'unassigned').length;
  const assurance = selectAssuranceSummary(data);
  const issues = selectAssuranceIssues();
  const recentJobs = data.discoveryJobs.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Operations Hub</h1>
        <p>Network operations snapshot with drill-down dashlets.</p>
      </div>

      <div className="filter-strip">
        <select><option>Time: 24h</option><option>1h</option><option>7d</option></select>
        <select><option>Site: All</option></select>
        <select><option>Domain: Campus</option><option>Wireless</option><option>SDA</option></select>
        <button type="button">Refresh</button>
      </div>

      <SummaryStrip items={[
        { label: 'Running Discovery', value: data.discoveryJobs.filter((j) => j.status === 'running').length },
        { label: 'Unassigned Devices', value: unassigned },
        { label: 'Open Issues', value: issues.filter((i) => i.status !== 'resolved').length },
        { label: 'Degraded Sites', value: assurance.healthTotals.degradedSites }
      ]} />

      <div className="hub-grid">
        <Panel title="Recent Discovery Outcomes">
          <DataTableLikeList rows={recentJobs.map((j) => ({ title: j.name, meta: `${j.discoveryType} / ${j.credentialProfileId}`, status: j.status, action: <Link to={`/discovery?job=${j.id}`}>Open</Link> }))} />
        </Panel>

        <Panel title="Operational Focus">
          <DataTableLikeList rows={[
            { title: 'Assurance posture', meta: `degraded sites: ${assurance.healthTotals.degradedSites}`, status: assurance.healthTotals.degradedSites > 0 ? 'degraded' : 'healthy', action: <Link to="/assurance">Review</Link> },
            { title: 'Inventory normalization', meta: `unassigned: ${unassigned}`, status: unassigned > 0 ? 'warning' : 'healthy', action: <Link to="/inventory">Open</Link> },
            { title: 'Troubleshooting queue', meta: `open issues: ${issues.length}`, status: issues.length > 0 ? 'running' : 'healthy', action: <Link to="/troubleshooting">Bridge</Link> }
          ]} />
        </Panel>

        <Panel title="Task & Event Watch">
          <DataTableLikeList rows={issues.slice(0, 5).map((i) => ({ title: i.title, meta: `${i.siteId} / ${i.category}`, status: i.status, action: <Link to={`/assurance/issues?site=${i.siteId}&issue=${i.id}`}>Drill-down</Link> }))} />
        </Panel>

        <Panel title="Impacted Entities">
          <DataTableLikeList rows={assurance.impactedDevices.slice(0, 5).map((row) => ({ title: row.device.name, meta: `${row.device.siteId} / ${row.categories.join(', ')}`, status: row.device.health, action: <Link to={`/device-360/${row.device.id}`}>Investigate</Link> }))} />
        </Panel>
      </div>
    </div>
  );
}

function DataTableLikeList({ rows }: { rows: Array<{ title: string; meta: string; status: string; action: ReactNode }> }) {
  return (
    <table className="data-table compact-table">
      <thead><tr><th>Item</th><th>Meta</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={`${r.title}-${r.meta}`}>
            <td>{r.title}</td>
            <td>{r.meta}</td>
            <td><StatusBadge value={r.status} /></td>
            <td>{r.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
