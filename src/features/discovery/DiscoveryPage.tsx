import { useMemo, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { SearchBox } from '../../components/SearchBox';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { Link, useNavigate } from 'react-router-dom';
import { Panel } from '../../components/Panel';

export function DiscoveryPage() {
  const { data, addDiscoveryJob } = useAppState();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<'ip-range' | 'cidr' | 'cdp' | 'lldp'>('ip-range');
  const [credentialProfileId, setCredentialProfileId] = useState(data.credentialProfiles[0]?.id ?? '');
  const [preferredIp, setPreferredIp] = useState<'loopback' | 'interface-vlan' | 'system'>('loopback');
  const [nextStatus, setNextStatus] = useState<'success' | 'partial' | 'failed'>('success');

  const rows = useMemo(
    () => data.discoveryJobs
      .filter((j) => j.name.toLowerCase().includes(keyword.toLowerCase()))
      .map((j) => [
        j.name,
        j.discoveryType,
        j.preferredManagementIp,
        data.credentialProfiles.find((c) => c.id === j.credentialProfileId)?.name ?? j.credentialProfileId,
        <StatusBadge key={j.id} value={j.status} />,
        <Link key={`${j.id}-inv`} to={`/inventory?job=${j.id}`}>Inventoryへ</Link>
      ]),
    [data.discoveryJobs, data.credentialProfiles, keyword]
  );

  const recentResult = data.discoveryResults[0];

  return (
    <div>
      <h1>Discovery</h1>
      <FilterBar>
        <SearchBox value={keyword} onChange={setKeyword} />
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="ip-range">IP range</option>
          <option value="cidr">CIDR</option>
          <option value="cdp">CDP</option>
          <option value="lldp">LLDP</option>
        </select>
        <select value={credentialProfileId} onChange={(e) => setCredentialProfileId(e.target.value)}>
          {data.credentialProfiles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={preferredIp} onChange={(e) => setPreferredIp(e.target.value as typeof preferredIp)}>
          <option value="loopback">Preferred IP: loopback</option>
          <option value="interface-vlan">Preferred IP: interface-vlan</option>
          <option value="system">Preferred IP: system</option>
        </select>
        <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as typeof nextStatus)}>
          <option value="success">Result: success</option>
          <option value="partial">Result: partial</option>
          <option value="failed">Result: failed</option>
        </select>
        <button
          onClick={() => {
            const created = addDiscoveryJob({
              name: `Manual ${type}`,
              discoveryType: type,
              credentialProfileId,
              preferredManagementIp: preferredIp,
              status: nextStatus
            });
            navigate(`/inventory?job=${created.id}`);
          }}
        >
          Add Discovery
        </button>
      </FilterBar>

      <Panel title="Latest Result Summary">
        <p>
          success: {recentResult?.summary.success ?? 0} / partial: {recentResult?.summary.partial ?? 0} / failed: {recentResult?.summary.failed ?? 0}
        </p>
        <p>Failure reason: {recentResult?.reason ?? 'none'}</p>
      </Panel>

      <DataTable columns={['Name', 'Type', 'Preferred Mgmt IP', 'Credential', 'Status', 'Flow']} rows={rows} />
    </div>
  );
}
