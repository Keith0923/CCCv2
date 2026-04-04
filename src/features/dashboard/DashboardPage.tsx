import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from '../assurance/selectors';
import { selectAssuranceIssues } from '../assurance/clientSelectors';
import { StatusChip } from '../../components/StatusChip';
import { PageHeader } from '../../components/PageHeader';
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
      <PageHeader title="Operations Hub" subtitle="Prioritized monitoring and drill-down command center." />

      <section className="dashboard-control-bar">
        <div className="control-group"><label>Time</label><select><option>24h</option><option>1h</option><option>7d</option></select></div>
        <div className="control-group"><label>Site</label><select><option>All Sites</option></select></div>
        <div className="control-group"><label>Domain</label><select><option>Campus</option><option>Wireless</option><option>SDA</option></select></div>
        <button type="button">Refresh Snapshot</button>
        <span className="control-context">Monitoring context: live snapshot / global scope</span>
      </section>

      <section className="dashboard-kpi-grid">
        <article className="kpi-card kpi-primary"><small>Open Issues</small><strong>{issues.filter((i) => i.status !== 'resolved').length}</strong><p>Investigate top active alerts first.</p></article>
        <article className="kpi-card"><small>Degraded Sites</small><strong>{assurance.healthTotals.degradedSites}</strong><p>Sites requiring immediate review.</p></article>
        <article className="kpi-card"><small>Impacted Devices</small><strong>{assurance.healthTotals.impactedDevices}</strong><p>Devices with health or policy risk.</p></article>
        <article className="kpi-card"><small>Running Discovery</small><strong>{data.discoveryJobs.filter((j) => j.status === 'running').length}</strong><p>Current discovery workloads.</p></article>
      </section>

      <div className="dashboard-layout">
        <div className="dashboard-main-grid">
          <DashletCard title="Operational Focus (Primary)">
            <DataTable
              columns={['Site', 'Impacted', 'Health', 'Action']}
              rows={assurance.siteSummary.slice(0, 5).map((site) => [site.name, `${site.impacted}/${site.totalDevices}`, <StatusChip key={site.siteId} value={site.health} />, <Link to={`/assurance?site=${site.siteId}`}>Inspect</Link>])}
              actionColumnIndexes={[3]}
            />
          </DashletCard>

          <DashletCard title="Task & Event Watch">
            <DataTable columns={['Issue', 'Site', 'Status', 'Category']} rows={issueRows} selectedRow={selectedIssueIndex} onRowSelect={setSelectedIssueIndex} />
          </DashletCard>

          <DashletCard title="Impacted Entities">
            <DataTable columns={['Device', 'Site', 'Health', 'Issues']} rows={entityRows} selectedRow={selectedEntityIndex} onRowSelect={setSelectedEntityIndex} />
          </DashletCard>

          <DashletCard title="Recent Discovery">
            <DataTable
              columns={['Job', 'Type', 'Status', 'Action']}
              rows={data.discoveryJobs.slice(0, 4).map((j) => [j.name, j.discoveryType, <StatusChip key={j.id} value={j.status} />, <Link to={`/discovery?job=${j.id}`}>Open</Link>])}
              actionColumnIndexes={[3]}
            />
          </DashletCard>
        </div>

        <aside className="dashboard-rail-bridge right-ops-rail">
          <DetailRailSection title="Selected Task / Event">
            {selectedIssue ? <><p>{selectedIssue.title}</p><p>Site: {selectedIssue.siteId}</p><p>Status: <StatusChip value={selectedIssue.status} /></p></> : <p>No issue selected</p>}
          </DetailRailSection>

          <DetailRailSection title="Selected Impacted Entity">
            {selectedEntity ? <><p>{selectedEntity.device.name}</p><p>Site: {selectedEntity.device.siteId}</p><p>Health: <StatusChip value={selectedEntity.device.health} /></p></> : <p>No entity selected</p>}
          </DetailRailSection>

          <DetailRailSection title="Next Actions">
            <div className="quick-links">
              {selectedEntity && <button onClick={() => setSelectedDeviceId(selectedEntity.device.id)}>Pin Global Device</button>}
              {selectedEntity && <Link to={`/device-360/${selectedEntity.device.id}`}>Open Device 360</Link>}
              {selectedIssue && <Link to={`/assurance/issues?site=${selectedIssue.siteId}&issue=${selectedIssue.id}`}>Open Issue Detail</Link>}
              <Link to="/assurance/path-trace">Run Path Trace</Link>
            </div>
          </DetailRailSection>
        </aside>
      </div>
    </div>
  );
}
