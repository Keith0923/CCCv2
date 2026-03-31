import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { DiscoveryPage } from '../features/discovery/DiscoveryPage';
import { InventoryPage } from '../features/inventory/InventoryPage';
import { TopologyPage } from '../features/topology/TopologyPage';
import { Device360Page } from '../features/device360/Device360Page';
import { JobsPage } from '../features/jobs/JobsPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AssurancePage } from '../features/assurance/AssurancePage';
import { TroubleshootingBridgePage } from '../features/troubleshooting/TroubleshootingBridgePage';
import { ProvisionPage } from '../features/provision/ProvisionPage';
import { SoftwareImagesPage } from '../features/software/SoftwareImagesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'discovery', element: <DiscoveryPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'topology', element: <TopologyPage /> },
      { path: 'device-360/:id', element: <Device360Page /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'assurance', element: <AssurancePage /> },
      { path: 'troubleshooting', element: <TroubleshootingBridgePage /> },
      { path: 'provision', element: <ProvisionPage /> },
      { path: 'software/images', element: <SoftwareImagesPage /> },
      { path: '*', element: <DashboardPage /> }
    ]
  }
]);
