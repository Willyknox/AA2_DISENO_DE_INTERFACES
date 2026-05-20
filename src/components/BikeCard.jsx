import { Link } from 'react-router-dom';

// Componente reutilizable: recibe una bici por props y se encarga solo de pintarla como tarjeta.
export default function BikeCard({ bike }) {
  // Configuración de colores para los badges según el tipo (Gestalt: Similitud).
  // Usar un objeto evita muchos if/else y centraliza la relación tipo → color.
  const typeColors = {
    road: 'primary',
    mountain: 'success',
    city: 'info',
    gravel: 'warning',
    fitness: 'secondary'
  };

  // Si llega un tipo desconocido usamos 'dark' como color seguro por defecto.
  const badgeColor = typeColors[bike.type] || 'dark';

  return (
    <div className="card bike-card h-100">
      {/* loading="lazy" retrasa la carga de imágenes que aún no se ven: mejora rendimiento. */}
      <img src={bike.image} className="card-img-top" alt={bike.model} loading="lazy" />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold mb-0">{bike.model}</h5>
          <span className={`badge bg-${badgeColor}`}>{bike.type}</span>
        </div>
        
        {/* Gestalt: Proximidad - Información relacionada agrupada visualmente. */}
        <div className="bike-info mb-3 flex-grow-1">
          <p className="card-text text-muted mb-1">{bike.brand}</p>
          <h6 className="text-primary fw-bold">{bike.price} €</h6>
        </div>
        
        {/* Link cambia de ruta sin recargar toda la página, a diferencia de un <a href>. */}
        <Link to={`/bikes/${bike.id}`} className="btn btn-outline-primary w-100 mt-auto">
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
