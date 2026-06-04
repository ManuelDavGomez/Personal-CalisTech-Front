import "../../app/styles/App.css";
import Login_img from "../../shared/assets/login_hero.jpg";

const LoginPage = () => {
  return (
    <main className="relative min-h-screen">
      <section className="w-full mx-auto flex min-h-screen max-w-full flex-col items-stretch lg:flex-row lg:items-">
        <section className="relative flex-1 h-full min-h-screen overflow-hidden flex items-center justify-center">
          <img
            src={Login_img}
            alt="Login Hero"
            className="absolute inset-0 h-full w-full object-cover opacity-35 mask-[linear-gradient(to_bottom,black_80%,transparent_100%)] md:mask-[linear-gradient(to_right,black_80%,transparent_100%)]"
          />
          <div className="relative z-10 flex h-full flex-col justify-center gap-8 px-6 py-12 sm:px-10 lg:px-14">
            <section className="mx-auto max-w-lg lg:max-w-xl">
              <p className="mb-4 inline-flex rounded-full py-2 text-sm uppercase tracking-[0.25em] text-(--primary-color)">
                CalisTech
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-(--primary-color) sm:text-5xl">
                DOMINA TU GRAVEDAD
              </h1>
              <p className="mt-5 text-base leading-7 text-(--subtext-color) sm:text-base">
                CalisTech es una plataforma de entrenamiento de calistenia
                diseñada para ayudarte a mejorar fuerza
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-3xl font-semibold text-(--primary-color)">
                  450+
                </p>
                <p className="mt-2 text-sm text-(--subtext-color)">
                  Ejercicios
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-(--primary-color)">
                  AI Asistente
                </p>
                <p className="mt-2 text-sm text-(--subtext-color)">
                  Entrenamientos
                </p>
              </div>
            </div>

            <footer className="mt-auto text-sm text-(--subtext-color)">
              copyright © 2026 CalisTech. Todos los derechos reservados.
            </footer>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-4">
          <div className="w-full max-w-md  p-8  backdrop-blur-xl sm:p-10">
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
      </section>
    </main>
  );
};

export default LoginPage;
