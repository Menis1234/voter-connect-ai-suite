import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar"; // Points to src/components/Sidebar.tsx
import Footer from "../Footer"; // Points to src/components/Footer.tsx

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}