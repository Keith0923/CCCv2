import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAppState } from '../../app/state';
import { DeviceRole, PreferredManagementIpPolicy } from '../../domains/types';
import { DataTable } from '../../components/DataTable';
import { IssueTag } from '../../components/IssueTag';
import { StatusChip } from '../../components/StatusChip';
import { PageHeader } from '../../components/PageHeader';
import { FilterStrip } from '../../components/FilterStrip';
import { TableSection } from '../../components/TableSection';
import { DetailRailSection } from '../../components/DetailRailSection';
import { ActionBar } from '../../components/ActionBar';

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
    const familyFiltered = base.filter((d) => family === 'all' || (d.roleOverride ?? d.roleDetected) === family);
    if (!jobFocus) return familyFiltered;
    return [...familyFiltered].sort((a, b) => (a.sourceDiscoveryJobId === jobFocus ? 0 : 1) - (b.sourceDiscoveryJobId === jobFocus ? 0 : 1));
  }, [data.devices, assignment, family, jobFocus]);

  const selected = data.devices.find((d) => d.id === selectedDeviceId) ?? devices[0];
  const effectiveRole = selected ? (selected.roleOverride ?? selected.roleDetected) : 'unknown';

  return (
    <div>
      <PageHeader title="Inventory Operations" subtitle="Filter, focus, and normalize managed devices." />

      <FilterStrip>
        <select><option>Location: Global</option><option>HQ</option><option>Branch</option></select>
        <select value={family} onChange={(e) => setFamily(e.target.value)}>
          <option value="all">Family: All</option>
          <option value="core">Core</option>
          <option value="distribution">Distribution</option>
          <option value="access">Access</option>
          <option value="wireless-controller">Wireless</option>
        </select>
        <select value={assignment} onChange={(e) => setAssignment(e.target.value)}>
          <option value="all">Focus: All</option><option value="assigned">Assigned</option><option value="unassigned">Unassigned</option><option value="pending">Pending</option>
        </select>
      </FilterStrip>

      <ActionBar>
        <button type="button">Table View</button>
        <button type="button">Alternate View</button>
        <button type="button">Export</button>
      </ActionBar>

      <div className="investigation-layout">
        <div>
          <TableSection title="Inventory Table" metadata={`rows ${devices.length} / focus ${assignment} / family ${family}`}>
            <DataTable
              columns={['Device', 'Site', 'Health', 'Role', 'Reachability', 'Issue Hint', 'Actions']}
              rows={devices.map((d) => [
                d.name,
                d.siteId,
                <StatusChip key={`${d.id}-h`} value={d.health} />,
                d.roleOverride ?? d.roleDetected,
                <StatusChip key={`${d.id}-r`} value={d.reachability} />,
                <>{d.assignmentState !== 'assigned' && <IssueTag value="unassigned" />} {(d.roleOverride ?? d.roleDetected) === 'unknown' && <IssueTag value="mis-role" />}</>,
                <><button onClick={() => setSelectedDeviceId(d.id)}>Select</button> <Link to={`/device-360/${d.id}`}>Device 360</Link></>
              ])}
            />
          </TableSection>
        </div>

        {selected && (
          <div className="right-ops-rail">
            <DetailRailSection title="Selected Device Summary">
              <p>{selected.name}</p>
              <p>Site: {selected.siteId}</p>
              <p>Health: <StatusChip value={selected.health} /></p>
              <p>Role: {effectiveRole}</p>
            </DetailRailSection>

            <DetailRailSection title="Normalization Actions">
              <div className="normalize-grid">
                <label>Site<select value={selected.siteId} onChange={(e) => normalizeDevice({ deviceId: selected.id, siteId: e.target.value })}>{data.sites.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}</select></label>
                <label>Role<select value={selected.roleOverride ?? selected.roleDetected} onChange={(e) => normalizeDevice({ deviceId: selected.id, roleOverride: e.target.value as DeviceRole })}>{roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}</select></label>
                <label>Policy<select value={selected.preferredManagementIpPolicy} onChange={(e) => normalizeDevice({ deviceId: selected.id, preferredManagementIpPolicy: e.target.value as PreferredManagementIpPolicy })}>{policyOptions.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
              </div>
            </DetailRailSection>
          </div>
        )}
      </div>
    </div>
  );
}
