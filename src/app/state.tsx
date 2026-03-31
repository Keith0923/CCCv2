import { createContext, useContext, useMemo, useState } from 'react';
import { seedRepository } from '../repositories/seedRepository';
import { DeviceRole, DiscoveryJob, PreferredManagementIpPolicy, ProvisionTask, SeedData } from '../domains/types';
import { DeviceImageState, SoftwareTask, initialDeviceImageStates } from '../features/software/seed';

type ThemeMode = 'light' | 'dark';
type NewDiscoveryInput = {
  name: string;
  discoveryType: DiscoveryJob['discoveryType'];
  credentialProfileId: string;
  preferredManagementIp: DiscoveryJob['preferredManagementIp'];
  status: DiscoveryJob['status'];
};

type NormalizationInput = {
  deviceId: string;
  siteId?: string;
  roleOverride?: DeviceRole;
  preferredManagementIpPolicy?: PreferredManagementIpPolicy;
};

interface AppState {
  data: SeedData;
  addDiscoveryJob: (input: NewDiscoveryInput) => DiscoveryJob;
  normalizeDevice: (input: NormalizationInput) => void;
  provisionTasks: ProvisionTask[];
  addProvisionTask: (task: ProvisionTask) => void;
  softwareTasks: SoftwareTask[];
  deviceImageStates: DeviceImageState[];
  addSoftwareTask: (task: SoftwareTask) => void;
  applySoftwareTaskResult: (task: SoftwareTask) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  selectedDeviceId?: string;
  setSelectedDeviceId: (id?: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(seedRepository.getAll());
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>();
  const [provisionTasks, setProvisionTasks] = useState<ProvisionTask[]>([]);
  const [softwareTasks, setSoftwareTasks] = useState<SoftwareTask[]>([]);
  const [deviceImageStates, setDeviceImageStates] = useState<DeviceImageState[]>(initialDeviceImageStates);

  const value = useMemo<AppState>(
    () => ({
      data,
      provisionTasks,
      softwareTasks,
      deviceImageStates,
      theme,
      selectedDeviceId,
      setSelectedDeviceId,
      toggleTheme: () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        document.documentElement.dataset.theme = theme === 'light' ? 'dark' : 'light';
      },
      addDiscoveryJob: (input) => {
        const job = seedRepository.addDiscoveryFlow(input);
        setData(seedRepository.getAll());
        return job;
      },
      normalizeDevice: ({ deviceId, siteId, roleOverride, preferredManagementIpPolicy }) => {
        seedRepository.normalizeDevice(deviceId, { siteId, roleOverride, preferredManagementIpPolicy });
        setData(seedRepository.getAll());
      },
      addProvisionTask: (task) => {
        setProvisionTasks((prev) => [task, ...prev]);
      },
      addSoftwareTask: (task) => {
        setSoftwareTasks((prev) => [task, ...prev]);
      },
      applySoftwareTaskResult: (task) => {
        setDeviceImageStates((prev) => prev.map((state) => {
          if (task.targetDevice && state.deviceId !== task.targetDevice) return state;
          const next = { ...state, targetImage: task.imageId, lastTaskStatus: task.status };
          if (task.status === 'success' && task.action === 'activate') next.currentImage = task.imageId;
          return next;
        }));
      }
    }),
    [data, theme, selectedDeviceId, provisionTasks, softwareTasks, deviceImageStates]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AppStateProvider is missing');
  return ctx;
}
