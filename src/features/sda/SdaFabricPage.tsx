import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { selectFabricOverview } from './selectors';

export function SdaFabricPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const model = selectFabricOverview(site || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>SD-Access Fabric Overview Lite</h1>
        <p>Fabric-enabled site role, health, and onboarding status overview.</p>
      </div>

      <SummaryStrip items={[
        { label: 'Healthy Fabric Sites', value: model.summary.healthy },
        { label: 'Warning Fabric Sites', value: model.summary.warning },
        { label: 'Critical Fabric Sites', value: model.summary.critical },
        { label: 'Failed Onboarding', value: model.summary.failedOnboarding }
      ]} />

      <Panel title="Fabric Site List">
        <DataTable
          columns={['Site', 'Site Role', 'Fabric Role', 'Fabric Health', 'Onboarding', 'Hosts', 'Actions']}
          rows={model.sites.map((row) => [
            row.siteId,
            row.siteRole,
            row.fabricRole,
            <StatusBadge key={`${row.siteId}-health`} value={row.fabricHealth} />,
            <StatusBadge key={`${row.siteId}-onb`} value={row.onboardingStatus} />,
            row.onboardingCount,
            <>
              <Link to={`/sda/policy?site=${row.siteId}`}>Policy Matrix</Link>
              {' | '}
              <Link to={`/assurance/advanced?site=${row.siteId}`}>Advanced Assurance</Link>
            </>
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to={device ? `/device-360/${device}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/wireless/maps?site=${site}` : '/wireless/maps'}>Back to Wireless Maps</Link>
      </div>
    </div>
  );
}
