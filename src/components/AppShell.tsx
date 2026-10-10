import type { ReactNode } from 'react';
import { Header } from './Header';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Header />
      <div className="layout">
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
