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
  const normalizationTimeline = history.filter((h) => ['assigned', 'role-corrected', 'normalized', 'policy-updated'].includes(h.type));

  if (!device) return <EmptyState title="Device not found" description="Select a device from inventory or topology." />;

  const effectiveRole = device.roleOverride ?? device.roleDetected;

  return (
    <div>
      <h1>Device 360 - {device.name}</h1>

      <Panel title="Current State">
        <p>Health: {context?.currentHealth ?? device.health}</p>
        <p>Site: {device.siteId}</p>
        <p>Role: {effectiveRole} (detected: {device.roleDetected}, override: {device.roleOverride ?? 'none'})</p>
        <p>Reachability: {device.reachability}</p>
      </Panel>

      <Panel title="Current Issues">
        <ul>{(context?.currentIssues ?? []).map((i) => <li key={i}>{i}</li>)}</ul>
        <p><Link to={`/assurance?site=${device.siteId}`}>Open in Assurance Lite</Link></p>
      </Panel>

      <Panel title="Discovery Metadata">
        <p>Source job: {device.sourceDiscoveryJobId}</p>
        <p>Management IP: {device.managementIp}</p>
        <p>Preferred management IP policy: {device.preferredManagementIpPolicy}</p>
        <p>Policy candidate: {device.preferredManagementIpCandidate ?? 'N/A'}</p>
      </Panel>

      <Panel title="Normalization Timeline">
        <ul>{normalizationTimeline.map((h) => <li key={h.id}>{h.at} - [{h.type}] {h.message}</li>)}</ul>
      </Panel>

      <Panel title="Full Timeline">
        <ul>{history.map((h) => <li key={h.id}>{h.at} - [{h.type}] {h.message}</li>)}</ul>
      </Panel>

      <Panel title="Recommended Next Action">
        <p>{context?.recommendedNextAction ?? 'Review normalization status in Inventory.'}</p>
      </Panel>

      <div className="quick-links">
        <Link to="/inventory">Inventory</Link>
        <Link to="/topology">Topology</Link>
        <Link to={`/assurance?site=${device.siteId}`}>Assurance Lite</Link>
        <a href="#" onClick={(e) => e.preventDefault()}>Related Commands (coming soon)</a>
      </div>
    </div>
  );
}
