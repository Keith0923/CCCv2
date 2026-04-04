import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { apiCatalogSeed } from './seed';
import { selectApiCategorySummary } from './selectors';

export function PlatformApisPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';
  const summary = selectApiCategorySummary();

  return (
    <div>
      <div className="page-header">
        <h1>API Catalog Lite</h1>
        <p>Fixed endpoint examples for integration understanding.</p>
      </div>

      <Panel title="API Category Summary">
        <ul>
          <li>discovery: {summary.discovery}</li>
          <li>inventory: {summary.inventory}</li>
          <li>topology: {summary.topology}</li>
          <li>assurance-events: {summary.assuranceEvents}</li>
        </ul>
      </Panel>

      <Panel title="Endpoint Examples">
        <DataTable
          columns={['Category', 'Method', 'Path', 'Purpose']}
          rows={apiCatalogSeed.map((api) => [api.category, api.method, api.path, api.purpose])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/platform?site=${site}&issue=${issue}` : '/platform'}>Back to Platform Home</Link>
        <Link to={site ? `/platform/events?site=${site}&issue=${issue}` : '/platform/events'}>Go Event Notifications</Link>
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/troubleshooting?site=${site}&issue=${issue}` : '/troubleshooting'}>Back to Troubleshooting</Link>
        <Link to={site ? `/activities?site=${site}&issue=${issue}` : '/activities'}>Back to Activities</Link>
      </div>
    </div>
  );
}
