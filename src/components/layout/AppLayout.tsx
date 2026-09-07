import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopTabBar } from "./TopTabBar";

export function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark-base">
      <Sidebar />

      <TopTabBar />

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}