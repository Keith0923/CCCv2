import { Link } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { useState } from 'react';

export function InventoryPage() {
  const { data, setSelectedDeviceId } = useAppState();
  const [assignment, setAssignment] = useState('all');
  const devices = data.devices.filter((d) => assignment === 'all' ? true : d.assignmentState === assignment);

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
      <DataTable
        columns={['Device', 'Mgmt IP', 'Reachability', 'Role', 'Site', 'Assignment', 'Health', 'Source Job', 'Actions']}
        rows={devices.map((d) => [
          d.name,
          d.managementIp,
          d.reachability,
          d.role,
          d.siteId,
          <StatusBadge key={`${d.id}-as`} value={d.assignmentState} />,
          <StatusBadge key={`${d.id}-h`} value={d.health} />,
          d.sourceDiscoveryJobId,
          <>
            <button onClick={() => setSelectedDeviceId(d.id)}>Detail</button>
            <Link to={`/topology?site=${d.siteId}`}>Topology</Link>{' '}
            <Link to={`/device-360/${d.id}`}>Device 360</Link>
          </>
        ])}
      />
    </div>
  );
}
