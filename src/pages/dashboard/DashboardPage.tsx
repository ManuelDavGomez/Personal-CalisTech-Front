import { Outlet } from "react-router-dom";
import SideNav from "../../shared/components/SideNav";

const DashboardPage = () => {
  return (
    <section className="flex min-h-screen w-full">
      <SideNav />
      <div className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-200">
        <main className="min-w-0 w-full grow p-30 md:p-10 pt-20 md:pt-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardPage;
