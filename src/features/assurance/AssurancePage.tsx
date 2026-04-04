import { Link, useSearchParams } from 'react-router-dom';
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

export function AssurancePage() {
  const { data } = useAppState();
  const [params] = useSearchParams();
  const siteFocus = params.get('site') ?? '';
  const trendRange = (params.get('range') as '1h' | '24h' | '7d' | null) ?? '24h';
  const summary = selectAssuranceSummary(data, siteFocus || undefined);
  const trend = selectAssuranceTrend(trendRange);
  const issues = selectAssuranceIssues(siteFocus || undefined);
  const selectedIssue = issues[0];

  return (
    <div>
      <PageHeader title="Assurance Monitoring Hub" subtitle="Health and issue drill-down dashboard." />

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
            />
          </TableSection>

          <TableSection title="Issues / Events" metadata={`rows ${issues.length}`}>
            <DataTable
              columns={['Title', 'Site', 'Status', 'Actions']}
              rows={issues.map((i) => [i.title, i.siteId, <StatusChip key={i.id} value={i.status} />, <Link to={`/assurance/issues?site=${i.siteId}&issue=${i.id}`}>Open</Link>])}
            />
          </TableSection>
        </div>

        <div className="right-ops-rail">
          <DetailRailSection title="Selected Issue Detail">
            {selectedIssue ? <><p>{selectedIssue.title}</p><p>Category: {selectedIssue.category}</p><p>Status: <StatusChip value={selectedIssue.status} /></p></> : <p>No issue selected</p>}
          </DetailRailSection>
          <DetailRailSection title="Drill-down Actions">
            <div className="quick-links">
              <Link to={siteFocus ? `/assurance/clients?site=${siteFocus}` : '/assurance/clients'}>Client Health</Link>
              <Link to={siteFocus ? `/assurance/path-trace?site=${siteFocus}` : '/assurance/path-trace'}>Path Trace</Link>
              <Link to={siteFocus ? `/troubleshooting?site=${siteFocus}` : '/troubleshooting'}>Troubleshooting</Link>
            </div>
          </DetailRailSection>
        </div>
      </div>
    </div>
  );
}
