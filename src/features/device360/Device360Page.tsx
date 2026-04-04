import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../../app/state';
import { EmptyState } from '../../components/EmptyState';
import { IssueTag } from '../../components/IssueTag';
import { selectComplianceDeviceDetail } from '../compliance/selectors';
import { PageHeader } from '../../components/PageHeader';
import { SummaryStrip } from '../../components/SummaryStrip';
import { TableSection } from '../../components/TableSection';
import { DetailRailSection } from '../../components/DetailRailSection';
import { StatusChip } from '../../components/StatusChip';
import { DataTable } from '../../components/DataTable';

export function Device360Page() {
  const { id } = useParams();
  const { data } = useAppState();
  const device = data.devices.find((d) => d.id === id);
  const context = useMemo(() => data.device360Contexts.find((d) => d.deviceId === id), [data.device360Contexts, id]);

  if (!device) return <EmptyState title="Device not found" description="Select a device from inventory or topology." />;

  const imageState = data.device360Contexts.find((x) => x.deviceId === device.id);
  const compliance = selectComplianceDeviceDetail(data, device.id);
  const timeline = data.timelineEvents.filter((e) => e.deviceId === id).slice(0, 8);
  const issues = context?.currentIssues ?? [];
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const selectedIssue = issues[selectedIssueIndex] ?? 'No issue';

  return (
    <div>
      <PageHeader title="Device 360 Investigation" subtitle={`${device.name} / ${device.siteId}`} />

      <SummaryStrip items={[
        { label: 'Health', value: context?.currentHealth ?? device.health },
        { label: 'Compliance', value: compliance?.status ?? 'unknown' },
        { label: 'Software', value: imageState?.currentHealth ?? 'none' },
        { label: 'Issue Count', value: issues.length }
      ]} />

      <div className="investigation-layout">
        <div>
          <TableSection title="Current Metadata" metadata={`source ${device.sourceDiscoveryJobId}`}>
            <p>Management IP: {device.managementIp}</p>
            <p>Reachability: <StatusChip value={device.reachability} /></p>
            <p>Role: {device.roleOverride ?? device.roleDetected}</p>
            <p>Policy: {device.preferredManagementIpPolicy}</p>
          </TableSection>

          <TableSection title="Device Issues" metadata={`rows ${issues.length}`}>
            <DataTable
              columns={['Issue', 'Severity Hint']}
              rows={issues.map((issue) => [issue, <IssueTag key={issue} value={issue.toLowerCase().includes('role') ? 'mis-role' : issue.toLowerCase().includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'} />])}
              selectedRow={selectedIssueIndex}
              onRowSelect={setSelectedIssueIndex}
            />
          </TableSection>

          <TableSection title="Timeline / Observations" metadata={`events ${timeline.length}`}>
            <ul>{timeline.map((h) => <li key={h.id}>{h.at} - [{h.type}] {h.message}</li>)}</ul>
          </TableSection>

          <TableSection title="Compliance & Software" metadata="linked states">
            <p>Compliance: <StatusChip value={compliance?.status ?? 'unknown'} /> / {compliance?.reasonCategory ?? 'none'}</p>
            <p>Image policy: {device.preferredManagementIpPolicy} / candidate: {device.preferredManagementIpCandidate ?? '-'}</p>
          </TableSection>
        </div>

        <div className="right-ops-rail">
          <DetailRailSection title="Active Issue Summary">
            <p>{selectedIssue}</p>
            <div className="tag-row">{selectedIssue !== 'No issue' && <IssueTag value={selectedIssue.toLowerCase().includes('role') ? 'mis-role' : selectedIssue.toLowerCase().includes('reachability') ? 'mgmt-ambiguity' : 'unassigned'} />}</div>
            <p>{context?.recommendedNextAction ?? 'Review normalization status in Inventory.'}</p>
          </DetailRailSection>

          <DetailRailSection title="Investigation Actions">
            <div className="quick-links">
              <Link to={`/assurance?site=${device.siteId}`}>Assurance</Link>
              <Link to={`/troubleshooting?site=${device.siteId}&device=${device.id}`}>Troubleshooting</Link>
              <Link to={`/assurance/path-trace?site=${device.siteId}&device=${device.id}`}>Path Trace</Link>
              <Link to={`/assurance/capture?site=${device.siteId}&device=${device.id}`}>Capture</Link>
              <Link to={`/command-runner?site=${device.siteId}&device=${device.id}`}>Command Runner</Link>
            </div>
          </DetailRailSection>

          <DetailRailSection title="Related Views">
            <div className="quick-links">
              <Link to="/inventory">Inventory</Link>
              <Link to="/topology">Topology</Link>
              <Link to={`/software/images?site=${device.siteId}&device=${device.id}`}>Software</Link>
              <Link to={`/compliance/device/${device.id}`}>Compliance Detail</Link>
            </div>
          </DetailRailSection>
        </div>
      </div>
    </div>
  );
}
