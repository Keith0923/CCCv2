import { Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useAppState } from '../../app/state';
import { selectAssuranceSummary } from './selectors';
import { selectAssuranceIssues, selectAssuranceTrend } from './clientSelectors';
import { IssueTag } from '../../components/IssueTag';
import { StatusChip } from '../../components/StatusChip';
import { PageHeader } from '../../components/PageHeader';
import { FilterStrip } from '../../components/FilterStrip';
import { SummaryStrip } from '../../components/SummaryStrip';
import { DashletCard } from '../../components/DashletCard';
import { SectionTabs } from '../../components/SectionTabs';
import { TableSection } from '../../components/TableSection';
import { DataTable } from '../../components/DataTable';
import { DetailRailSection } from '../../components/DetailRailSection';
import { ContextHeader } from '../../components/ContextHeader';

export function AssurancePage() {
  const { data, setSelectedDeviceId } = useAppState();
  const [params] = useSearchParams();
  const siteFocus = params.get('site') ?? '';
  const deviceFocus = params.get('device') ?? '';
  const issueFocus = params.get('issue') ?? '';
  const trendRange = (params.get('range') as '1h' | '24h' | '7d' | null) ?? '24h';
  const summary = selectAssuranceSummary(data, siteFocus || undefined);
  const trend = selectAssuranceTrend(trendRange);
  const issues = selectAssuranceIssues(siteFocus || undefined);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState(0);
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(0);

  const selectedIssue = issues[selectedIssueIndex];
  const selectedSite = summary.siteSummary[selectedSiteIndex];

  return (
    <div>
      <PageHeader title="Assurance Monitoring Hub" subtitle="Health and issue drill-down dashboard." />
      <ContextHeader site={siteFocus || 'all'} device={deviceFocus} issue={issueFocus} time={trendRange} />

      <FilterStrip>
        <select><option>Time: {trendRange}</option><option>1h</option><option>24h</option><option>7d</option></select>
        <select><option>Site: {siteFocus || 'all'}</option></select>
        <select><option>Domain: enterprise</option><option>wireless</option></select>
      </FilterStrip>

      <SectionTabs>
        <Link to={siteFocus ? `/assurance/clients?site=${siteFocus}` : '/assurance/clients'}>Client</Link>
        <Link to={siteFocus ? `/assurance?site=${siteFocus}` : '/assurance'}>Device</Link>
        <Link to={siteFocus ? `/assurance?site=${siteFocus}` : '/assurance'}>Site</Link>
        <Link to={siteFocus ? `/assurance/issues?site=${siteFocus}` : '/assurance/issues'}>Issues</Link>
        <Link to={siteFocus ? `/assurance/issues?site=${siteFocus}` : '/assurance/issues'}>Events</Link>
      </SectionTabs>

      <SummaryStrip items={[
        { label: 'Healthy Sites', value: summary.healthTotals.healthySites },
        { label: 'Degraded Sites', value: summary.healthTotals.degradedSites },
        { label: 'Impacted Devices', value: summary.healthTotals.impactedDevices },
        { label: 'Open Issues', value: issues.filter((i) => i.status !== 'resolved').length }
      ]} />

      <div className="investigation-layout">
        <div>
          <div className="hub-grid">
            <DashletCard title="Trend Summary"><p>avg health {trend.avgHealth} / worst site {trend.worstSite}</p></DashletCard>
            <DashletCard title="Issue Summary"><p><IssueTag value="unassigned" /> {summary.categorySummary.unassigned} <IssueTag value="mis-role" /> {summary.categorySummary['mis-role']} <IssueTag value="mgmt-ambiguity" /> {summary.categorySummary['mgmt-ambiguity']}</p></DashletCard>
          </div>

          <TableSection title="Site Health" metadata={`sites ${summary.siteSummary.length}`}>
            <DataTable
              columns={['Site', 'Health', 'Impacted', 'Actions']}
              rows={summary.siteSummary.map((site) => [site.name, <StatusChip key={site.siteId} value={site.health} />, site.impacted, <Link to={`/assurance?site=${site.siteId}`}>Focus</Link>])}
              selectedRow={selectedSiteIndex}
              onRowSelect={setSelectedSiteIndex}
              actionColumnIndexes={[3]}
            />
          </TableSection>

          <TableSection title="Issues / Events" metadata={`rows ${issues.length}`}>
            <DataTable
              columns={['Title', 'Site', 'Status', 'Category', 'Actions']}
              rows={issues.map((i) => [i.title, i.siteId, <StatusChip key={i.id} value={i.status} />, i.category, <Link to={`/assurance/issues?site=${i.siteId}&issue=${i.id}`}>Open</Link>])}
              selectedRow={selectedIssueIndex}
              onRowSelect={setSelectedIssueIndex}
              actionColumnIndexes={[4]}
            />
          </TableSection>
        </div>

        <div className="right-ops-rail">
          <DetailRailSection title="Selected Issue Detail">
            {selectedIssue ? <><p>{selectedIssue.title}</p><p>Category: {selectedIssue.category}</p><p>Status: <StatusChip value={selectedIssue.status} /></p></> : <p>No issue selected</p>}
          </DetailRailSection>

          <DetailRailSection title="Selected Site Context">
            {selectedSite ? <><p>{selectedSite.name}</p><p>Health: <StatusChip value={selectedSite.health} /></p><p>Impacted: {selectedSite.impacted}</p></> : <p>No site selected</p>}
          </DetailRailSection>

          <DetailRailSection title="Drill-down Actions">
            <div className="quick-links">
              {selectedIssue?.deviceId && <button onClick={() => setSelectedDeviceId(selectedIssue.deviceId)}>Set Global Device</button>}
              {selectedIssue?.deviceId && <Link to={`/device-360/${selectedIssue.deviceId}`}>Device 360</Link>}
              {selectedIssue?.clientId && <Link to={`/client-360/${selectedIssue.clientId}?site=${selectedIssue.siteId}`}>Client 360</Link>}
              <Link to={selectedIssue ? `/troubleshooting?site=${selectedIssue.siteId}&device=${selectedIssue.deviceId ?? ''}&issue=${selectedIssue.category}` : '/troubleshooting'}>Troubleshooting</Link>
              <Link to={selectedIssue ? `/assurance/path-trace?site=${selectedIssue.siteId}&issue=${selectedIssue.id}` : '/assurance/path-trace'}>Path Trace</Link>
            </div>
          </DetailRailSection>
        </div>
      </div>
    </div>
  );
}
