import { Link, NavLink, Outlet } from 'react-router-dom';
import { Drawer } from '../components/Drawer';
import { useAppState } from './state';

export function AppShell() {
  const { data, selectedDeviceId, setSelectedDeviceId, toggleTheme } = useAppState();
  const selected = data.devices.find((d) => d.id === selectedDeviceId);

  return (
    <div className="shell">
      <aside className="left-nav">
        <h2>CCC V2</h2>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/discovery">Discovery</NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
          <NavLink to="/topology">Topology</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </aside>
      <main>
        <header className="top-bar">
          <div>Product Flow: Discovery → Inventory → Topology → Device 360</div>
          <div>
            <button onClick={toggleTheme}>Theme</button>
            <Link to="/device-360/dev-1">Quick 360</Link>
          </div>
        </header>
        <section className="content"><Outlet /></section>
      </main>
      <Drawer title="Device Quick Detail" open={Boolean(selected)}>
        {selected && (
          <div>
            <p>{selected.name}</p>
            <p>{selected.managementIp}</p>
            <p>{selected.roleOverride ?? selected.roleDetected}</p>
            <button onClick={() => setSelectedDeviceId(undefined)}>Close</button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
