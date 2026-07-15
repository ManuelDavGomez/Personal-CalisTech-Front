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
    { name: 'Dashboard', icon: '📊' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Projects', icon: '📁' }, 
    { name: 'Settings', icon: '⚙️' },
  ];


  return (

   <div className="flex min-h-screen">
      {/* 1. Mobile Top Bar / Header */}
      <div className="flex items-center justify-between px-4 py-3 shadow-sm md:hidden fixed top-0 left-0 right-0 z-40">
        <span className="text-xl font-bold tracking-wider text-indigo-600">Brand</span>
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
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-72 border-r border-gray-200 transition-transform duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="text-2xl font-black text-indigo-600">Calisprogress</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Close Menu"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.name.toLowerCase()}`}
              className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group font-medium"
            >
              <span className="text-xl mr-3 text-gray-400 group-hover:text-indigo-500">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>

        {/* Sidebar Footer / User Section */}
        <div className="p-4 border-t border-gray-100">
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
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        <h1 className="text-3xl font-extrabold tracking-tight">hola</h1>
        <p className="mt-4 text-gray-500 max-w-2xl">
          xdd
        </p>
      </main>
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
