import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { selectApiCategorySummary, selectEventSummary } from './selectors';

export function PlatformHomePage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';

  const apiSummary = selectApiCategorySummary();
  const eventSummary = selectEventSummary();

  return (
    <div>
      <div className="page-header">
        <h1>Platform</h1>
        <p>Entry point for API and event-based external integration views.</p>
      </div>

      <SummaryStrip
        items={[
          { label: 'API Categories', value: 4 },
          { label: 'Event Categories', value: 3 },
          { label: 'Destinations', value: eventSummary.destinations },
          { label: 'Focused Site', value: site || 'all' }
        ]}
      />

      <Panel title="Platform Overview">
        <p>This page is about integration surfaces (API + notifications), not operations execution.</p>
        <p>Issue context: {issue || 'none'}</p>
      </Panel>

      <Panel title="API Catalog Lite Entry">
        <p>Discovery: {apiSummary.discovery} / Inventory: {apiSummary.inventory} / Topology: {apiSummary.topology} / Assurance+Events: {apiSummary.assuranceEvents}</p>
        <p><Link to={site ? `/platform/apis?site=${site}&issue=${issue}` : '/platform/apis'}>Open API Catalog Lite</Link></p>
      </Panel>

      <Panel title="Event Notifications Lite Entry">
        <p>High: {eventSummary.high} / Medium: {eventSummary.medium} / Low: {eventSummary.low}</p>
        <p><Link to={site ? `/platform/events?site=${site}&issue=${issue}` : '/platform/events'}>Open Event Notifications Lite</Link></p>
      </Panel>

      <Panel title="ITSM Workflow Lite Entry">
        <p>Connector and subscription routing overview for event deliveries.</p>
        <p><Link to={site ? `/platform/itsm?site=${site}&issue=${issue}` : '/platform/itsm'}>Open ITSM Workflow Lite</Link></p>
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/troubleshooting?site=${site}&issue=${issue}` : '/troubleshooting'}>Back to Troubleshooting</Link>
        <Link to={site ? `/activities?site=${site}&issue=${issue}` : '/activities'}>Back to Activities</Link>
      </div>
    </div>
  );
}
