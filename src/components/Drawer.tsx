export function Drawer({ title, open, className, children }: { title: string; open: boolean; className?: string; children: React.ReactNode }) {
  return (
    <aside className={`drawer ${open ? 'open' : ''} ${className ?? ''}`}>
      <h3>{title}</h3>
      {children}
    </aside>
  );
}
