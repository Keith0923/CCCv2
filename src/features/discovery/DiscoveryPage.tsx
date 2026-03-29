import { useMemo, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { SearchBox } from '../../components/SearchBox';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { Link } from 'react-router-dom';

export function DiscoveryPage() {
  const { data, addDiscoveryJob } = useAppState();
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('ip-range');

  const rows = useMemo(() => data.discoveryJobs
    .filter((j) => j.name.toLowerCase().includes(keyword.toLowerCase()))
    .map((j) => [
      j.name,
      j.discoveryType,
      j.preferredManagementIp,
      <StatusBadge key={j.id} value={j.status} />,
      <Link key={`${j.id}-inv`} to={`/inventory?job=${j.id}`}>Inventoryへ</Link>
    ]), [data.discoveryJobs, keyword]);

  return (
    <div>
      <h1>Discovery</h1>
      <FilterBar>
        <SearchBox value={keyword} onChange={setKeyword} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ip-range">IP range</option>
          <option value="cidr">CIDR</option>
          <option value="cdp">CDP</option>
          <option value="lldp">LLDP</option>
        </select>
        <button onClick={() => addDiscoveryJob({
          id: `dj-${Date.now()}`,
          name: `Manual ${type}`,
          discoveryType: type as any,
          credentialProfileId: data.credentialProfiles[0].id,
          preferredManagementIp: 'loopback',
          status: 'queued',
          startedAt: new Date().toISOString(),
          resultId: `dr-${Date.now()}`
        })}>Add Discovery</button>
      </FilterBar>
      <DataTable columns={['Name', 'Type', 'Preferred Mgmt IP', 'Status', 'Flow']} rows={rows} />
    </div>
  );
}
