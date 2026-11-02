import ExerciseForm from "../../shared/components/ExerciseForm";


const AdminLibraryPage = () => {
  return (
    <div className="mt-10 grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
      <section id="nuevo-ejercicio" className="scroll-mt-8">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
            Biblioteca de contenido
          </p>
          <h2 className="mt-2 text-2xl font-bold text-(--text-color)">
            Añadir ejercicio
          </h2>
          <p className="mt-1 text-sm text-(--subtext-color)">
            Comparte un movimiento nuevo con la comunidad.
          </p>
        </div>
        <ExerciseForm />
      </section>

      <aside className="space-y-4 xl:pt-[3.6rem]">
        <section className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--primary-color)/10 text-(--primary-color)">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  d="M12 3.5 14.6 9l5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <h3 className="font-semibold text-(--text-color)">
                Antes de publicar
              </h3>
              <p className="mt-1 text-xs leading-5 text-(--subtext-color)">
                Una ficha completa ayuda a los atletas a elegir el ejercicio
                correcto.
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-4">
            {[
              [
                "01",
                "Elige un nombre reconocible",
                "Usa el nombre habitual del movimiento.",
              ],
              [
                "02",
                "Indica los músculos",
                "Separa los grupos musculares con comas.",
              ],
              [
                "03",
                "Ajusta la dificultad",
                "Piensa en el nivel técnico necesario.",
              ],
            ].map(([number, title, description]) => (
              <li key={number} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-(--border-color) text-[10px] font-bold text-(--subtext-color)">
                  {number}
                </span>
                <span>
                  <span className="block text-xs font-semibold text-(--text-color)">
                    {title}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-(--subtext-color)">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-(--primary-color)/10 bg-(--primary-color)/[0.035] p-5">
          <p className="text-xs font-semibold text-(--primary-color)">
            Consejo de calidad
          </p>
          <p className="mt-2 text-xs leading-5 text-(--subtext-color)">
            Añade una imagen accesible mediante un enlace público para que el
            ejercicio sea más fácil de reconocer.
          </p>
        </section>
      </aside>
    
    </div>
  );
};

export default AdminLibraryPage;
