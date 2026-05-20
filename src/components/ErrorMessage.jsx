import { Link } from 'react-router-dom';

// Mensaje de error reutilizable: sirve tanto para errores del catálogo como del detalle.
export default function ErrorMessage({ message, showBackButton = false }) {
  return (
    <div className="container py-5 text-center">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{message}</p>
        {!showBackButton && (
          <>
            <hr />
            {/* Pista útil en desarrollo: este proyecto necesita json-server para servir datos. */}
            <p className="mb-0">Asegúrate de tener el json-server en ejecución.</p>
          </>
        )}
      </div>
      {showBackButton && (
        <Link to="/bikes" className="btn btn-outline-primary mt-3">Volver al catálogo</Link>
      )}
    </div>
  );
}
