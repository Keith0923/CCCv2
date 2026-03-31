import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { selectComplianceSummary } from './selectors';

export function CompliancePage() {
  const { data } = useAppState();
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';

  const summary = selectComplianceSummary(data, site || undefined);
  const nonCompliantRows = summary.rows.filter((row) => row.status === 'non-compliant');

  return (
    <div>
      <div className="page-header">
        <h1>Compliance</h1>
        <p>Summary of policy/intent drift and non-compliant targets.</p>
      </div>

      <SummaryStrip
        items={[
          { label: 'Compliant', value: summary.totals.compliant },
          { label: 'Non-compliant', value: summary.totals.nonCompliant },
          { label: 'Unknown', value: summary.totals.unknown },
          { label: 'Focused Site', value: site || 'all' }
        ]}
      />

      <Panel title="Reason Category Summary">
        <ul>
          <li>config-drift: {summary.reasonSummary['config-drift']}</li>
          <li>intent-mismatch: {summary.reasonSummary['intent-mismatch']}</li>
          <li>missing-setting: {summary.reasonSummary['missing-setting']}</li>
          <li>stale-policy: {summary.reasonSummary['stale-policy']}</li>
        </ul>
      </Panel>

      <Panel title="Non-compliant Devices">
        <DataTable
          columns={['Device', 'Site', 'Status', 'Reason', 'Policy', 'Checked', 'Actions']}
          rows={nonCompliantRows.map((row) => [
            row.deviceName,
            row.siteId,
            <StatusBadge key={`${row.deviceId}-status`} value={row.status} />,
            row.reasonCategory ?? '-',
            row.policy,
            row.checkedAt,
            <>
              <Link to={`/compliance/device/${row.deviceId}`}>Compliance Detail</Link>
              {' | '}
              <Link to={`/device-360/${row.deviceId}`}>Device 360</Link>
              {' | '}
              <Link to={`/topology?site=${row.siteId}`}>Topology</Link>
            </>
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to="/activities">Back to Activities</Link>
      </div>
    </div>
  );
}
