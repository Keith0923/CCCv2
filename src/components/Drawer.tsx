export function Drawer({ title, open, children }: { title: string; open: boolean; children: React.ReactNode }) {
  return (
    <aside className={`drawer ${open ? 'open' : ''}`}>
      <h3>{title}</h3>
      {children}
    </aside>
  );
}
