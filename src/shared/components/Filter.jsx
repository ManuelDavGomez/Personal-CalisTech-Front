
const Filter = ({ valorBusqueda, alCambiar }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        value={valorBusqueda}
        onChange={(e) => alCambiar(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 w-full"
      />
    </div>
  );
};

export default Filter;
