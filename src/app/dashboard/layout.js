import DashboardNavbar from "@/components/dashboard/DasboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 text-white">

      {/* Sidebar (direct use, no extra aside) */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1">

        <header className="h-14 border-b border-slate-800 bg-slate-950">
          <DashboardNavbar />
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>

      </div>
    </div>
  );
}