import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Panel } from '../../components/Panel';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { softwareImages } from './seed';
import { createSoftwareTask } from './helpers';
import { selectLatestSoftwareTasks, selectSoftwareTargets } from './selectors';

export function SoftwareImagesPage() {
  const { data, softwareTasks, addSoftwareTask, deviceImageStates, applySoftwareTaskResult } = useAppState();
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const [imageId, setImageId] = useState(softwareImages[0].id);
  const [action, setAction] = useState<'deploy' | 'activate'>('deploy');
  const [targetDeviceId, setTargetDeviceId] = useState(device || data.devices[0]?.id || '');

  const targets = useMemo(() => selectSoftwareTargets(deviceImageStates, site || undefined, device || undefined), [deviceImageStates, site, device]);
  const latestTasks = selectLatestSoftwareTasks(softwareTasks);

  return (
    <div>
      <div className="page-header">
        <h1>Software Image Management</h1>
        <p>Repository → target selection → deploy/activate task → result.</p>
      </div>

      <div className="action-bar">
        <button type="button">Pre-check</button>
        <button type="button">Approve Window</button>
        <Link to={site ? `/assurance?site=${site}` : '/assurance'}>Assurance</Link>
      </div>

      <Panel title="Context">
        <p>Site: {site || 'not specified'} / Device: {device || 'not specified'} / Issue: {issue || 'none'}</p>
      </Panel>

      <Panel title="Table Metadata">
        <p>Repo images: {softwareImages.length} / Visible targets: {targets.length} / Focus site: {site || 'all'}</p>
      </Panel>

      <Panel title="Image Repository">
        <DataTable columns={['Image', 'Version', 'Platform']} rows={softwareImages.map((i) => [i.name, i.version, i.platform])} />
      </Panel>

      <Panel title="Target Selection + Task Create">
        <label>
          Image
          <select value={imageId} onChange={(e) => setImageId(e.target.value)}>
            {softwareImages.map((i) => <option key={i.id} value={i.id}>{i.name} ({i.version})</option>)}
          </select>
        </label>
        <label>
          Action
          <select value={action} onChange={(e) => setAction(e.target.value as 'deploy' | 'activate')}>
            <option value="deploy">Deploy</option>
            <option value="activate">Activate</option>
          </select>
        </label>
        <label>
          Target Device
          <select value={targetDeviceId} onChange={(e) => setTargetDeviceId(e.target.value)}>
            {targets.map((t) => <option key={t.deviceId} value={t.deviceId}>{t.deviceId}</option>)}
          </select>
        </label>
        <button
          onClick={() => {
            const task = createSoftwareTask({ imageId, action, site: site || undefined, device: targetDeviceId || undefined, issue: issue || undefined });
            addSoftwareTask(task);
            applySoftwareTaskResult(task);
          }}
        >
          Create Software Task
        </button>
      </Panel>

      <Panel title="Device Image Status">
        <DataTable
          columns={['Device', 'Current', 'Target', 'Eligible', 'Last Task']}
          rows={targets.map((t) => [
            t.deviceId,
            t.currentImage,
            t.targetImage ?? '-',
            <StatusBadge key={`${t.deviceId}-eligible`} value={t.eligible ? 'eligible' : 'ineligible'} />,
            <StatusBadge key={`${t.deviceId}-task`} value={t.lastTaskStatus ?? 'none'} />
          ])}
        />
      </Panel>

      <Panel title="Software Tasks (Latest)">
        <DataTable
          columns={['Task', 'Image', 'Action', 'Site', 'Device', 'Status', 'Created']}
          rows={latestTasks.map((t) => [
            t.id,
            t.imageId,
            t.action,
            t.targetSite ?? '-',
            t.targetDevice ?? '-',
            <StatusBadge key={t.id} value={t.status} />,
            t.createdAt
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to="/inventory">Back to Inventory</Link>
        <Link to={targetDeviceId ? `/device-360/${targetDeviceId}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/assurance?site=${site}` : '/assurance'}>Back to Assurance</Link>
      </div>
    </div>
  );
}
