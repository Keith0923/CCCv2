import { JobStatus } from '../../domains/types';
import { SoftwareTask } from './seed';

export function resolveSoftwareTaskStatus(action: 'deploy' | 'activate', issue?: string): JobStatus {
  if (issue === 'mgmt-ambiguity') return 'running';
  if (issue === 'unassigned') return 'queued';
  if (issue === 'mis-role') return action === 'activate' ? 'partial' : 'running';
  return 'success';
}

export function createSoftwareTask(input: {
  imageId: string;
  action: 'deploy' | 'activate';
  site?: string;
  device?: string;
  issue?: string;
}): SoftwareTask {
  return {
    id: `swt-${Date.now()}`,
    imageId: input.imageId,
    action: input.action,
    targetSite: input.site,
    targetDevice: input.device,
    issueContext: input.issue,
    status: resolveSoftwareTaskStatus(input.action, input.issue),
    createdAt: new Date().toISOString()
  };
}
