import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';
import { useMemo, useState } from 'react';
import { selectAssuranceSummary } from '../assurance/selectors';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';

function warningReasons(device: { assignmentState: string; roleDetected: string; roleOverride?: string; reachability: string }) {
  const reasons: string[] = [];
  const effectiveRole = device.roleOverride ?? device.roleDetected;
  if (device.assignmentState !== 'assigned') reasons.push('unassigned');
  if (effectiveRole === 'unknown') reasons.push('mis-role');
  if (device.reachability !== 'reachable') reasons.push('mgmt-ambiguity');
  return reasons;
}

export function TopologyPage() {
  const { data } = useAppState();
  const [params] = useSearchParams();
  const siteFocus = params.get('site') ?? '';
  const [selectedLinkId, setSelectedLinkId] = useState<string>('');
  const assurance = selectAssuranceSummary(data, siteFocus || undefined);

  const selectedLink = data.topologyLinks.find((l) => l.id === selectedLinkId);

  const nodes = useMemo(() => {
    if (!siteFocus) return data.topologyNodes;
    return data.topologyNodes.filter((n) => n.siteId === siteFocus);
  }, [data.topologyNodes, siteFocus]);

  const warningNodes = nodes
    .map((n) => {
      const d = data.devices.find((x) => x.id === n.deviceId);
      const reasons = d ? warningReasons(d) : [];
      return { node: n, device: d, reasons };
    })
    .filter((x) => x.reasons.length > 0);

  if (data.topologyNodes.length === 0) {
    return <EmptyState title="No topology" description="Run discovery and assign sites to render topology." />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Topology</h1>
        <p>Reflection view for site context and connectivity posture.</p>
      </div>

      {siteFocus && (
        <Panel title="Site Focus">
          <p>Focused site: {siteFocus}</p>
          <p>Visible nodes: {nodes.length}</p>
          <p>Warnings in focus: {warningNodes.length}</p>
          <p>Site health from Assurance: <StatusBadge value={assurance.healthTotals.degradedSites > 0 ? 'degraded' : 'healthy'} /> <Link to={`/assurance?site=${siteFocus}`}>Open Assurance Lite</Link> | <Link to={`/wireless/maps?site=${siteFocus}`}>Open Wireless Maps</Link></p>
        </Panel>
      )}

      <Panel title="Nodes">
        <div className="topology-grid">
          {nodes.map((n) => {
            const d = data.devices.find((x) => x.id === n.deviceId);
            const reasons = d ? warningReasons(d) : [];
            return (
              <div key={n.id} className={`node role-${n.role} ${reasons.length ? 'warning-node' : ''}`}>
                <div>{n.id}</div>
                <div>role: {n.role}</div>
                <div>site: {n.siteId}</div>
                <div className="tag-row">{reasons.map((reason) => <IssueTag key={reason} value={reason} />)}</div>
                <Link to={`/device-360/${n.deviceId}`}>Device 360</Link>
                {' | '}
                <Link to={`/inventory?job=${d?.sourceDiscoveryJobId ?? ''}`}>Inventory</Link>
                {' | '}
                <Link to={`/troubleshooting?device=${n.deviceId}&site=${n.siteId}&issue=${reasons[0] ?? 'unassigned'}`}>Troubleshooting</Link>
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
            <p>Quality: <StatusBadge value={selectedLink.quality === 'good' ? 'healthy' : 'warning'} /></p>
          </div>
        ) : (
          <p>No link selected.</p>
        )}
      </Panel>

      <Panel title="Warning / Degraded Nodes">
        <ul>
          {warningNodes.map(({ node, device, reasons }) => (
            <li key={node.id}>
              {node.id} ({node.role}) {reasons.map((r) => <IssueTag key={r} value={r} />)}
              {' - '}
              <Link to={`/inventory?job=${device?.sourceDiscoveryJobId ?? ''}`}>Inventory</Link>
              {' / '}
              <Link to={`/device-360/${node.deviceId}`}>Device 360</Link>
              {' / '}
              <Link to={`/troubleshooting?device=${node.deviceId}&site=${node.siteId}&issue=${reasons[0] ?? 'unassigned'}`}>Troubleshooting</Link>
            </li>
          ))}
        </ul>
      </Panel>

      <div><Link to="/inventory">Back to Inventory</Link> | <Link to="/assurance">Assurance Lite</Link> | <Link to="/troubleshooting">Troubleshooting Bridge</Link> | <Link to={siteFocus ? `/wireless/maps?site=${siteFocus}` : '/wireless/maps'}>Wireless Maps</Link></div>
    </div>
  );
}
