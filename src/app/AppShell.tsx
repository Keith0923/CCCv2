import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Drawer } from '../components/Drawer';
import { useAppState } from './state';

const navGroups = [
  {
    title: 'Operate',
    links: [
      { to: '/', label: 'Overview', icon: '◻' },
      { to: '/discovery', label: 'Discovery', icon: '◎' },
      { to: '/inventory', label: 'Inventory', icon: '▤' },
      { to: '/topology', label: 'Topology', icon: '◉' },
      { to: '/assurance', label: 'Assurance', icon: '▲' },
      { to: '/troubleshooting', label: 'Troubleshooting', icon: '✦' }
    ]
  },
  {
    title: 'Deliver',
    links: [
      { to: '/provision', label: 'Provision', icon: '↺' },
      { to: '/software/images', label: 'Software', icon: '⬒' },
      { to: '/compliance', label: 'Compliance', icon: '✓' },
      { to: '/activities', label: 'Activities', icon: '☰' },
      { to: '/jobs', label: 'Jobs', icon: '⌛' }
    ]
  },
  {
    title: 'Integrate',
    links: [
      { to: '/platform', label: 'Platform', icon: '⇄' },
      { to: '/platform/itsm', label: 'ITSM', icon: '⛓' },
      { to: '/wireless/maps', label: 'Wireless', icon: '◌' },
      { to: '/sda/fabric', label: 'SDA', icon: '▦' },
      { to: '/settings', label: 'Settings', icon: '⚙' }
    ]
  }
];

export function AppShell() {
  const { data, selectedDeviceId, setSelectedDeviceId, toggleTheme } = useAppState();
  const selected = data.devices.find((d) => d.id === selectedDeviceId);
  const location = useLocation();
  const breadcrumbs = location.pathname.split('/').filter(Boolean);

  return (
    <div className="shell">
      <aside className="left-nav app-nav-dark">
        <h2>Catalyst Center</h2>
        <div className="nav-subtitle">Enterprise Network Operations</div>
        {navGroups.map((group) => (
          <nav key={group.title} className="nav-group">
            <strong>{group.title}</strong>
            {group.links.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav-link-row">
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        ))}
      </aside>

      <main>
        <header className="top-bar global-header global-header-dark">
          <div className="global-title-wrap">
            <div className="global-title">Cisco Catalyst Center</div>
            <div className="global-caption">Design · Provision · Assurance · Operate</div>
          </div>
          <div className="global-search-wrap">
            <input className="global-search" placeholder="Search devices, clients, sites, issues" />
          </div>
          <div className="global-actions">
            <button onClick={toggleTheme}>Theme</button>
            <button type="button">🔔</button>
            <button type="button">?</button>
            <button type="button">Ops User</button>
          </div>
        </header>

        <section className="page-meta-bar">
          <div className="breadcrumbs">
            <Link to="/">home</Link>
            {breadcrumbs.map((crumb, idx) => <span key={`${crumb}-${idx}`}>/ {crumb}</span>)}
          </div>
          <div className="page-meta-actions">
            <Link to="/assurance">Assurance</Link>
            <Link to="/topology">Topology</Link>
            <Link to="/assurance/path-trace">Path Trace</Link>
          </div>
        </section>

        <section className="content"><Outlet /></section>
      </main>

      <Drawer title="Details Rail" open={Boolean(selected)}>
        {selected && (
          <div className="right-pane-block">
            <p><strong>{selected.name}</strong></p>
            <p>IP: {selected.managementIp}</p>
            <p>Role: {selected.roleOverride ?? selected.roleDetected}</p>
            <p>Health: {selected.health}</p>
            <p>Site: {selected.siteId}</p>
            <div className="quick-links compact-links">
              <Link to={`/device-360/${selected.id}`}>Device 360</Link>
              <Link to={`/assurance/path-trace?device=${selected.id}&site=${selected.siteId}`}>Path Trace</Link>
            </div>
            <button onClick={() => setSelectedDeviceId(undefined)}>Close</button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
