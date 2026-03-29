export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <header>{title}</header>
      <div>{children}</div>
    </section>
  );
}
