import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { SummaryStrip } from '../../components/SummaryStrip';
import { StatusBadge } from '../../components/StatusBadge';
import { selectWirelessSecurity } from './selectors';

export function WirelessSecurityPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const floor = params.get('floor') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const model = selectWirelessSecurity(site || undefined, floor || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>Wireless Security Lite (Rogue / aWIPS)</h1>
        <p>Minimal rogue and wireless risk summary by site/floor.</p>
      </div>

      <SummaryStrip
        items={[
          { label: 'Rogue', value: model.summary.rogue },
          { label: 'Suspicious', value: model.summary.suspicious },
          { label: 'Contained', value: model.summary.contained },
          { label: 'Monitoring', value: model.summary.monitoring }
        ]}
      />

      <Panel title="Context">
        <p>Site: {site || 'all'} / Floor: {floor || 'all'} / Issue: {issue || 'none'}</p>
      </Panel>

      <Panel title="Rogue / aWIPS Events">
        <DataTable
          columns={['Category', 'Severity', 'Site', 'Floor', 'Related AP', 'Summary']}
          rows={model.rows.map((row) => [
            row.category,
            <StatusBadge key={row.id} value={row.severity === 'high' ? 'critical' : row.severity === 'medium' ? 'warning' : 'healthy'} />,
            row.siteId,
            row.floor,
            row.relatedAp,
            row.summary
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/wireless/maps?site=${site}&floor=${floor}&issue=${issue}` : '/wireless/maps'}>Back to Wireless Maps</Link>
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to={device ? `/device-360/${device}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/sda/fabric?site=${site}&device=${device}&issue=${issue}` : '/sda/fabric'}>Go Fabric Overview</Link>
      </div>
    </div>
  );
}
