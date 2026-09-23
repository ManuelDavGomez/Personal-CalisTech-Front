// import { clearAuthToken } from "../../shared/utils/auth";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SideNav = () => {
  //   const handleLogout = () => {
  //     clearAuthToken();
  //     navigate("/login", { replace: true });
  //   };

  //   const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  // Navigation items array
  const menuItems = [
    {
      name: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c5c9ac"
          stroke-width="2"
          stroke-linecap="butt"
          stroke-linejoin="arcs"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
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
          stroke="#c5c9ac"
          stroke-width="2"
          stroke-linecap="butt"
          stroke-linejoin="arcs"
        >
          <path d="M12 20v-6m0-6V4"></path>
          <rect x="3" y="10" width="18" height="4"></rect>
        </svg>
      ),
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
          stroke="#c5c9ac"
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
          stroke="#c5c9ac"
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
    <article className="flex min-h-screen">
      {/* 1. Mobile Top Bar / Header */}
      <section className="flex items-center justify-between px-4 py-3 shadow-sm md:hidden fixed top-0 left-0 right-0 z-40">
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
      </section>

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
        fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-(--tertiary-color) transition-transform duration-300 ease-in-out transform
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
              href={`#${item.name.toLowerCase()}`}
              className="flex items-center px-4 py-3 text-(--text-color) rounded-lg hover:bg-(--primary-color)  hover:text-black transition-colors group font-medium"
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
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-xs text-gray-400">john@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 4. Main App Layout Window */}
      <main className="flex-1 overflow-y-auto">
        <article className="flex flex-col md:flex-row items-center bg-(--secondary-color) p-8">
          <article className="w-full">
            <section className="flex items-center gap-2 flex-row pb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4ff00"
                stroke-width="2"
                stroke-linecap="butt"
                stroke-linejoin="arcs"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
              <p className="text-(--primary-color) text-sm">
                GESTION ADMINISTRATIVA
              </p>
            </section>
            <h1 className="text-4xl font-extrabold tracking-tight text-(--primary-color)">
              BIBLIOTECA DE DATOS
            </h1>
          </article>
          <article className="w-full flex gap-5">
            <button className="p-3 px-10 bg-(--primary-color) rounded-md">
              <p className="text-black">EJERCICIO</p>
            </button>

            <button className="p-3 px-10 rounded-md bg-(--primary-color)">
              <p className="text-black">AGREGAR NUEVOS EJERCICIOS</p>
            </button>
          </article>
        </article>
      </main>
    </article>

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
