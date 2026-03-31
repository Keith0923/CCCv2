import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { selectAdvancedCorrelation } from '../sda/selectors';

export function AdvancedAssurancePage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const device = params.get('device') ?? '';
  const group = params.get('group') ?? '';
  const issue = params.get('issue') ?? '';

  const model = selectAdvancedCorrelation(site || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>Advanced Assurance Lite</h1>
        <p>Correlation view across fabric onboarding, policy groups, and impacted entities.</p>
      </div>

      <SummaryStrip items={[
        { label: 'High Correlations', value: model.summary.high },
        { label: 'Medium Correlations', value: model.summary.medium },
        { label: 'Low Correlations', value: model.summary.low },
        { label: 'Focused Site', value: site || 'all' }
      ]} />

      <Panel title="Correlation Summary">
        <DataTable
          columns={['Site', 'Endpoint', 'Policy Group', 'Issue', 'Severity']}
          rows={model.rows.map((row) => [
            row.siteId,
            row.impactedEndpoint,
            row.impactedPolicyGroup,
            row.issue,
            <StatusBadge key={row.id} value={row.severity === 'high' ? 'critical' : row.severity === 'medium' ? 'warning' : 'healthy'} />
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/sda/fabric?site=${site}&device=${device}&issue=${issue}` : '/sda/fabric'}>Go Fabric Overview</Link>
        <Link to={site ? `/sda/policy?site=${site}&group=${group}&issue=${issue}` : '/sda/policy'}>Go Policy Matrix</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to={device ? `/device-360/${device}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/wireless/maps?site=${site}` : '/wireless/maps'}>Back to Wireless Maps</Link>
      </div>
    </div>
  );
}
