import { describe, expect, it } from 'vitest';
import { SeedRepository } from './seedRepository';

describe('SeedRepository', () => {
  it('getAll returns an isolated copy', () => {
    const repo = new SeedRepository();
    const first = repo.getAll();
    const originalCount = first.devices.length;

    first.devices.pop();

    const second = repo.getAll();
    expect(second.devices.length).toBe(originalCount);
  });

  it('normalizeDevice updates topology and 360 context', () => {
    const repo = new SeedRepository();
    const before = repo.getAll();
    const device = before.devices.find((d) => d.assignmentState === 'unassigned');

    expect(device).toBeDefined();
    if (!device) return;

    repo.normalizeDevice(device.id, {
      siteId: 'site-hq-f1',
      roleOverride: 'access',
      preferredManagementIpPolicy: 'loopback'
    });

    const after = repo.getAll();
    const updated = after.devices.find((d) => d.id === device.id);
    const node = after.topologyNodes.find((n) => n.deviceId === device.id);
    const context = after.device360Contexts.find((c) => c.deviceId === device.id);

    expect(updated?.assignmentState).toBe('assigned');
    expect(updated?.health).toBe('healthy');
    expect(node?.siteId).toBe('site-hq-f1');
    expect(context?.recommendedNextAction).toBe('No action required.');
  });
});
