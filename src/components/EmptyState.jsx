// Se muestra cuando la búsqueda/filtros no devuelven bicicletas.
export default function EmptyState({ onClearFilters }) {
  return (
    <div className="text-center py-5 bg-white rounded shadow-sm">
      <h4 className="text-muted">No se encontraron resultados</h4>
      <p>Prueba a cambiar los filtros o el texto de búsqueda.</p>
      <button 
        className="btn btn-outline-primary mt-2"
        onClick={onClearFilters}
      >
        Limpiar filtros
      </button>
    </div>
  );
}
