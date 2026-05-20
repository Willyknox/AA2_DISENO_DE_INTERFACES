import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bikeService } from '../services/bikeService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function BikeDetailPage() {
  // useParams lee los parámetros dinámicos de la ruta: /bikes/:id.
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        setLoading(true);
        const data = await bikeService.getBikeById(id);
        setBike(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]); // Si cambia el id en la URL, React vuelve a pedir la bicicleta correcta.

  if (loading) return <LoadingSpinner message="Cargando detalles de la bicicleta..." />;
  if (error) return <ErrorMessage message={error} showBackButton />;
  if (!bike) return null;

  // Mapa de colores para los badges de tipo: convierte datos en decisiones visuales.
  const typeColors = {
    road: 'primary',
    mountain: 'success',
    city: 'info',
    gravel: 'warning',
    fitness: 'secondary'
  };
  const badgeColor = typeColors[bike.type] || 'dark';

  return (
    <div className="container py-5">
      <Link to="/bikes" className="btn btn-outline-secondary mb-4">
        &larr; Volver al catálogo
      </Link>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          {/* alt describe la imagen para accesibilidad y lectores de pantalla. */}
          <img src={bike.image} alt={bike.model} className="img-fluid rounded shadow-sm w-100" />
        </div>
        <div className="col-md-6">
          <h1 className="fw-bold">{bike.model}</h1>
          <h4 className="text-muted mb-4">{bike.brand}</h4>
          
          {/* toLocaleString formatea el precio con separadores adecuados para español. */}
          <h2 className="text-primary fw-bold mb-4">{bike.price.toLocaleString('es-ES')} €</h2>
          
          <div className="d-flex flex-wrap gap-2 mb-4">
            <span className={`badge bg-${badgeColor}`}>{bike.type}</span>
            <span className="badge bg-info text-dark">{bike.wheelSize}"</span>
            <span className="badge bg-light text-dark border">{bike.year}</span>
            {bike.ebike && <span className="badge bg-warning text-dark">E-Bike</span>}
          </div>
          
          <h5 className="fw-bold mt-4">Descripción</h5>
          <p className="lead">{bike.description}</p>
          
          <button className="btn btn-primary btn-lg mt-4 w-100">Contactar para comprar</button>
        </div>
      </div>
    </div>
  );
}
