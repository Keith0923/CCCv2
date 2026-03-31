import { Link } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from '../assurance/selectors';
import { StatusBadge } from '../../components/StatusBadge';

export function DashboardPage() {
  const { data } = useAppState();
  const unassigned = data.devices.filter((d) => d.assignmentState === 'unassigned').length;
  const assurance = selectAssuranceSummary(data);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard - Product Flow Hub</h1>
        <p>Discovery → Inventory → Topology → Device 360 → Assurance</p>
      </div>
      <SummaryStrip items={[
        { label: 'Running Discovery Jobs', value: data.discoveryJobs.filter((j) => j.status === 'running').length },
        { label: 'Unassigned Devices', value: unassigned },
        { label: 'Healthy Sites', value: assurance.healthTotals.healthySites },
        { label: 'Degraded Sites', value: assurance.healthTotals.degradedSites }
      ]} />
      <Panel title="Recent Discovery Outcomes">
        <ul>{data.discoveryResults.map((r) => <li key={r.id}>{r.jobId}: S {r.summary.success} / P {r.summary.partial} / F {r.summary.failed}</li>)}</ul>
      </Panel>
      <Panel title="Operational Focus">
        <ul>
          <li>Degraded sites: <StatusBadge value={String(assurance.healthTotals.degradedSites > 0 ? 'degraded' : 'healthy')} /> <Link to="/assurance">Assurance</Link></li>
          <li>Unassigned devices: <StatusBadge value={String(unassigned > 0 ? 'unassigned' : 'assigned')} /> <Link to="/inventory">Inventory</Link></li>
        </ul>
      </Panel>
      <div className="quick-links">
        <Link to="/discovery">Go Discovery</Link>
        <Link to="/inventory">Go Inventory</Link>
        <Link to="/topology">Go Topology</Link>
        <Link to="/device-360/dev-2">Go Device 360</Link>
        <Link to="/assurance">Go Assurance</Link>
      </div>
    </div>
  );
}
