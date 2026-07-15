import "../../app/styles/App.css";
import Login_img from "../../shared/assets/login_hero.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, saveAuthToken } from "../../shared/utils/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      saveAuthToken(data.token);
      navigate("/dashboard", { replace: true });
      console.log("Token stored in localStorage:", data.token);
    } else {
      console.error("Login failed:", response.statusText);
      navigate("/login");
    }
  };

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
          <div className="w-full max-w-md  p-8  backdrop-blur-xl sm:p-0">
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

                <section className="flex items-center gap-3 border-b border-(--border-color) py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c5c9ac"
                    stroke-width="2"
                    stroke-linecap="butt"
                    stroke-linejoin="arcs"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@perfomance.com"
                    className="w-full  text-(--text-color) shadow-sm outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </section>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-3 block text-sm font-medium text-slate-300"
                >
                  Contraseña
                </label>

                <section className="flex items-center gap-3 border-b border-(--border-color) py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c5c9ac"
                    stroke-width="2"
                    stroke-linecap="butt"
                    stroke-linejoin="arcs"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    className="text-(--text-color) shadow-sm outline-none "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </section>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-(--primary-color) px-5 py-4 text-base font-semibold text-slate-950 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-(--primary-color)/25 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                Iniciar sesión
              </button>

              <div className="flex items-center gap-3 py-2 text-sm text-(--subtext-color)">
                <p className="">¿Eres nuevo en el programa elite?</p>
                <a
                  href="/register"
                  className="font-semibold text-(--primary-color) hover:text-white"
                >
                  Crea Cuenta
                </a>
              </div>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
};

export default LoginPage;
