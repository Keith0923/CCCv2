import { ReactNode } from 'react';

export function TableSection({ title, metadata, children }: { title: string; metadata?: ReactNode; children: ReactNode }) {
  return (
    <section className="cc-table-section">
      <header>
        <strong>{title}</strong>
        {metadata && <span>{metadata}</span>}
      </header>
      <div>{children}</div>
    </section>
  );
}
