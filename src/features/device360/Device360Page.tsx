import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';
import { selectComplianceDeviceDetail } from '../compliance/selectors';

export function Device360Page() {
  const { id } = useParams();
  const { data, deviceImageStates } = useAppState();
  const device = data.devices.find((d) => d.id === id);

  const context = useMemo(() => data.device360Contexts.find((d) => d.deviceId === id), [data.device360Contexts, id]);
  const history = data.timelineEvents.filter((e) => e.deviceId === id);
  const normalizationTimeline = history.filter((h) => ['assigned', 'role-corrected', 'normalized', 'policy-updated'].includes(h.type));

  if (!device) return <EmptyState title="Device not found" description="Select a device from inventory or topology." />;

  const effectiveRole = device.roleOverride ?? device.roleDetected;
  const imageState = deviceImageStates.find((x) => x.deviceId === device.id);
  const compliance = selectComplianceDeviceDetail(data, device.id);

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
        <p><Link to={`/assurance?site=${device.siteId}`}>Open in Assurance Lite</Link> | <Link to={`/troubleshooting?device=${device.id}&site=${device.siteId}&issue=${(context?.currentIssues?.[0] ?? '').includes('Role') ? 'mis-role' : (context?.currentIssues?.[0] ?? '').includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'}`}>Troubleshooting Bridge</Link> | <Link to={`/command-runner?site=${device.siteId}&device=${device.id}&issue=${(context?.currentIssues?.[0] ?? '').includes('Role') ? 'mis-role' : (context?.currentIssues?.[0] ?? '').includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'}`}>Command Runner</Link></p>
      </Panel>

      <Panel title="Software Image Status">
        <p>Current image: {imageState?.currentImage ?? 'unknown'}</p>
        <p>Target image: {imageState?.targetImage ?? '-'}</p>
        <p>Eligibility: <StatusBadge value={imageState?.eligible ? 'eligible' : 'ineligible'} /></p>
        <p>Last software task: <StatusBadge value={imageState?.lastTaskStatus ?? 'none'} /></p>
        <p><Link to={`/software/images?site=${device.siteId}&device=${device.id}`}>Open Software Images</Link></p>
      </Panel>


      <Panel title="Compliance Status">
        <p>Status: <StatusBadge value={compliance?.status ?? 'unknown'} /></p>
        <p>Reason: {compliance?.reasonCategory ?? 'none'}</p>
        <p><Link to={`/compliance/device/${device.id}`}>Open Compliance Detail</Link></p>
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
        <Link to={`/provision?site=${device.siteId}&device=${device.id}`}>Provision</Link>
        <Link to={`/software/images?site=${device.siteId}&device=${device.id}`}>Software Images</Link>
        <Link to={`/command-runner?site=${device.siteId}&device=${device.id}`}>Command Runner</Link>
        <Link to={`/activities?site=${device.siteId}&device=${device.id}`}>Activities</Link>
        <Link to={`/compliance?site=${device.siteId}&device=${device.id}`}>Compliance</Link>
        <Link to={`/wireless/maps?site=${device.siteId}&device=${device.id}`}>Wireless Maps</Link>
        <Link to={`/wireless/security?site=${device.siteId}&device=${device.id}`}>Wireless Security</Link>
        <Link to={`/sda/fabric?site=${device.siteId}&device=${device.id}`}>Fabric Overview</Link>
        <Link to={`/sda/policy?site=${device.siteId}&device=${device.id}`}>Policy Matrix</Link>
      </div>
    </div>
  );
}
