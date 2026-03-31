import { Link, useSearchParams } from 'react-router-dom';
import { DataTable } from '../../components/DataTable';
import { Panel } from '../../components/Panel';
import { SummaryStrip } from '../../components/SummaryStrip';
import { StatusBadge } from '../../components/StatusBadge';
import { connectorSeed } from './itsmSeed';
import { selectItsmView } from './itsmSelectors';

export function PlatformItsmPage() {
  const [params] = useSearchParams();
  const connector = params.get('connector') ?? '';
  const event = params.get('event') ?? '';
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';

  const model = selectItsmView(connector || undefined, event || undefined);

  return (
    <div>
      <div className="page-header">
        <h1>ITSM / Notification Workflow Lite</h1>
        <p>Connector → Subscription → Delivery Log for event delivery operations.</p>
      </div>

      <div className="action-bar">
        <button type="button">Validate Connector</button>
        <button type="button">Create Ticket Rule</button>
        <Link to={site ? `/platform/events?site=${site}&issue=${issue}` : '/platform/events'}>Event Bus</Link>
      </div>

      <SummaryStrip
        items={[
          { label: 'Connectors', value: model.totals.connectors },
          { label: 'Subscriptions', value: model.totals.subscriptions },
          { label: 'Active Subs', value: model.totals.activeSubscriptions },
          { label: 'Deliveries', value: model.totals.deliveries }
        ]}
      />

      <Panel title="Table Metadata">
        <p>Connector focus: {connector || 'all'} / Event focus: {event || 'all'} / Site: {site || 'all'}</p>
      </Panel>

      <Panel title="Connector List">
        <DataTable
          columns={['Name', 'Type', 'Status', 'Purpose', 'Actions']}
          rows={model.connectors.map((conn) => [
            conn.name,
            conn.type,
            <StatusBadge key={conn.id} value={conn.status} />,
            conn.purpose,
            <Link to={`/platform/itsm?connector=${conn.id}${event ? `&event=${event}` : ''}${site ? `&site=${site}` : ''}${issue ? `&issue=${issue}` : ''}`}>Filter</Link>
          ])}
        />
      </Panel>

      <Panel title="Subscription Workflow">
        <DataTable
          columns={['Event Category', 'Connector', 'Enabled']}
          rows={model.subscriptions.map((sub) => [
            sub.eventCategory,
            connectorSeed.find((conn) => conn.id === sub.connectorId)?.name ?? sub.connectorId,
            <StatusBadge key={sub.id} value={sub.enabled ? 'enabled' : 'disabled'} />
          ])}
        />
      </Panel>

      <Panel title="Delivery Log (Recent)">
        <DataTable
          columns={['Result', 'Event', 'Connector', 'Detail', 'Created']}
          rows={model.deliveries.map((log) => [
            <StatusBadge key={log.id} value={log.result} />,
            log.eventCategory,
            connectorSeed.find((conn) => conn.id === log.connectorId)?.name ?? log.connectorId,
            log.detail,
            log.createdAt
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/platform?site=${site}&issue=${issue}` : '/platform'}>Back to Platform</Link>
        <Link to={site ? `/platform/events?site=${site}&issue=${issue}${event ? `&event=${event}` : ''}` : '/platform/events'}>Back to Platform Events</Link>
        <Link to={site ? `/activities?site=${site}&issue=${issue}` : '/activities'}>Back to Activities</Link>
        <Link to={site ? `/assurance?site=${site}&issue=${issue}` : '/assurance'}>Back to Assurance</Link>
      </div>
    </div>
  );
}
