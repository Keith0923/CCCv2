import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { useAppState } from '../../app/state';
import { createCommandRun, getCommandPresets } from './helpers';
import { selectCommandRunnerTargets } from './selectors';

export function CommandRunnerPage() {
  const { data, commandRuns, addCommandRun } = useAppState();
  const [params] = useSearchParams();

  const site = params.get('site') ?? '';
  const deviceFromQuery = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const targets = useMemo(() => selectCommandRunnerTargets(data, site || undefined), [data, site]);

  const [targetDeviceId, setTargetDeviceId] = useState(deviceFromQuery || targets[0]?.device.id || '');
  const [command, setCommand] = useState(getCommandPresets()[0]);
  const [lastRunId, setLastRunId] = useState('');

  const latestRuns = commandRuns.slice(0, 5);
  const lastRun = latestRuns.find((run) => run.id === lastRunId) ?? latestRuns[0];

  return (
    <div>
      <div className="page-header">
        <h1>Command Runner</h1>
        <p>Select target → choose command → run → review result.</p>
      </div>

      <Panel title="Execution Context">
        <p>Site: {site || 'all'} / Device: {targetDeviceId || 'not selected'} / Issue: {issue || 'none'}</p>
      </Panel>

      <Panel title="Target + Command">
        <label>
          Target Device
          <select value={targetDeviceId} onChange={(e) => setTargetDeviceId(e.target.value)}>
            {targets.map(({ device }) => <option key={device.id} value={device.id}>{device.name} ({device.siteId})</option>)}
          </select>
        </label>
        <label>
          Command
          <select value={command} onChange={(e) => setCommand(e.target.value as typeof command)}>
            {getCommandPresets().map((preset) => <option key={preset} value={preset}>{preset}</option>)}
          </select>
        </label>
        <button
          onClick={() => {
            const device = data.devices.find((d) => d.id === targetDeviceId);
            if (!device) return;
            const run = createCommandRun({ command, device, issue: issue || undefined, site: site || undefined });
            addCommandRun(run);
            setLastRunId(run.id);
          }}
        >
          Run Command
        </button>
      </Panel>

      <Panel title="Run Result">
        {lastRun ? (
          <>
            <p>Run: {lastRun.id} / Device: {lastRun.targetDeviceId} / Status: <StatusBadge value={lastRun.status} /></p>
            <pre>{lastRun.output}</pre>
          </>
        ) : (
          <p>No command run yet. Execute one command to inspect output.</p>
        )}
      </Panel>

      <Panel title="Recent Command Runs">
        <DataTable
          columns={['Run ID', 'Command', 'Device', 'Site', 'Issue', 'Status', 'Created']}
          rows={latestRuns.map((run) => [
            run.id,
            run.command,
            run.targetDeviceId,
            run.targetSite ?? '-',
            run.issueContext ?? '-',
            <StatusBadge key={run.id} value={run.status} />,
            run.createdAt
          ])}
        />
        <p><Link to="/activities">Open Activities</Link></p>
      </Panel>

      <div className="quick-links">
        {targetDeviceId && <Link to={`/device-360/${targetDeviceId}`}>Back to Device 360</Link>}
        <Link to={site ? `/topology?site=${site}` : '/topology'}>Back to Topology</Link>
        <Link to={site ? `/assurance?site=${site}` : '/assurance'}>Back to Assurance</Link>
        <Link to={targetDeviceId ? `/troubleshooting?site=${site}&device=${targetDeviceId}&issue=${issue}` : '/troubleshooting'}>Back to Troubleshooting</Link>
        <Link to="/activities">Go Activities</Link>
      </div>
    </div>
  );
}
