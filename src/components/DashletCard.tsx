import { ReactNode } from 'react';

export function DashletCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cc-dashlet">
      <header>{title}</header>
      <div>{children}</div>
    </section>
  );
}
