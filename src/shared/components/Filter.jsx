
const Filter = ({ valorBusqueda, alCambiar }) => {
  return (
    <article class="relative w-full max-w-md mx-auto">
      <section class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          class="w-5 h-5 text-white group-focus-within:text-(--primary-color) transition-colors"
          xmlns="http://w3.org"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="#fff"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.603z"
          />
        </svg>
      </section>

      <input
        type="search"
        placeholder="Buscar Ejercicios"
        class="w-62.5 pl-10 pr-2 py-2.5 bg-(--background-color) border border-(--border-color) text-white placeholder:text-(--subtext-color) focus:outline-none focus:ring-0 focus:ring-(--primary-color) focus:border-(--primary-color) focus:bg-(--primary-color)/10 transition-all duration-200 shadow-sm"
        value={valorBusqueda}
        onChange={(e) => alCambiar(e.target.value)}
      />
    </article>
  );
};

export default Filter;
