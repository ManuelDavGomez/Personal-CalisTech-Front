import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../shared/utils/auth";
import Filter from "../../shared/components/Filter.jsx";

interface Skill {
  id: string;
  nombre: string;
  musculos: string;
  dificultad: string;
}

const LibraryPage = () => {
  const [elementos, setElementos] = useState<Skill[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      const token = getAuthToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/tasks/skills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Error al obtener los datos");
        }

        setElementos(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error inesperado";
        setError(message);

        if (
          message.toLowerCase().includes("token") ||
          message.toLowerCase().includes("unauthorized")
        ) {
          navigate("/login", { replace: true });
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [navigate]);

  if (cargando) return <p>Cargando información...</p>;
  if (error) return <p>Error: {error}</p>;
  if (elementos.length === 0)
    return <p>No hay registros disponibles en la base de datos.</p>;

  const resultadosFiltrados = elementos.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <article>
      <article className="flex flex-row justify-between gap-4 pb-20">
        <section>
          <h1 className="font-bold text-4xl">Libreria de Ejercicios</h1>
          <p className="text-gray-500">
            Explora nuestra colección de ejercicios
          </p>
        </section>
        <section>
          <Filter valorBusqueda={busqueda} alCambiar={setBusqueda} />
        </section>
      </article>

      <article className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resultadosFiltrados.map((item) => (
          <section
            key={item.id}
            className="border p-4 my-2 rounded-lg bg-(--secondary-color) text-white border-(--border-color) cursor-pointer"
          >
            <h2 className="text-xl font-bold">
              {item.nombre || "Skill sin nombre"}
            </h2>
            <section className="flex flex-col gap-1">
              <p className="text-lg text-(--subtext-color)">
                {item.musculos || "Sin músculos asignados"}
              </p>
            </section>
            <p>{item.dificultad || "Sin dificultad"}</p>
          </section>
        ))}
      </article>
    </article>
  );
};

export default LibraryPage;
