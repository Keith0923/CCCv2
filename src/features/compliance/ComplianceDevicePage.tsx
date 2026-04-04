import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Panel } from '../../components/Panel';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { selectComplianceDeviceDetail } from './selectors';

export function ComplianceDevicePage() {
  const { id } = useParams();
  const { data } = useAppState();
  const detail = id ? selectComplianceDeviceDetail(data, id) : undefined;

  if (!detail) {
    return <EmptyState title="Compliance target not found" description="Open Compliance summary and pick a valid device." />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Compliance Device Detail - {detail.device.name}</h1>
        <p>Minimal intent/policy drift view for one target device.</p>
      </div>

      <Panel title="Compliance Status">
        <p>Status: <StatusBadge value={detail.status} /></p>
        <p>Last Checked: {detail.checkedAt}</p>
      </Panel>

      <Panel title="Policy / Intent Drift">
        <p>Policy: {detail.policy}</p>
        <p>Reason Category: {detail.reasonCategory ?? 'none'}</p>
        <p>Finding: {detail.finding}</p>
      </Panel>

      <Panel title="Recommended Next View">
        <p>{detail.recommendedNextView}</p>
      </Panel>

      <div className="quick-links">
        <Link to={`/device-360/${detail.device.id}`}>Back to Device 360</Link>
        <Link to={`/topology?site=${detail.device.siteId}`}>Back to Topology</Link>
        <Link to={`/assurance?site=${detail.device.siteId}`}>Back to Assurance</Link>
        <Link to={`/compliance?site=${detail.device.siteId}`}>Back to Compliance Summary</Link>
      </div>
    </div>
  );
}
