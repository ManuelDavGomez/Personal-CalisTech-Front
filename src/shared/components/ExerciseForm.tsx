import { useState } from "react";
import { getAuthToken, getAuthUser } from "../utils/auth";

type ExerciseFormState = {
  nombre: string;
  musculos: string;
  dificultad: string;
  url_img: string;
};

const initialState: ExerciseFormState = {
  nombre: "",
  musculos: "",
  dificultad: "",
  url_img: "",
};

const ExerciseForm = () => {
  const user = getAuthUser();
  const [formData, setFormData] = useState<ExerciseFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (user?.role !== "admin") {
      setErrorMessage("Solo el administrador puede crear ejercicios.");
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setErrorMessage("Tu sesión ha expirado. Inicia sesión otra vez.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/exercises/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.message || "No se pudo crear el ejercicio.");
        return;
      }

      setSuccessMessage("Ejercicio creado correctamente.");
      setFormData(initialState);
    } catch (error) {
      console.error(error);
      setErrorMessage("Error de conexión con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
        No tienes permisos para crear ejercicios.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5 shadow-xl shadow-black/10 sm:p-7">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre" className="mb-2 block text-xs font-semibold text-(--text-color)">
            Nombre del ejercicio
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Sentadilla"
            required
            className="w-full rounded-xl border border-(--border-color) bg-(--background-color) px-4 py-3 text-sm text-(--text-color) outline-none transition placeholder:text-(--subtext-color) focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
          />
        </div>

        <div>
          <label htmlFor="url_img" className="mb-2 block text-xs font-semibold text-(--text-color)">
            Imagen <span className="font-normal text-(--subtext-color)">(opcional)</span>
          </label>
          <input
            id="url_img"
            name="url_img"
            type="url"
            value={formData.url_img}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border border-(--border-color) bg-(--background-color) px-4 py-3 text-sm text-(--text-color) outline-none transition placeholder:text-(--subtext-color) focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
          />
          <p className="mt-2 text-[11px] text-(--subtext-color)">
            Usa un enlace público para que la imagen pueda visualizarse.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="musculos" className="mb-2 block text-xs font-semibold text-(--text-color)">
              Músculos trabajados
            </label>
            <input
              id="musculos"
              name="musculos"
              type="text"
              value={formData.musculos}
              onChange={handleChange}
              placeholder="Piernas, glúteos"
              required
              className="w-full rounded-xl border border-(--border-color) bg-(--background-color) px-4 py-3 text-sm text-(--text-color) outline-none transition placeholder:text-(--subtext-color) focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
            />
          </div>

          <div>
            <label htmlFor="dificultad" className="mb-2 block text-xs font-semibold text-(--text-color)">
              Dificultad
            </label>
            <select
              id="dificultad"
              name="dificultad"
              value={formData.dificultad}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-(--border-color) bg-(--background-color) px-4 py-3 text-sm text-(--text-color) outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/10"
            >
              <option value="">Selecciona una dificultad</option>
              <option value="Facil">Fácil</option>
              <option value="Media">Media</option>
              <option value="Dificil">Difícil</option>
            </select>
          </div>
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-md border border-(--primary-color)/40 bg-(--primary-color)/10 px-4 py-3 text-sm text-(--primary-color)">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 py-3.5 text-sm font-bold text-(--background-color) transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando ejercicio..." : "Publicar ejercicio"}
          {!isSubmitting ? (
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </button>
      </form>
    </section>
  );
};

export default ExerciseForm;
