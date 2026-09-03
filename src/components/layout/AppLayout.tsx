import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopTabBar } from "./TopTabBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex bg-surface-light dark:bg-surface-dark">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopTabBar />
        {children}
      </div>
    </div>
  );
}