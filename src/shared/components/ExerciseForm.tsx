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
    <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
      <h2 className="mb-6 text-2xl font-semibold text-white">Nuevo ejercicio</h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-slate-300">
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        <div>
          <label htmlFor="url_img" className="mb-2 block text-sm font-medium text-slate-300">
            URL de la imagen
          </label>
          <input
            id="url_img"
            name="url_img"
            type="text"
            value={formData.url_img}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        <div>
          <label htmlFor="musculos" className="mb-2 block text-sm font-medium text-slate-300">
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
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </div>

        <div>
          <label htmlFor="dificultad" className="mb-2 block text-sm font-medium text-slate-300">
            Dificultad
          </label>
          <select
            id="dificultad"
            name="dificultad"
            value={formData.dificultad}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          >
            <option value="">Selecciona una dificultad</option>
            <option value="Facil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Dificil">Difícil</option>
          </select>
        </div>

        {errorMessage ? (
          <p className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : "Crear ejercicio"}
        </button>
      </form>
    </section>
  );
};

export default ExerciseForm;
