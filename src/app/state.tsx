import { createContext, useContext, useMemo, useState } from 'react';
import { seedRepository } from '../repositories/seedRepository';
import { DeviceRole, DiscoveryJob, PreferredManagementIpPolicy, SeedData } from '../domains/types';

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

  const value = useMemo<AppState>(
    () => ({
      data,
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
      }
    }),
    [data, theme, selectedDeviceId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('AppStateProvider is missing');
  return ctx;
}
