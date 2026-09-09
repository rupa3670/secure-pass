// src/app/dashboard/layout.js
import DashboardNavbar from "@/components/dashboard/DasboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { VaultKeyProvider } from "@/hooks/useVaultKey";

export default function DashboardLayout({ children }) {
  return (
    <VaultKeyProvider>
      <div className="flex h-screen bg-slate-950 text-white">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <header className="h-14 border-b border-slate-800 bg-slate-950">
            <DashboardNavbar />
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </VaultKeyProvider>
  );
}