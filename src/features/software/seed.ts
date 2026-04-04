import { JobStatus } from '../../domains/types';

export interface SoftwareImage {
  id: string;
  name: string;
  version: string;
  platform: string;
}

export interface DeviceImageState {
  deviceId: string;
  currentImage: string;
  targetImage?: string;
  eligible: boolean;
  lastTaskStatus?: JobStatus;
}

export interface SoftwareTask {
  id: string;
  imageId: string;
  action: 'deploy' | 'activate';
  targetSite?: string;
  targetDevice?: string;
  issueContext?: string;
  status: JobStatus;
  createdAt: string;
}

export const softwareImages: SoftwareImage[] = [
  { id: 'img-iosxe-17.9.4', name: 'IOS-XE Stable', version: '17.9.4', platform: 'C9K' },
  { id: 'img-iosxe-17.12.1', name: 'IOS-XE Feature', version: '17.12.1', platform: 'C9K' }
];

export const initialDeviceImageStates: DeviceImageState[] = [
  { deviceId: 'dev-1', currentImage: '17.9.3', eligible: true },
  { deviceId: 'dev-2', currentImage: '17.9.4', eligible: true },
  { deviceId: 'dev-3', currentImage: '17.6.5', eligible: true },
  { deviceId: 'dev-4', currentImage: '17.9.3', eligible: true },
  { deviceId: 'dev-5', currentImage: '17.3.1', eligible: false },
  { deviceId: 'dev-6', currentImage: '17.6.4', eligible: false }
];
