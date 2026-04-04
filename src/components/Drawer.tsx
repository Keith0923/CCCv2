export function Drawer({ title, open, children }: { title: string; open: boolean; children: React.ReactNode }) {
  return (
    <aside className={`drawer ${open ? 'open' : ''}`}>
      <h3>{title}</h3>
      {open ? children : <p>Select a device to inspect details.</p>}
    </aside>
  );
}
