import { ProvisionTask } from '../../domains/types';

export function selectLatestProvisionTasks(tasks: ProvisionTask[], limit = 5) {
  return [...tasks].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}
