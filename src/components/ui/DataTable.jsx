import React, { useState, useMemo, useEffect } from 'react';

// Tabla reutilizable: columns define qué campos mostrar, data contiene las filas y showSearch controla si se muestra el input de búsqueda.
const DataTable = ({ columns, data, showSearch = true }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterText, setFilterText] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Resetear a la página 1 cuando los datos o el texto de filtro cambian
  useEffect(() => {
    setCurrentPage(1);
  }, [data, filterText]);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Manejar nulos o indefinidos
        if (aVal === undefined || aVal === null) aVal = '';
        if (bVal === undefined || bVal === null) bVal = '';

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        } else {
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        }
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!showSearch || !filterText) return sortedData;
    return sortedData.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(filterText.toLowerCase())
      );
    });
  }, [sortedData, filterText, showSearch]);

  // Calcular paginación
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset a primera página al ordenar
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-0">
        {showSearch && (
          <div className="p-3 bg-light border-bottom">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Buscar en todos los campos..." 
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
        )}
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                {columns.map(col => (
                  <th 
                    key={col.key} 
                    onClick={() => requestSort(col.key)}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    className="py-3 px-4"
                  >
                    <div className="d-flex align-items-center gap-1">
                      {col.label} 
                      <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        {sortConfig.key === col.key 
                          ? (sortConfig.direction === 'asc' ? ' ▴' : ' ▾') 
                          : ' ⇅'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr key={row.id || index}>
                    {columns.map(col => (
                      <td key={col.key} className="py-3 px-4">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-inbox text-secondary" viewBox="0 0 16 16">
                        <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.917 5H10.5a2.5 2.5 0 0 1-5 0H1.103l1.9 3.8A1.5 1.5 0 0 0 4.346 14h7.31a1.5 1.5 0 0 0 1.342-.8l1.9-3.8zm-14-1-.005-.008z"/>
                      </svg>
                      <span>No se encontraron resultados</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        {totalPages > 0 && (
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 p-3 bg-light border-top">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Mostrar</span>
              <select 
                className="form-select form-select-sm" 
                style={{ width: 'auto' }}
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 filas</option>
                <option value={10}>10 filas</option>
                <option value={20}>20 filas</option>
              </select>
              <span className="text-muted small">de {totalItems} registros</span>
            </div>
            
            <nav aria-label="Navegación de tabla">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
