import { Link, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { useMemo, useState } from 'react';
import { Panel } from '../../components/Panel';
import { DeviceRole, PreferredManagementIpPolicy } from '../../domains/types';
import { IssueTag } from '../../components/IssueTag';

const roleOptions: DeviceRole[] = ['core', 'distribution', 'access', 'wireless-controller', 'unknown'];
const policyOptions: PreferredManagementIpPolicy[] = ['loopback', 'interface-vlan', 'system'];

export function InventoryPage() {
  const { data, setSelectedDeviceId, selectedDeviceId, normalizeDevice } = useAppState();
  const [params] = useSearchParams();
  const jobFocus = params.get('job') ?? '';
  const [assignment, setAssignment] = useState('all');
  const [family, setFamily] = useState('all');

  const devices = useMemo(() => {
    const base = data.devices.filter((d) => assignment === 'all' || d.assignmentState === assignment);
    const familyFiltered = base.filter((d) => {
      if (family === 'all') return true;
      if (family === 'wireless') return (d.roleOverride ?? d.roleDetected) === 'wireless-controller';
      return (d.roleOverride ?? d.roleDetected) === family;
    });

    if (!jobFocus) return familyFiltered;
    return [...familyFiltered].sort((a, b) => {
      const ap = a.sourceDiscoveryJobId === jobFocus ? 0 : 1;
      const bp = b.sourceDiscoveryJobId === jobFocus ? 0 : 1;
      return ap - bp;
    });
  }, [data.devices, assignment, family, jobFocus]);

  const selected = data.devices.find((d) => d.id === selectedDeviceId) ?? devices[0];
  const effectiveRole = selected ? (selected.roleOverride ?? selected.roleDetected) : 'unknown';
  const focusedCount = devices.filter((d) => d.sourceDiscoveryJobId === jobFocus).length;

  return (
    <div>
      <div className="page-header">
        <h1>Inventory Operations</h1>
        <p>Location and device-family based normalization workspace.</p>
      </div>

      <div className="filter-strip">
        <select><option>Location: Global</option><option>HQ</option><option>Branch</option></select>
        <select value={family} onChange={(e) => setFamily(e.target.value)}>
          <option value="all">Family: All</option>
          <option value="core">Core</option>
          <option value="distribution">Distribution</option>
          <option value="access">Access</option>
          <option value="wireless">Wireless</option>
        </select>
        <select value={assignment} onChange={(e) => setAssignment(e.target.value)}>
          <option value="all">Focus: All</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
          <option value="pending">Pending</option>
        </select>
        <button type="button">Table View</button>
        <button type="button">Alternate View</button>
      </div>

      <Panel title="Table Metadata">
        <p>Rows: {devices.length} / Job focus rows: {jobFocus ? focusedCount : 'n/a'} / Family: {family} / Assignment: {assignment}</p>
      </Panel>

      <div className="workbench-grid">
        <div>
          <DataTable
            columns={['Device', 'Mgmt IP', 'Reachability', 'Detected Role', 'Admin Override', 'Site', 'Health', 'Issue Hint', 'Source Job', 'Actions']}
            rows={devices.map((d) => [
              d.name,
              d.managementIp,
              <StatusBadge key={`${d.id}-reach`} value={d.reachability} />,
              d.roleDetected,
              d.roleOverride ?? '-',
              d.siteId,
              <StatusBadge key={`${d.id}-h`} value={d.health} />,
              <>{d.assignmentState !== 'assigned' && <IssueTag value="unassigned" />} {(d.roleOverride ?? d.roleDetected) === 'unknown' && <IssueTag value="mis-role" />} {d.reachability !== 'reachable' && <IssueTag value="mgmt-ambiguity" />}</>,
              d.sourceDiscoveryJobId,
              <>
                <button onClick={() => setSelectedDeviceId(d.id)}>Select</button>
                <Link to={`/device-360/${d.id}`}>Device 360</Link>
              </>
            ])}
          />
        </div>

        {selected && (
          <div className="detail-rail-panel">
            <Panel title="Selected Device Detail">
              <p>Device: {selected.name}</p>
              <p>Current: site={selected.siteId} / role={effectiveRole} / policy={selected.preferredManagementIpPolicy}</p>
              <div className="normalize-grid">
                <label>
                  Site assignment
                  <select value={selected.siteId} onChange={(e) => normalizeDevice({ deviceId: selected.id, siteId: e.target.value })}>
                    {data.sites.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
                  </select>
                </label>

                <label>
                  Role normalization
                  <select value={selected.roleOverride ?? selected.roleDetected} onChange={(e) => normalizeDevice({ deviceId: selected.id, roleOverride: e.target.value as DeviceRole })}>
                    {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>

                <label>
                  Preferred mgmt IP policy
                  <select value={selected.preferredManagementIpPolicy} onChange={(e) => normalizeDevice({ deviceId: selected.id, preferredManagementIpPolicy: e.target.value as PreferredManagementIpPolicy })}>
                    {policyOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </div>
  );
}
