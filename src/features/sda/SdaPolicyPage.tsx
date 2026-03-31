import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { selectPolicyMatrix } from './selectors';

export function SdaPolicyPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const group = params.get('group') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const model = selectPolicyMatrix(group || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>SD-Access Policy Matrix Lite</h1>
        <p>Endpoint/scalable group relation with allow/deny/unknown contracts.</p>
      </div>

      <Panel title="Policy Groups">
        <DataTable
          columns={['Group ID', 'Name', 'Type', 'Action']}
          rows={model.groups.map((row) => [
            row.id,
            row.name,
            row.type,
            <Link to={`/sda/policy?group=${row.id}${site ? `&site=${site}` : ''}`}>Focus</Link>
          ])}
        />
      </Panel>

      <Panel title="Contract Matrix">
        <DataTable
          columns={['From Group', 'To Group', 'Relation']}
          rows={model.contracts.map((row) => [
            row.fromGroup,
            row.toGroup,
            <StatusBadge key={`${row.fromGroup}-${row.toGroup}`} value={row.relation === 'allow' ? 'healthy' : row.relation === 'deny' ? 'critical' : 'warning'} />
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/sda/fabric?site=${site}&device=${device}&issue=${issue}` : '/sda/fabric'}>Back to Fabric Overview</Link>
        <Link to={site ? `/assurance/advanced?site=${site}&group=${group}&issue=${issue}` : '/assurance/advanced'}>Go Advanced Assurance</Link>
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
      </div>
    </div>
  );
}
