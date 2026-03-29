import { phase1Seed } from '../data/seed/phase1Seed';
import { Device, DiscoveryJob, SeedData } from '../domains/types';

export class SeedRepository {
  private data: SeedData = structuredClone(phase1Seed);

  getAll(): SeedData {
    return this.data;
  }

  addDiscoveryJob(job: DiscoveryJob) {
    this.data.discoveryJobs = [job, ...this.data.discoveryJobs];
  }

  getDevicesByJob(jobId: string): Device[] {
    return this.data.devices.filter((d) => d.sourceDiscoveryJobId === jobId);
  }
}

export const seedRepository = new SeedRepository();
