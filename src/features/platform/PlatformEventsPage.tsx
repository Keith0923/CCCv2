import { Link, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { Panel } from '../../components/Panel';
import { destinationSeed, eventSeed } from './seed';
import { selectEventSummary } from './selectors';

export function PlatformEventsPage() {
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';
  const eventFocus = params.get('event') ?? '';

  const summary = selectEventSummary();
  const visibleEvents = eventFocus ? eventSeed.filter((event) => event.category === eventFocus) : eventSeed;
  const payloadPreview = visibleEvents[0]?.samplePayload ?? '{}';

  return (
    <div>
      <div className="page-header">
        <h1>Event Notifications Lite</h1>
        <p>Minimal event categories, destinations, and payload preview.</p>
      </div>

      <Panel title="Event Summary">
        <p>High: {summary.high} / Medium: {summary.medium} / Low: {summary.low}</p>
        <p>Device Issue: {summary.categories.deviceIssue} / Site Health Change: {summary.categories.siteHealthChange} / Compliance Violation: {summary.categories.complianceViolation}</p>
      </Panel>

      <Panel title="Event Categories">
        <DataTable
          columns={['Event ID', 'Category', 'Severity', 'Summary']}
          rows={visibleEvents.map((event) => [event.id, event.category, event.severity, event.summary])}
        />
      </Panel>

      <Panel title="Destinations">
        <DataTable
          columns={['Type', 'Target', 'Status']}
          rows={destinationSeed.map((destination) => [destination.type, destination.target, destination.status])}
        />
      </Panel>

      <Panel title="Payload Preview (Sample)">
        <pre>{payloadPreview}</pre>
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/platform?site=${site}&issue=${issue}` : '/platform'}>Back to Platform Home</Link>
        <Link to={site ? `/platform/apis?site=${site}&issue=${issue}` : '/platform/apis'}>Go API Catalog</Link>
        <Link to={site ? `/platform/itsm?site=${site}&issue=${issue}${eventFocus ? `&event=${eventFocus}` : ''}` : '/platform/itsm'}>Go ITSM Workflow</Link>
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
        <Link to={site ? `/troubleshooting?site=${site}&issue=${issue}` : '/troubleshooting'}>Back to Troubleshooting</Link>
        <Link to={site ? `/activities?site=${site}&issue=${issue}` : '/activities'}>Back to Activities</Link>
      </div>
    </div>
  );
}
