import { Outlet } from "react-router-dom";
import ModernNavbar from "./ModernNavbar";

const ModernLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ModernNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ModernLayout;
