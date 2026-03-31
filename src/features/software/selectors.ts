import { DeviceImageState, SoftwareTask } from './seed';

export function selectSoftwareTargets(states: DeviceImageState[], site?: string, device?: string) {
  return states.filter((s) => {
    if (device) return s.deviceId === device;
    return true;
  });
}

export function selectLatestSoftwareTasks(tasks: SoftwareTask[], limit = 5) {
  return [...tasks].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}
