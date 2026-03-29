import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';

export function Device360Page() {
  const { id } = useParams();
  const { data } = useAppState();
  const device = data.devices.find((d) => d.id === id);

  const context = useMemo(() => data.device360Contexts.find((d) => d.deviceId === id), [data.device360Contexts, id]);
  const history = data.timelineEvents.filter((e) => e.deviceId === id);

  if (!device) return <EmptyState title="Device not found" description="Select a device from inventory or topology." />;

  return (
    <div>
      <h1>Device 360 - {device.name}</h1>
      <Panel title="Current Health">
        <p>{context?.currentHealth ?? device.health}</p>
      </Panel>
      <Panel title="Current Issues">
        <ul>{(context?.currentIssues ?? []).map((i) => <li key={i}>{i}</li>)}</ul>
      </Panel>
      <Panel title="Issue History">
        <ul>{history.map((h) => <li key={h.id}>{h.at} - {h.message}</li>)}</ul>
      </Panel>
      <Panel title="Discovery Metadata">
        <p>Source job: {device.sourceDiscoveryJobId}</p>
        <p>Preferred Mgmt IP candidate: {device.preferredManagementIpCandidate ?? 'N/A'}</p>
      </Panel>
      <Panel title="Site / Topology Context">
        <p>Site: {device.siteId} / Role: {device.role}</p>
      </Panel>
      <Panel title="Recommended Next Action">
        <p>{context?.recommendedNextAction ?? 'Review inventory assignment and run rediscovery.'}</p>
      </Panel>
      <div className="quick-links">
        <Link to="/inventory">Inventory</Link>
        <Link to="/topology">Topology</Link>
        <a href="#" onClick={(e) => e.preventDefault()}>Related Commands (coming soon)</a>
      </div>
    </div>
  );
}
