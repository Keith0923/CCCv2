import { ReactNode } from 'react';

export function ActionBar({ children }: { children: ReactNode }) {
  return <div className="cc-action-bar">{children}</div>;
}
