import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from '../assurance/selectors';
import { selectAssuranceIssues } from '../assurance/clientSelectors';
import { StatusChip } from '../../components/StatusChip';
import { PageHeader } from '../../components/PageHeader';
import { FilterStrip } from '../../components/FilterStrip';
import { SummaryStrip } from '../../components/SummaryStrip';
import { DashletCard } from '../../components/DashletCard';
import { DetailRailSection } from '../../components/DetailRailSection';
import { DataTable } from '../../components/DataTable';

export function DashboardPage() {
  const { data, setSelectedDeviceId } = useAppState();
  const assurance = selectAssuranceSummary(data);
  const issues = selectAssuranceIssues();
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(0);

  const selectedIssue = issues[selectedIssueIndex];
  const entities = assurance.impactedDevices.slice(0, 6);
  const selectedEntity = entities[selectedEntityIndex];

  const issueRows = useMemo(
    () => issues.slice(0, 6).map((i) => [i.title, i.siteId, <StatusChip key={i.id} value={i.status} />, i.category]),
    [issues]
  );

  const entityRows = useMemo(
    () => entities.map((row) => [row.device.name, row.device.siteId, <StatusChip key={row.device.id} value={row.device.health} />, row.categories.join(', ')]),
    [entities]
  );

  return (
    <div>
      <PageHeader title="Operations Hub" subtitle="Monitoring and drill-down command center." />

      <FilterStrip>
        <select><option>Time: 24h</option><option>1h</option><option>7d</option></select>
        <select><option>Site: All</option></select>
        <select><option>Domain: Campus</option><option>Wireless</option><option>SDA</option></select>
        <button type="button">Refresh</button>
      </FilterStrip>

      <SummaryStrip items={[
        { label: 'Running Discovery', value: data.discoveryJobs.filter((j) => j.status === 'running').length },
        { label: 'Open Issues', value: issues.filter((i) => i.status !== 'resolved').length },
        { label: 'Degraded Sites', value: assurance.healthTotals.degradedSites },
        { label: 'Impacted Devices', value: assurance.healthTotals.impactedDevices }
      ]} />

      <div className="investigation-layout">
        <div className="hub-grid">
          <DashletCard title="Recent Discovery">
            <DataTable
              columns={['Job', 'Type', 'Status', 'Action']}
              rows={data.discoveryJobs.slice(0, 4).map((j) => [j.name, j.discoveryType, <StatusChip key={j.id} value={j.status} />, <Link to={`/discovery?job=${j.id}`}>Open</Link>])}
              actionColumnIndexes={[3]}
            />
          </DashletCard>

          <DashletCard title="Operational Focus">
            <DataTable
              columns={['Site', 'Impacted', 'Health', 'Action']}
              rows={assurance.siteSummary.slice(0, 4).map((site) => [site.name, `${site.impacted}/${site.totalDevices}`, <StatusChip key={site.siteId} value={site.health} />, <Link to={`/assurance?site=${site.siteId}`}>Inspect</Link>])}
              actionColumnIndexes={[3]}
            />
          </DashletCard>

          <DashletCard title="Task & Event Watch">
            <DataTable columns={['Issue', 'Site', 'Status', 'Category']} rows={issueRows} selectedRow={selectedIssueIndex} onRowSelect={setSelectedIssueIndex} />
          </DashletCard>

          <DashletCard title="Impacted Entities">
            <DataTable columns={['Device', 'Site', 'Health', 'Issues']} rows={entityRows} selectedRow={selectedEntityIndex} onRowSelect={setSelectedEntityIndex} />
          </DashletCard>
        </div>

        <div className="right-ops-rail">
          <DetailRailSection title="Selected Task / Event">
            {selectedIssue ? <><p>{selectedIssue.title}</p><p>Site: {selectedIssue.siteId}</p><p>Status: <StatusChip value={selectedIssue.status} /></p></> : <p>No issue</p>}
          </DetailRailSection>

          <DetailRailSection title="Selected Impacted Entity">
            {selectedEntity ? <><p>{selectedEntity.device.name}</p><p>Site: {selectedEntity.device.siteId}</p><p>Health: <StatusChip value={selectedEntity.device.health} /></p></> : <p>No entity</p>}
          </DetailRailSection>

          <DetailRailSection title="Quick Actions">
            <div className="quick-links">
              {selectedEntity && <button onClick={() => setSelectedDeviceId(selectedEntity.device.id)}>Set Global Device</button>}
              {selectedEntity && <Link to={`/device-360/${selectedEntity.device.id}`}>Device 360</Link>}
              {selectedIssue && <Link to={`/assurance/issues?site=${selectedIssue.siteId}&issue=${selectedIssue.id}`}>Open Issue</Link>}
              <Link to="/assurance/path-trace">Path Trace</Link>
            </div>
          </DetailRailSection>
        </div>
      </div>
    </div>
  );
}
