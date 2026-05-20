// Barra de filtros controlada desde BikesPage: recibe valores y callbacks por props.
export default function FilterBar({ brands, selectedBrand, onBrandChange, sortOrder, onSortChange }) {
  return (
    <div className="d-flex flex-column flex-md-row gap-3 mb-4 p-3 bg-white rounded shadow-sm">
      <div className="flex-grow-1">
        <label htmlFor="brandFilter" className="form-label text-muted small fw-bold mb-1">Filtrar por marca</label>
        <select 
          id="brandFilter"
          className="form-select" 
          value={selectedBrand} 
          // Al cambiar el select avisamos al padre, que actualiza el estado selectedBrand.
          onChange={(e) => onBrandChange(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {/* map transforma la lista de marcas en opciones HTML. key ayuda a React a optimizar la lista. */}
          {brands.map(brand => (
            <option key={brand.id} value={brand.name}>{brand.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-grow-1">
        <label className="form-label text-muted small fw-bold mb-1">Ordenar por precio</label>
        <div className="d-flex gap-2">
          <button 
            // Cambiamos la clase según el estado: botón relleno si está activo, outline si no.
            className={`btn flex-grow-1 ${sortOrder === 'asc' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onSortChange('asc')}
          >
            Más baratas
          </button>
          <button 
            className={`btn flex-grow-1 ${sortOrder === 'desc' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onSortChange('desc')}
          >
            Más caras
          </button>
        </div>
      </div>
    </div>
  );
}
