import { Outlet } from "react-router-dom";
import SideNav from "../../shared/components/SideNav";

const DashboardPage = () => {
  return (
    <section className="flex flex-row min-h-screen w-screen">
      <SideNav />
      <div className="px-4 py-3 text-sm text-slate-200">
        <main className="grow p-30 md:p-10 pt-20 md:pt-10 overflow-y-auto w-[70vw]">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardPage;
