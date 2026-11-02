import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../shared/utils/auth";

interface Skill {
  id: string;
  nombre: string;
  musculos: string[];
  dificultad: string;
  url_img: string;
  categorias: string[];
}

const LibraryPage = () => {
  const [exercise, setExercise] = useState<Skill[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muscle, setMuscle] = useState<string | null>("");
  const [difficulty, setDifficulty] = useState<string | null>("");
  const [text, setText] = useState<string | null>("");
  const [searchText, setSearchText] = useState<string | null>("");

  const navigate = useNavigate();

  const RayoIcon = () => (
    <svg
      xmlns="http://w3.org"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );

  const coloresDificultad: Record<string, { clase: string }> = {
    Principiante: {
      clase: "text-green-500",
    },
    Intermedio: { clase: "text-yellow-500" },
    Avanzado: { clase: "text-red-500" },
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchText(text);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  useEffect(() => {
    let active = true;

    const loadExercises = async () => {
      const token = getAuthToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const params = new URLSearchParams();
      if (muscle) params.set("musculos", muscle);
      if (difficulty) params.set("dificultad", difficulty);
      if (searchText) params.set("texto", searchText);

      setCargando(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3000/exercises/skills?${params.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Error al obtener los ejercicios");
        }

        if (active) setExercise(data);
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Error de conexión con el servidor",
          );
        }
      } finally {
        if (active) setCargando(false);
      }
    };

    void loadExercises();
    return () => {
      active = false;
    };
  }, [difficulty, muscle, searchText, navigate]);

  return (
    <article>
      <article className="flex flex-col justify-between gap-4 pb-20">
        <section>
          <input
            type="text"
            placeholder="Buscar ejercicios..."
            value={text || ""}
            onChange={(e) => setText(e.target.value)}
            className=" w-3/6 bg-(--secondary-color) rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-(--primary-color) text-white placeholder-(--subtext-color) border border-(--border-color) transition-all duration-300"
          />
        </section>
        <article className="flex flex-col sm:flex-row gap-4">
          <section>
            <select
              name="musculos"
              id="musculos"
              onChange={(e) => setMuscle(e.target.value || null)}
              className="w-full py-2 pl-3 pr-2 text-(--subtext-color) text-sm outline-none border-y-0 border-l-0 border-r-10 border-(--secondary-color) rounded-lg bg-(--secondary-color) focus:outline-none focus:ring-2 focus:ring-(--secondary-color) placeholder:(--subtext-color) transition-all duration-300 cursor-pointer"
            >
              <option value="" selected >
                Musculos
              </option>
              <option value="Biceps">Bíceps</option>
              <option value="Triceps">Tríceps</option>
            </select>
          </section>
          <section>
            <select
              name="dificultad"
              id="dificultad"
              onChange={(e) => setDifficulty(e.target.value || null)}
              className="w-full py-2 pl-3 pr-2 text-(--subtext-color) text-sm outline-none border-y-0 border-l-0 border-r-10 border-(--secondary-color) rounded-lg bg-(--secondary-color) focus:outline-none focus:ring-2 focus:ring-(--secondary-color) placeholder:(--subtext-color) transition-all duration-300 cursor-pointer"
            >
              <option value="">Dificultades</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </section>
        </article>
      </article>

      {cargando && exercise.length === 0 && <p>Cargando ejercicios...</p>}

      {cargando && exercise.length > 0 && (
        <p className="text-gray-500">Actualizando...</p>
      )}

      {error && <p role="alert">Error: {error}</p>}

      {!cargando && !error && exercise.length === 0 && (
        <p>No hay ejercicios disponibles.</p>
      )}

      <article className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exercise.map((item) => (
          <section
            key={item.id}
            onClick={() => navigate(`/dashboard/skills/${item.id}`)}
            className="bordermy-2 rounded-lg bg-(--secondary-color) text-white border-(--border-color) cursor-pointer hover:border-(--primary-color) hover:border transition-all duration-300"
          >
            <img
              src={item.url_img || "https://via.placeholder.com/150"}
              alt={item.nombre}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <section className="p-4">
              <h2 className="text-2xl font-bold mb-2">
                {item.nombre || "Skill sin nombre"}
              </h2>
              <p
                className={`flex items-start gap-1 font-medium ${
                  coloresDificultad[item.dificultad]?.clase || "text-gray-500"
                }`}
              >
                <RayoIcon />
                <span>{item.dificultad || "Sin descripción"}</span>
              </p>

              <section className="flex flex-col w-full flex-wrap mt-2">
                <ul>
                  <li key={item.id}>
                    <p className="text-base text-(--subtext-color) ">
                      {item.musculos?.length
                        ? item.musculos.join(", ")
                        : "Sin músculos asociados"}
                    </p>
                  </li>
                </ul>
              </section>

              <section className="mt-2">
                <ul>
                  <li key={item.id}>
                    <section className="flex flex-wrap gap-2">
                      {item.categorias && item.categorias.length > 0 ? (
                        item.categorias.map((categoria, index) => (
                          <span
                            key={index}
                            className="bg-(--background-color) text-(--subtext-color) px-3 py-1 rounded-lg text-base inline-block"
                          >
                            {categoria}
                          </span>
                        ))
                      ) : (
                        <p className="text-base text-(--subtext-color)">
                          Sin categorías asociadas
                        </p>
                      )}
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          </section>
        ))}
      </article>
    </article>
  );
};

export default LibraryPage;
