import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { HistoryExchange } from "../types/session";

interface MainLayoutProps {
  children: ReactNode;
  onEditExchange?: (exchange: HistoryExchange) => void;
}

export function MainLayout({ children, onEditExchange }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header onMenuToggle={handleMenuToggle} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} onEditExchange={onEditExchange} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
