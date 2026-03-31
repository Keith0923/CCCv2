import { ProvisionTask } from '../../domains/types';
import { CommandRun } from '../commandRunner/helpers';
import { SoftwareTask } from '../software/seed';

export type ActivityRow = {
  id: string;
  type: 'command-run' | 'provision-task' | 'software-task';
  target: string;
  context: string;
  status: string;
  createdAt: string;
};

export function selectRecentActivities(input: {
  commandRuns: CommandRun[];
  provisionTasks: ProvisionTask[];
  softwareTasks: SoftwareTask[];
}): ActivityRow[] {
  const commandRows = input.commandRuns.map((run) => ({
    id: run.id,
    type: 'command-run' as const,
    target: run.targetDeviceId,
    context: `${run.command}${run.issueContext ? ` / ${run.issueContext}` : ''}`,
    status: run.status,
    createdAt: run.createdAt
  }));

  const provisionRows = input.provisionTasks.map((task) => ({
    id: task.id,
    type: 'provision-task' as const,
    target: task.targetDevice ?? task.targetSite ?? 'scope-not-set',
    context: `${task.templateId}${task.issueContext ? ` / ${task.issueContext}` : ''}`,
    status: task.status,
    createdAt: task.createdAt
  }));

  const softwareRows = input.softwareTasks.map((task) => ({
    id: task.id,
    type: 'software-task' as const,
    target: task.targetDevice ?? task.targetSite ?? 'scope-not-set',
    context: `${task.imageId} / ${task.action}`,
    status: task.status,
    createdAt: task.createdAt
  }));

  return [...commandRows, ...provisionRows, ...softwareRows]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);
}
