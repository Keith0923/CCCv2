import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';
import { useMemo, useState } from 'react';

export function TopologyPage() {
  const { data } = useAppState();
  const [params] = useSearchParams();
  const siteFocus = params.get('site') ?? '';
  const [selectedLinkId, setSelectedLinkId] = useState<string>('');

  const selectedLink = data.topologyLinks.find((l) => l.id === selectedLinkId);

  const nodes = useMemo(() => {
    if (!siteFocus) return data.topologyNodes;
    return data.topologyNodes.filter((n) => n.siteId === siteFocus);
  }, [data.topologyNodes, siteFocus]);

  const warningNodes = nodes.filter((n) => {
    const d = data.devices.find((x) => x.id === n.deviceId);
    return d?.health !== 'healthy' || d?.assignmentState !== 'assigned' || d?.role === 'unknown';
  });

  if (data.topologyNodes.length === 0) {
    return <EmptyState title="No topology" description="Run discovery and assign sites to render topology." />;
  }

  return (
    <div>
      <h1>Topology</h1>

      {siteFocus && (
        <Panel title="Site Focus">
          <p>Focused site: {siteFocus}</p>
          <p>Visible nodes: {nodes.length}</p>
        </Panel>
      )}

      <Panel title="Site / Building / Floor">
        <ul>{data.sites.map((s) => <li key={s.id}>{s.name} / {s.building} / {s.floor} ({s.health})</li>)}</ul>
      </Panel>

      <Panel title="Nodes">
        <div className="topology-grid">
          {nodes.map((n) => {
            const d = data.devices.find((x) => x.id === n.deviceId);
            const isWarning = d?.health !== 'healthy' || d?.assignmentState !== 'assigned' || d?.role === 'unknown';
            return (
              <div key={n.id} className={`node role-${n.role} ${isWarning ? 'warning-node' : ''}`}>
                <div>{n.id}</div>
                <div>{n.role}</div>
                <div>{d?.health ?? 'unknown'}</div>
                <Link to={`/device-360/${n.deviceId}`}>Device 360</Link>
                {' | '}
                <Link to={`/inventory?job=${d?.sourceDiscoveryJobId ?? ''}`}>Inventory</Link>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Links (select to view detail)">
        <ul>
          {data.topologyLinks.map((l) => (
            <li key={l.id}>
              <button onClick={() => setSelectedLinkId(l.id)}>{l.id}</button> {l.sourceNodeId} ⇄ {l.targetNodeId} ({l.quality})
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Link Detail">
        {selectedLink ? (
          <div>
            <p>ID: {selectedLink.id}</p>
            <p>Endpoints: {selectedLink.sourceNodeId} ⇄ {selectedLink.targetNodeId}</p>
            <p>Quality: {selectedLink.quality}</p>
          </div>
        ) : (
          <p>No link selected.</p>
        )}
      </Panel>

      <Panel title="Warning / Degraded Nodes">
        <ul>
          {warningNodes.map((n) => (
            <li key={n.id}>
              {n.id} ({n.role})
              {' - '}
              <Link to={`/inventory?job=${data.devices.find((d) => d.id === n.deviceId)?.sourceDiscoveryJobId ?? ''}`}>Inventory</Link>
              {' / '}
              <Link to={`/device-360/${n.deviceId}`}>Device 360</Link>
            </li>
          ))}
        </ul>
      </Panel>

      <div><Link to="/inventory">Back to Inventory</Link></div>
    </div>
  );
}
