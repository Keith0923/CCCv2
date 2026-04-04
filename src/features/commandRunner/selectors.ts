import { SeedData } from '../../domains/types';

export function selectCommandRunnerTargets(data: SeedData, site?: string) {
  const scoped = site ? data.devices.filter((d) => d.siteId === site) : data.devices;
  return scoped.map((device) => ({
    device,
    issues: data.issues.filter((i) => i.deviceId === device.id || (!i.deviceId && i.siteId === device.siteId))
  }));
}
