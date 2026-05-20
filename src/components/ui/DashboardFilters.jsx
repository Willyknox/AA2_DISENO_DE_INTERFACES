import React from 'react';

const DashboardFilters = ({
  searchTerm,
  onSearchChange,
  selectedBrand,
  onBrandChange,
  selectedType,
  onTypeChange,
  selectedYear,
  onYearChange,
  ebikeFilter,
  onEbikeChange,
  onClearFilters,
  brands = [],
  types = [],
  years = []
}) => {
  return (
    <div className="card border-0 shadow-sm mb-4 dashboard-filters-container">
      <div className="card-body p-4">
        <h5 className="fw-semibold mb-3 text-secondary d-flex align-items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.124.325L9 9.3l-1.2 1.2a.5.5 0 0 1-.708 0l-1.2-1.2-4.876-5.475A.5.5 0 0 1 1 3.5zm1.125 1v1.314l4.242 4.772a.5.5 0 0 1 .124.325V11a.5.5 0 0 1-.5.5H5.5a.5.5 0 0 1-.5-.5V8.91l-4.242-4.77A.5.5 0 0 1 .625 3.5V2.5z"/>
          </svg>
          Filtros de Búsqueda
        </h5>
        
        <div className="row g-3">
          {/* Búsqueda */}
          <div className="col-12 col-md-4 col-lg-3">
            <label className="form-label text-muted small fw-bold">Buscar modelo</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-search text-muted" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Ej: Domane..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Marca */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label className="form-label text-muted small fw-bold">Marca</label>
            <select
              className="form-select"
              value={selectedBrand}
              onChange={e => onBrandChange(e.target.value)}
            >
              <option value="">Todas</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label className="form-label text-muted small fw-bold">Tipo</label>
            <select
              className="form-select"
              value={selectedType}
              onChange={e => onTypeChange(e.target.value)}
            >
              <option value="">Todos</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'road' && 'Carretera'}
                  {type === 'mountain' && 'Montaña'}
                  {type === 'city' && 'Ciudad'}
                  {type === 'gravel' && 'Gravel'}
                  {type === 'fitness' && 'Fitness'}
                  {!['road', 'mountain', 'city', 'gravel', 'fitness'].includes(type) && type}
                </option>
              ))}
            </select>
          </div>

          {/* Año (Fecha) */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2">
            <label className="form-label text-muted small fw-bold">Año Modelo</label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={e => onYearChange(e.target.value)}
            >
              <option value="">Todos</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* E-Bike Checkbox */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-2 d-flex align-items-center">
            <div className="form-check mt-md-4 pt-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="ebikeFilterCheck"
                checked={ebikeFilter}
                onChange={e => onEbikeChange(e.target.checked)}
              />
              <label className="form-check-label fw-semibold text-muted" htmlFor="ebikeFilterCheck">
                Solo E-Bikes ⚡
              </label>
            </div>
          </div>

          {/* Limpiar */}
          <div className="col-12 col-lg-1 d-flex align-items-end justify-content-lg-end">
            <button
              className="btn btn-outline-secondary w-100 mt-2 mt-lg-0 d-flex align-items-center justify-content-center gap-1"
              onClick={onClearFilters}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
              </svg>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilters;
