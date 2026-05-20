// Input de búsqueda controlado: el texto vive en BikesPage y este componente solo lo muestra/actualiza.
export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-4">
      <div className="input-group input-group-lg shadow-sm">
        <span className="input-group-text bg-white border-end-0">
          {/* SVG inline: icono de lupa sin depender de una librería externa de iconos. */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search text-muted" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder="Buscar por modelo o marca..."
          value={searchTerm}
          // Cada pulsación sube el nuevo valor al estado del padre.
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
