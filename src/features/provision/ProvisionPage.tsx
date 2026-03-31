import { Link, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Panel } from '../../components/Panel';
import { DataTable } from '../../components/DataTable';
import { useAppState } from '../../app/state';
import { provisionTemplates } from './seed';
import { buildProvisionPreview, createProvisionTask } from './helpers';
import { selectLatestProvisionTasks } from './selectors';
import { StatusBadge } from '../../components/StatusBadge';

export function ProvisionPage() {
  const { provisionTasks, addProvisionTask } = useAppState();
  const [params] = useSearchParams();
  const site = params.get('site') ?? '';
  const device = params.get('device') ?? '';
  const issue = params.get('issue') ?? '';

  const [templateId, setTemplateId] = useState(provisionTemplates[0].id);
  const [parameters, setParameters] = useState<Record<string, string>>({});

  const selectedTemplate = provisionTemplates.find((t) => t.id === templateId);

  const previewText = useMemo(
    () => buildProvisionPreview({ template: selectedTemplate, site, device, issue, parameters }),
    [selectedTemplate, site, device, issue, parameters]
  );

  const latestTasks = selectLatestProvisionTasks(provisionTasks);

  return (
    <div>
      <div className="page-header">
        <h1>Provision</h1>
        <p>Template selection → parameter input → preview → deploy task.</p>
      </div>

      <Panel title="Deploy Context">
        <p>Site: {site || 'not specified'} / Device: {device || 'not specified'} / Issue: {issue || 'none'}</p>
      </Panel>

      <Panel title="Template Selection">
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
          {provisionTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </Panel>

      <Panel title="Template Parameters">
        {selectedTemplate?.parameterSchema.map((field) => (
          <label key={field.key} style={{ display: 'block', marginBottom: 8 }}>
            {field.label}
            <input
              value={parameters[field.key] ?? ''}
              onChange={(e) => setParameters((prev) => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.required ? 'required' : 'optional'}
            />
          </label>
        ))}
      </Panel>

      <Panel title="Preview">
        <pre>{previewText}</pre>
        <button
          onClick={() => {
            if (!selectedTemplate) return;
            addProvisionTask(
              createProvisionTask({
                templateId: selectedTemplate.id,
                site: site || undefined,
                device: device || undefined,
                issue: issue || undefined,
                parameters
              })
            );
          }}
        >
          Create Deploy Task
        </button>
      </Panel>

      <Panel title="Deploy Tasks (Latest)">
        <DataTable
          columns={['Task ID', 'Template', 'Site', 'Device', 'Issue', 'Status', 'Created']}
          rows={latestTasks.map((t) => [
            t.id,
            t.templateId,
            t.targetSite ?? '-',
            t.targetDevice ?? '-',
            t.issueContext ?? '-',
            <StatusBadge key={t.id} value={t.status} />,
            t.createdAt
          ])}
        />
      </Panel>

      <div className="quick-links">
        <Link to="/inventory">Back to Inventory</Link>
        <Link to={device ? `/device-360/${device}` : '/device-360/dev-1'}>Back to Device 360</Link>
        <Link to={site ? `/troubleshooting?site=${site}&issue=${issue}` : '/troubleshooting'}>Back to Troubleshooting</Link>
      </div>
    </div>
  );
}
