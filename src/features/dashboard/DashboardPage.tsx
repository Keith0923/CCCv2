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

  const openIssues = issues.filter((i) => i.status !== 'resolved').length;
  const runningDiscoveries = data.discoveryJobs.filter((j) => j.status === 'running').length;
  const totalDevices = assurance.siteSummary.reduce((sum, site) => sum + site.totalDevices, 0);
  const topSite = assurance.siteSummary[0];

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

      <section className="dashboard-control-bar context-band">
        <div className="context-band-head">
          <strong>Monitoring Scope</strong>
          <span>Live operations baseline for triage and drill-down</span>
        </div>
        <div className="context-band-meta">
          <div className="context-pill"><label>Time Window</label><strong>Last 24 hours</strong></div>
          <div className="context-pill"><label>Site Scope</label><strong>All Sites</strong></div>
          <div className="context-pill"><label>Domain</label><strong>Campus</strong></div>
          <div className="context-pill"><label>Data Freshness</label><strong>Snapshot / Manual Refresh</strong></div>
        </div>
        <div className="context-band-controls">
          <div className="control-group"><label>Time</label><select><option>24h</option><option>1h</option><option>7d</option></select></div>
          <div className="control-group"><label>Site</label><select><option>All Sites</option></select></div>
          <div className="control-group"><label>Domain</label><select><option>Campus</option><option>Wireless</option><option>SDA</option></select></div>
          <button type="button">Refresh Snapshot</button>
        </div>
      </section>

      <section className="dashboard-kpi-grid">
        <article className="kpi-card kpi-primary kpi-open-issues"><small>Open Issues</small><strong>{openIssues}</strong><p>Highest-priority active alerts across current scope.</p></article>
        <article className="kpi-card kpi-secondary"><small>Degraded Sites</small><strong>{assurance.healthTotals.degradedSites}</strong><p>Sites needing attention before broader impact.</p></article>
        <article className="kpi-card kpi-secondary"><small>Impacted Devices</small><strong>{assurance.healthTotals.impactedDevices}</strong><p>Devices showing health or policy risk signals.</p></article>
        <article className="kpi-card kpi-tertiary"><small>Running Discovery</small><strong>{runningDiscoveries}</strong><p>Background workload; monitor but lower triage priority.</p></article>
      </section>

      <div className="dashboard-layout">
        <div className="dashboard-main-grid">
          <DashletCard title="Operational Focus (Primary)">
            <section className="ops-focus-hero">
              <div>
                <p className="ops-focus-label">Top Focus</p>
                <h3>{topSite ? topSite.name : 'No active site focus'}</h3>
                <p className="ops-focus-context">{topSite ? `${topSite.impacted} impacted of ${topSite.totalDevices} devices in scope.` : 'No impacted site currently surfaced.'}</p>
              </div>
              <div className="ops-focus-meta">
                <div><small>Open Issues</small><strong>{openIssues}</strong></div>
                <div><small>Impacted Devices</small><strong>{assurance.healthTotals.impactedDevices}</strong></div>
                <div><small>Total Devices</small><strong>{totalDevices}</strong></div>
              </div>
              <div className="ops-focus-actions">
                {topSite && <Link to={`/assurance?site=${topSite.siteId}`}>Inspect Priority Site</Link>}
                <Link to="/assurance">Open Assurance Workspace</Link>
              </div>
            </section>
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
          <div className="rail-flow-caption">Investigation flow: center selection → right rail detail</div>

          <DetailRailSection title={`Selected Task / Event${selectedIssue ? ` · ${selectedIssue.siteId}` : ''}`}>
            {selectedIssue ? <><p className="rail-selection-hint">Source: Task & Event Watch (selected row)</p><p>{selectedIssue.title}</p><p>Site: {selectedIssue.siteId}</p><p>Status: <StatusChip value={selectedIssue.status} /></p></> : <p>No issue selected</p>}
          </DetailRailSection>

          <DetailRailSection title={`Selected Impacted Entity${selectedEntity ? ` · ${selectedEntity.device.siteId}` : ''}`}>
            {selectedEntity ? <><p className="rail-selection-hint">Source: Impacted Entities (selected row)</p><p>{selectedEntity.device.name}</p><p>Site: {selectedEntity.device.siteId}</p><p>Health: <StatusChip value={selectedEntity.device.health} /></p></> : <p>No entity selected</p>}
          </DetailRailSection>

          <DetailRailSection title="Next Actions (Drill-down)">
            <div className="quick-links">
              {selectedEntity && <button onClick={() => setSelectedDeviceId(selectedEntity.device.id)}>Pin Global Device</button>}
              {selectedEntity && <Link to={`/device-360/${selectedEntity.device.id}`}>Open Device 360</Link>}
              {selectedIssue && <Link to={`/assurance/issues?site=${selectedIssue.siteId}&issue=${selectedIssue.id}`}>Open Issue Detail</Link>}
              {selectedEntity && <Link to={`/assurance/path-trace?device=${selectedEntity.device.id}&site=${selectedEntity.device.siteId}`}>Run Path Trace</Link>}
            </div>
          </DetailRailSection>
        </aside>
      </div>
    </div>
  );
}
