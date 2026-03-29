import { Link, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { useMemo, useState } from 'react';
import { Panel } from '../../components/Panel';
import { DeviceRole, PreferredManagementIpPolicy } from '../../domains/types';

const roleOptions: DeviceRole[] = ['core', 'distribution', 'access', 'wireless-controller', 'unknown'];
const policyOptions: PreferredManagementIpPolicy[] = ['loopback', 'interface-vlan', 'system'];

export function InventoryPage() {
  const { data, setSelectedDeviceId, selectedDeviceId, normalizeDevice } = useAppState();
  const [params] = useSearchParams();
  const jobFocus = params.get('job') ?? '';
  const [assignment, setAssignment] = useState('all');

  const devices = useMemo(() => {
    const base = data.devices.filter((d) => assignment === 'all' || d.assignmentState === assignment);
    if (!jobFocus) return base;
    return [...base].sort((a, b) => {
      const ap = a.sourceDiscoveryJobId === jobFocus ? 0 : 1;
      const bp = b.sourceDiscoveryJobId === jobFocus ? 0 : 1;
      return ap - bp;
    });
  }, [data.devices, assignment, jobFocus]);

  const selected = data.devices.find((d) => d.id === selectedDeviceId) ?? devices[0];
  const effectiveRole = selected ? (selected.roleOverride ?? selected.roleDetected) : 'unknown';

  const focusedCount = devices.filter((d) => d.sourceDiscoveryJobId === jobFocus).length;

  return (
    <div>
      <h1>Inventory</h1>
      <FilterBar>
        <select value={assignment} onChange={(e) => setAssignment(e.target.value)}>
          <option value="all">All</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
          <option value="pending">Pending</option>
        </select>
      </FilterBar>

      {jobFocus && (
        <Panel title="Discovery Job Focus">
          <p>Focused job: {jobFocus}</p>
          <p>Visible related devices: {focusedCount}</p>
        </Panel>
      )}

      <DataTable
        columns={['Device', 'Mgmt IP', 'Reachability', 'Detected Role', 'Admin Override', 'Effective Role', 'Site', 'Assignment', 'Health', 'Source Job', 'Actions']}
        rows={devices.map((d) => [
          d.name,
          d.managementIp,
          d.reachability,
          d.roleDetected,
          d.roleOverride ?? '-',
          d.roleOverride ?? d.roleDetected,
          d.siteId,
          <StatusBadge key={`${d.id}-as`} value={d.assignmentState} />,
          <StatusBadge key={`${d.id}-h`} value={d.health} />,
          d.sourceDiscoveryJobId,
          <>
            <button onClick={() => setSelectedDeviceId(d.id)}>Normalize</button>
            <Link to={`/topology?site=${d.siteId}`}>Topology</Link>{' '}
            <Link to={`/device-360/${d.id}`}>Device 360</Link>
          </>
        ])}
      />

      {selected && (
        <Panel title="Post-Discovery Normalization">
          <p>Device: {selected.name}</p>
          <p>Current: site={selected.siteId} / role={effectiveRole} / policy={selected.preferredManagementIpPolicy}</p>

          <div className="normalize-grid">
            <label>
              Site assignment
              <select defaultValue={selected.siteId} onChange={(e) => normalizeDevice({ deviceId: selected.id, siteId: e.target.value })}>
                {data.sites.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
              </select>
            </label>

            <label>
              Role normalization (admin override)
              <select defaultValue={selected.roleOverride ?? selected.roleDetected} onChange={(e) => normalizeDevice({ deviceId: selected.id, roleOverride: e.target.value as DeviceRole })}>
                {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>

            <label>
              Preferred management IP policy
              <select defaultValue={selected.preferredManagementIpPolicy} onChange={(e) => normalizeDevice({ deviceId: selected.id, preferredManagementIpPolicy: e.target.value as PreferredManagementIpPolicy })}>
                {policyOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>
        </Panel>
      )}
    </div>
  );
}
