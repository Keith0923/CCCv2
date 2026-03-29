import { Link } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';

export function TopologyPage() {
  const { data } = useAppState();

  if (data.topologyNodes.length === 0) {
    return <EmptyState title="No topology" description="Run discovery and assign sites to render topology." />;
  }

  return (
    <div>
      <h1>Topology</h1>
      <Panel title="Site / Building / Floor">
        <ul>{data.sites.map((s) => <li key={s.id}>{s.name} / {s.building} / {s.floor} ({s.health})</li>)}</ul>
      </Panel>
      <Panel title="Nodes">
        <div className="topology-grid">
          {data.topologyNodes.map((n) => (
            <div key={n.id} className={`node role-${n.role}`}>
              <div>{n.id}</div>
              <div>{n.role}</div>
              <Link to={`/device-360/${n.deviceId}`}>360</Link>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Links">
        <ul>{data.topologyLinks.map((l) => <li key={l.id}>{l.sourceNodeId} ⇄ {l.targetNodeId} ({l.quality})</li>)}</ul>
      </Panel>
      <div><Link to="/inventory">Back to Inventory</Link></div>
    </div>
  );
}
