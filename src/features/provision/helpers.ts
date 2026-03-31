import { JobStatus, ProvisionTask, ProvisionTemplate } from '../../domains/types';

export function buildProvisionPreview(input: {
  template?: ProvisionTemplate;
  site?: string;
  device?: string;
  issue?: string;
  parameters: Record<string, string>;
}) {
  if (!input.template) return 'Select template to generate preview.';
  return [
    `Template: ${input.template.name}`,
    `Target site: ${input.site ?? 'not specified'}`,
    `Target device: ${input.device ?? 'not specified'}`,
    `Issue context: ${input.issue ?? 'none'}`,
    `Parameters: ${Object.entries(input.parameters).map(([k, v]) => `${k}=${v || '-'}`).join(', ')}`
  ].join('\n');
}

export function resolveProvisionStatus(issue?: string): JobStatus {
  if (issue === 'mis-role') return 'partial';
  if (issue === 'mgmt-ambiguity') return 'running';
  if (issue === 'unassigned') return 'queued';
  return 'success';
}

export function createProvisionTask(input: {
  templateId: string;
  site?: string;
  device?: string;
  issue?: string;
  parameters: Record<string, string>;
}): ProvisionTask {
  return {
    id: `pt-${Date.now()}`,
    templateId: input.templateId,
    targetSite: input.site,
    targetDevice: input.device,
    issueContext: input.issue,
    parameters: input.parameters,
    status: resolveProvisionStatus(input.issue),
    createdAt: new Date().toISOString()
  };
}
