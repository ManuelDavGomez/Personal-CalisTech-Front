// import { clearAuthToken } from "../../shared/utils/auth";
import { useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../../shared/utils/auth";
import { useState } from "react";

const SideNav = () => {
  const authUser = getAuthUser();
  const roleLabel = authUser?.role === "admin" ? "Administrador" : "Usuario";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const [isOpen, setIsOpen] = useState(false);

  // Navigation items array
  const menuItems = [
    {
      name: "Panel",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-[#c5c9ac] group-hover:stroke-black! "
          stroke-width="2"
          stroke-linecap="butt"
          stroke-linejoin="arcs"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      url: "dashboard",
    },
    {
      name: "Libreria",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke-width="2"
          stroke-linecap="butt"
          stroke-linejoin="arcs"
          className="stroke-[#c5c9ac] group-hover:stroke-black! "
        >
          <path d="M12 20v-6m0-6V4"></path>
          <rect x="3" y="10" width="18" height="4"></rect>
        </svg>
      ),
      url: "dashboard/skills",
    },
    {
      name: "Rutina IA",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-[#c5c9ac] group-hover:stroke-black!"
          stroke-width="2"
          stroke-linecap="butt"
          stroke-linejoin="arcs"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      ),
    },
    {
      name: "Registrar",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="stroke-[#c5c9ac] group-hover:stroke-black! "
          stroke-width="2"
          stroke-linecap="butt"
          stroke-linejoin="arcs"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .38 3.83 8.5 8.5 0 0 1-7.63.83h-.79a8.56,8.56,0,0,1-7.63-.83,1.65,1.65,0,0,0,.38-3.83Z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen ">
      {/* 1. Mobile Top Bar / Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm md:hidden fixed top-0 left-0 right-0 z-40">
        <span className="text-xl font-bold tracking-wider text-indigo-600">
          Brand
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Menu"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* 2. Dark Overlay Background for Mobile View */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. Sidebar Container */}
      <aside
        className={`
        sticky! inset-y-0 left-0 z-50 flex flex-col w-72 bg-(--tertiary-color) transition-transform duration-300 ease-in-out transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-auto
      `}
      >
        {/* Sidebar Header */}
        <article className="flex items-center justify-between px-6 py-8 ">
          <section className="flex flex-col">
            <span className="text-xl font-black text-(--primary-color)">
              Calisprogress
            </span>
            <p className="text-sm text-(--subtext-color)">ELITE CALISTHENICS</p>
          </section>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-(--primary-color) md:hidden"
            aria-label="Close Menu"
          >
            <span className="text-xl">✕</span>
          </button>
        </article>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={`/${item.url?.toLowerCase()}`}
              className="flex items-center px-4 py-3 text-(--text-color) rounded-lg hover:bg-(--primary-color)  hover:text-black transition-colors group font-medium "
            >
              <span className="text-xl mr-4 ">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>

        {/* Sidebar Footer / User Section */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-bold">{authUser?.username}</p>
              <p className="text-xs text-gray-400">{authUser?.email}</p>
              <p className="text-xs text-gray-400">{roleLabel}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-500"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 4. Main App Layout Window */}
      {/* <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Bienvenido Comandante
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl">Resumen del Rendimiento</p>

        <div className="grid grid-cols-5 grid-rows-5 gap-4 h-150 mt-20">
          <div className="col-span-2 row-span-2  border border-gray-300">1</div>
          <div className="col-span-3 row-span-2 col-start-3 border border-gray-300">
            2
          </div>
          <div className="col-span-3 row-span-3 row-start-3 border border-gray-300">
            3
          </div>
          <div className="col-span-2 row-span-2 col-start-4 row-start-3 border border-gray-300">
            4
          </div>
          <div className="col-span-2 col-start-4 row-start-5 border border-gray-300">
            5
          </div>
        </div>
      </main> */}
    </div>

    // <article className="flex w-[15%] h-screen items-start flex-col border border-amber-200">
    //   <section className="flex flex-col items-start justify-center  px-4 py-6">
    //     <h1 className="text-xl font-bold text-(--text-color)">
    //       CALIPROGRESS
    //     </h1>
    //     <p className="text-lg">Calistenia de elite</p>
    //   </section>

    //   <p className="text-(--subtext-color)">
    //     Bienvenido al panel de control. Aquí puedes gestionar tu cuenta y
    //   </p>
    //   <button
    //     type="button"
    //     onClick={handleLogout}
    //     className="rounded-md bg-(--primary-color) px-4 py-2 font-semibold text-slate-950"
    //   >
    //     Cerrar sesión
    //   </button>
    // </article>
  );
};

export default SideNav;
