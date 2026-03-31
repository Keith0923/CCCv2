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
import { CommandRunnerPage } from '../features/commandRunner/CommandRunnerPage';
import { ActivitiesPage } from '../features/activities/ActivitiesPage';
import { CompliancePage } from '../features/compliance/CompliancePage';
import { ComplianceDevicePage } from '../features/compliance/ComplianceDevicePage';
import { PlatformHomePage } from '../features/platform/PlatformHomePage';
import { PlatformApisPage } from '../features/platform/PlatformApisPage';
import { PlatformEventsPage } from '../features/platform/PlatformEventsPage';
import { PlatformItsmPage } from '../features/platform/PlatformItsmPage';
import { WirelessMapsPage } from '../features/wireless/WirelessMapsPage';
import { WirelessSecurityPage } from '../features/wireless/WirelessSecurityPage';
import { SdaFabricPage } from '../features/sda/SdaFabricPage';
import { SdaPolicyPage } from '../features/sda/SdaPolicyPage';
import { AdvancedAssurancePage } from '../features/assurance/AdvancedAssurancePage';
import { AssuranceClientsPage } from '../features/assurance/AssuranceClientsPage';
import { Client360Page } from '../features/assurance/Client360Page';
import { AssuranceIssuesPage } from '../features/assurance/AssuranceIssuesPage';

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
      { path: 'command-runner', element: <CommandRunnerPage /> },
      { path: 'activities', element: <ActivitiesPage /> },
      { path: 'compliance', element: <CompliancePage /> },
      { path: 'compliance/device/:id', element: <ComplianceDevicePage /> },
      { path: 'platform', element: <PlatformHomePage /> },
      { path: 'platform/apis', element: <PlatformApisPage /> },
      { path: 'platform/events', element: <PlatformEventsPage /> },
      { path: 'platform/itsm', element: <PlatformItsmPage /> },
      { path: 'wireless/maps', element: <WirelessMapsPage /> },
      { path: 'wireless/security', element: <WirelessSecurityPage /> },
      { path: 'sda/fabric', element: <SdaFabricPage /> },
      { path: 'sda/policy', element: <SdaPolicyPage /> },
      { path: 'assurance/advanced', element: <AdvancedAssurancePage /> },
      { path: 'assurance/clients', element: <AssuranceClientsPage /> },
      { path: 'client-360/:id', element: <Client360Page /> },
      { path: 'assurance/issues', element: <AssuranceIssuesPage /> },
      { path: '*', element: <DashboardPage /> }
    ]
  }
]);
