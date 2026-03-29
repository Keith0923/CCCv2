import { Link } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { useAppState } from '../../app/state';

export function DashboardPage() {
  const { data } = useAppState();
  const unassigned = data.devices.filter((d) => d.assignmentState === 'unassigned').length;
  const siteHealthy = data.sites.filter((s) => s.health === 'healthy').length;
  const siteDegraded = data.sites.filter((s) => s.health === 'degraded').length;

  return (
    <div>
      <h1>Dashboard - Product Flow Hub</h1>
      <SummaryStrip items={[
        { label: 'Running Discovery Jobs', value: data.discoveryJobs.filter((j) => j.status === 'running').length },
        { label: 'Unassigned Devices', value: unassigned },
        { label: 'Healthy Sites', value: siteHealthy },
        { label: 'Degraded Sites', value: siteDegraded }
      ]} />
      <Panel title="Recent Discovery Outcomes">
        <ul>{data.discoveryResults.map((r) => <li key={r.id}>{r.jobId}: S {r.summary.success} / P {r.summary.partial} / F {r.summary.failed}</li>)}</ul>
      </Panel>
      <Panel title="Recent Important Issues">
        <ul>{data.issues.map((i) => <li key={i.id}>{i.message}</li>)}</ul>
      </Panel>
      <div className="quick-links">
        <Link to="/discovery">Go Discovery</Link>
        <Link to="/inventory">Go Inventory</Link>
        <Link to="/topology">Go Topology</Link>
        <Link to="/device-360/dev-2">Go Device 360</Link>
      </div>
    </div>
  );
}
