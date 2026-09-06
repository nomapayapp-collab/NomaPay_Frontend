import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopTabBar } from "./TopTabBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface-light dark:bg-surface-dark">
      <Sidebar />
      <TopTabBar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}