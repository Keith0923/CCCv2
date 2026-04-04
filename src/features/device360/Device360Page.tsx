import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { IssueTag } from '../../components/IssueTag';
import { selectComplianceDeviceDetail } from '../compliance/selectors';
import { SummaryStrip } from '../../components/SummaryStrip';

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
  const issueHint = (context?.currentIssues?.[0] ?? '').includes('Role') ? 'mis-role' : (context?.currentIssues?.[0] ?? '').includes('reachability') ? 'mgmt-ambiguity' : 'unassigned';

  return (
    <div>
      <div className="page-header">
        <h1>Device 360 Investigation</h1>
        <p>{device.name} / {device.siteId} / role: {effectiveRole}</p>
      </div>

      <SummaryStrip items={[
        { label: 'Health', value: context?.currentHealth ?? device.health },
        { label: 'Reachability', value: device.reachability },
        { label: 'Compliance', value: compliance?.status ?? 'unknown' },
        { label: 'Software Task', value: imageState?.lastTaskStatus ?? 'none' }
      ]} />

      <div className="investigation-layout">
        <div>
          <Panel title="Current State / Metadata">
            <p>Health: <StatusBadge value={context?.currentHealth ?? device.health} /></p>
            <p>Site: {device.siteId}</p>
            <p>Role: {effectiveRole} (detected: {device.roleDetected}, override: {device.roleOverride ?? 'none'})</p>
            <p>Management IP: {device.managementIp}</p>
            <p>Source job: {device.sourceDiscoveryJobId}</p>
          </Panel>

          <Panel title="Timeline (Normalization + Events)">
            <ul>{normalizationTimeline.map((h) => <li key={h.id}>{h.at} - [{h.type}] {h.message}</li>)}</ul>
          </Panel>

          <Panel title="Software / Compliance">
            <p>Current image: {imageState?.currentImage ?? 'unknown'} / target: {imageState?.targetImage ?? '-'}</p>
            <p>Compliance: <StatusBadge value={compliance?.status ?? 'unknown'} /> / reason: {compliance?.reasonCategory ?? 'none'}</p>
          </Panel>
        </div>

        <div className="right-ops-rail">
          <Panel title="Issues + Next Action">
            <div className="tag-row">{(context?.currentIssues ?? []).map((i) => <IssueTag key={i} value={i.toLowerCase().includes('role') ? 'mis-role' : i.toLowerCase().includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'} />)}</div>
            <p>{context?.recommendedNextAction ?? 'Review normalization status in Inventory.'}</p>
          </Panel>

          <Panel title="Investigation Actions">
            <div className="quick-links">
              <Link to={`/assurance?site=${device.siteId}`}>Assurance</Link>
              <Link to={`/troubleshooting?device=${device.id}&site=${device.siteId}&issue=${issueHint}`}>Troubleshooting</Link>
              <Link to={`/assurance/path-trace?device=${device.id}&site=${device.siteId}`}>Path Trace</Link>
              <Link to={`/assurance/capture?device=${device.id}&site=${device.siteId}`}>Capture</Link>
              <Link to={`/software/images?site=${device.siteId}&device=${device.id}`}>Software</Link>
              <Link to={`/compliance/device/${device.id}`}>Compliance Detail</Link>
            </div>
          </Panel>

          <Panel title="Related Views">
            <div className="quick-links">
              <Link to="/inventory">Inventory</Link>
              <Link to="/topology">Topology</Link>
              <Link to={`/assurance/issues?site=${device.siteId}`}>Issues/Events</Link>
              <Link to={`/assurance/clients?site=${device.siteId}`}>Client Health</Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
