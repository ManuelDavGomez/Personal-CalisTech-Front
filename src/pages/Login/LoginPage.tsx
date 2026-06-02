import "../../app/styles/App.css";

const LoginPage = () => {
  return (
    <main className="relative min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center lg:flex-row">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 rounded-full lg:block" />
        <section className="relative flex-1 px-6 py-12 sm:px-10 lg:px-14 lg:py-20">
          <div className="absolute inset-0" />
          <div className="relative z-10 flex h-full flex-col justify-center gap-8">
            <section className="mx-auto max-w-lg lg:max-w-xl">
              <p className="mb-4 inline-flex rounded-full py-2 text-sm uppercase tracking-[0.25em] text-(--primary-color)">
                CalisTech
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-(--primary-color) sm:text-4xl">
                Domina tu gravedad
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-300 sm:text-base">
                CalisTech es una plataforma de entrenamiento de calistenia
                diseñada para ayudarte a mejorar fuerza, movilidad y resistencia
                con una experiencia visual limpia y responsiva.
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                <p className="text-3xl font-semibold text-(--text-color)">
                  450+
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Ejercicios disponibles
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20">
                <p className="text-3xl font-semibold text-(--text-color)">
                  AI Asistente
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Entrenamientos personalizados en tiempo real
                </p>
              </div>
            </div>

            <footer className="mt-auto text-sm text-slate-500">
              copyright © 2026 CalisTech. Todos los derechos reservados.
            </footer>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-transparent px-6 py-12 sm:px-10 lg:px-14 lg:py-20">
          <div className="w-full max-w-md rounded-4xl border border-(--primary-color)/20 bg-(--secondary-color)/95 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10">
            <div className="mb-8 space-y-3 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-(--primary-color)">
                Inicio de sesión
              </p>
              <h2 className="text-3xl font-semibold text-(--text-color)">
                Bienvenido de nuevo
              </h2>
              <p className="text-slate-300">
                Ingresa tus datos para continuar hacia tu área de entrenamiento.
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-3 block text-sm font-medium text-slate-300"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-3xl border border-slate-700 bg-(--tertiary-color)/95 px-5 py-4 text-(--text-color) shadow-sm outline-none transition focus:border-(--primary-color) focus:ring-4 focus:ring-(--primary-color)/15"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-3 block text-sm font-medium text-slate-300"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-3xl border border-slate-700 bg-(--tertiary-color)/95 px-5 py-4 text-(--text-color) shadow-sm outline-none transition focus:border-(--primary-color) focus:ring-4 focus:ring-(--primary-color)/15"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-(--primary-color) px-5 py-4 text-base font-semibold text-slate-950 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-(--primary-color)/25"
              >
                Iniciar sesión
              </button>

              <div className="rounded-3xl border border-(--primary-color)/20 bg-(--secondary-color)/80 px-5 py-4 text-sm text-slate-300">
                <p className="leading-6">
                  ¿Eres nuevo?{" "}
                  <a
                    href="/register"
                    className="font-semibold text-(--primary-color) hover:text-white"
                  >
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
