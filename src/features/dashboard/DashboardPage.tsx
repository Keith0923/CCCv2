import { Link } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from '../assurance/selectors';

export function DashboardPage() {
  const { data } = useAppState();
  const unassigned = data.devices.filter((d) => d.assignmentState === 'unassigned').length;
  const assurance = selectAssuranceSummary(data);

  return (
    <div>
      <h1>Dashboard - Product Flow Hub</h1>
      <SummaryStrip items={[
        { label: 'Running Discovery Jobs', value: data.discoveryJobs.filter((j) => j.status === 'running').length },
        { label: 'Unassigned Devices', value: unassigned },
        { label: 'Healthy Sites', value: assurance.healthTotals.healthySites },
        { label: 'Degraded Sites', value: assurance.healthTotals.degradedSites }
      ]} />
      <Panel title="Recent Discovery Outcomes">
        <ul>{data.discoveryResults.map((r) => <li key={r.id}>{r.jobId}: S {r.summary.success} / P {r.summary.partial} / F {r.summary.failed}</li>)}</ul>
      </Panel>
      <Panel title="Recent Important Issues">
        <ul>{data.issues.map((i) => <li key={i.id}>{i.message} <Link to="/assurance">Assurance</Link></li>)}</ul>
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
