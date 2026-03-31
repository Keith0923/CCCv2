import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Drawer } from '../components/Drawer';
import { useAppState } from './state';

const navGroups = [
  {
    title: 'Operations',
    links: [
      { to: '/', label: 'Dashboard' },
      { to: '/discovery', label: 'Discovery' },
      { to: '/inventory', label: 'Inventory' },
      { to: '/topology', label: 'Topology' },
      { to: '/assurance', label: 'Assurance' },
      { to: '/troubleshooting', label: 'Troubleshooting' }
    ]
  },
  {
    title: 'Execution',
    links: [
      { to: '/provision', label: 'Provision' },
      { to: '/software/images', label: 'Software' },
      { to: '/compliance', label: 'Compliance' },
      { to: '/activities', label: 'Activities' },
      { to: '/jobs', label: 'Jobs' }
    ]
  },
  {
    title: 'Integrations',
    links: [
      { to: '/platform', label: 'Platform' },
      { to: '/platform/itsm', label: 'ITSM' },
      { to: '/wireless/maps', label: 'Wireless' },
      { to: '/sda/fabric', label: 'SDA' },
      { to: '/settings', label: 'Settings' }
    ]
  }
];

export function AppShell() {
  const { data, selectedDeviceId, setSelectedDeviceId, toggleTheme } = useAppState();
  const selected = data.devices.find((d) => d.id === selectedDeviceId);
  const location = useLocation();

  const breadcrumbs = location.pathname.split('/').filter(Boolean);
  const currentTitle = breadcrumbs[breadcrumbs.length - 1]?.replace(/-/g, ' ') ?? 'dashboard';

  return (
    <div className="shell">
      <aside className="left-nav">
        <h2>CCC V2</h2>
        <div className="nav-subtitle">Catalyst Center Operations</div>
        {navGroups.map((group) => (
          <nav key={group.title} className="nav-group">
            <strong>{group.title}</strong>
            {group.links.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}
          </nav>
        ))}
      </aside>
      <main>
        <header className="top-bar global-header">
          <div>
            <div className="global-title">Cisco Catalyst Center (Lite)</div>
            <div className="global-caption">Enterprise Network Operations Workspace</div>
          </div>
          <div className="global-actions">
            <button onClick={toggleTheme}>Theme</button>
            <Link to="/device-360/dev-1">Quick Device 360</Link>
            <Link to="/assurance/path-trace">Path Trace</Link>
          </div>
        </header>
        <section className="page-meta-bar">
          <div className="breadcrumbs">
            <Link to="/">home</Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={`${crumb}-${idx}`}>/ {crumb}</span>
            ))}
          </div>
          <div className="page-meta-actions">
            <span className="page-focus">view: {currentTitle}</span>
            <Link to="/assurance">Assurance</Link>
            <Link to="/topology">Topology</Link>
            <Link to="/activities">Activities</Link>
          </div>
        </section>
        <section className="content"><Outlet /></section>
      </main>
      <Drawer title="Device Quick Detail" open={Boolean(selected)}>
        {selected && (
          <div className="right-pane-block">
            <p><strong>{selected.name}</strong></p>
            <p>IP: {selected.managementIp}</p>
            <p>Role: {selected.roleOverride ?? selected.roleDetected}</p>
            <p>Health: {selected.health}</p>
            <p>Site: {selected.siteId}</p>
            <div className="quick-links compact-links">
              <Link to={`/device-360/${selected.id}`}>Open Device 360</Link>
              <Link to={`/assurance/path-trace?device=${selected.id}&site=${selected.siteId}`}>Run Path Trace</Link>
            </div>
            <button onClick={() => setSelectedDeviceId(undefined)}>Close</button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
