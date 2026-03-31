import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { selectClient360 } from './clientSelectors';

export function Client360Page() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const issue = params.get('issue') ?? '';
  const { data } = useAppState();

  const model = id ? selectClient360(id, data) : undefined;

  if (!model) return <EmptyState title="Client not found" description="Select client from Assurance Client Health list." />;

  return (
    <div>
      <div className="page-header">
        <h1>Client 360 - {model.client.name}</h1>
        <p>Client-centric relation view for site, AP, device, and issues.</p>
      </div>

      <Panel title="Client State">
        <p>Health: <StatusBadge value={model.client.health} /></p>
        <p>Onboarding: {model.client.onboarding}</p>
        <p>Connectivity: {model.client.connectivity}</p>
      </Panel>

      <Panel title="Association">
        <p>Site: {model.client.siteId} / Floor: {model.client.floor}</p>
        <p>AP: {model.client.apName}</p>
        <p>Related device: {model.relatedDevice?.name ?? model.client.relatedDeviceId}</p>
      </Panel>

      <Panel title="Related Issues / Events">
        <ul>
          {model.relatedIssues.map((row) => <li key={row.id}>{row.title} ({row.status})</li>)}
        </ul>
      </Panel>

      <div className="quick-links">
        <Link to={site ? `/assurance/clients?site=${site}&issue=${issue}` : '/assurance/clients'}>Back to Client Health</Link>
        <Link to={`/device-360/${model.client.relatedDeviceId}`}>Back to Device 360</Link>
        <Link to={site ? `/assurance/issues?site=${site}` : '/assurance/issues'}>Back to Issues/Events</Link>
        <Link to={site ? `/troubleshooting?site=${site}&issue=${issue}` : '/troubleshooting'}>Go Troubleshooting</Link>
      </div>
    </div>
  );
}
