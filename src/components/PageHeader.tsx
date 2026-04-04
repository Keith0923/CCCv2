import { ReactNode } from 'react';

export function PageHeader({ title, subtitle, controls }: { title: string; subtitle: string; controls?: ReactNode }) {
  return (
    <div className="cc-page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {controls && <div className="cc-page-controls">{controls}</div>}
    </div>
  );
}
