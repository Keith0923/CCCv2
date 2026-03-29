import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';

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
      <div className="page-header">
        <h1>Device 360 - {device.name}</h1>
        <p>Causality view: discovery metadata, normalization path, current state.</p>
      </div>

      <Panel title="Current State">
        <p>Health: <StatusBadge value={context?.currentHealth ?? device.health} /></p>
        <p>Site: {device.siteId}</p>
        <p>Role: {effectiveRole} (detected: {device.roleDetected}, override: {device.roleOverride ?? 'none'})</p>
        <p>Reachability: <StatusBadge value={device.reachability} /></p>
      </Panel>

      <Panel title="Current Issues">
        <div className="tag-row">{(context?.currentIssues ?? []).map((i) => <IssueTag key={i} value={i.toLowerCase().includes('role') ? 'mis-role' : i.toLowerCase().includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'} />)}</div>
        <p><Link to={`/assurance?site=${device.siteId}`}>Open in Assurance Lite</Link> | <Link to={`/troubleshooting?device=${device.id}&site=${device.siteId}&issue=${(context?.currentIssues?.[0] ?? '').includes('Role') ? 'mis-role' : (context?.currentIssues?.[0] ?? '').includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'}`}>Troubleshooting Bridge</Link></p>
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

      <Panel title="Recommended Next Action">
        <p>{context?.recommendedNextAction ?? 'Review normalization status in Inventory.'}</p>
      </Panel>

      <div className="quick-links">
        <Link to="/inventory">Inventory</Link>
        <Link to="/topology">Topology</Link>
        <Link to={`/assurance?site=${device.siteId}`}>Assurance Lite</Link>
        <Link to={`/troubleshooting?device=${device.id}&site=${device.siteId}`}>Troubleshooting Bridge</Link>
      </div>
    </div>
  );
}
