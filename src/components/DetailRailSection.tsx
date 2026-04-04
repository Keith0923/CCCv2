import { ReactNode } from 'react';

export function DetailRailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="cc-detail-rail-section">
      <header>{title}</header>
      <div>{children}</div>
    </section>
  );
}
