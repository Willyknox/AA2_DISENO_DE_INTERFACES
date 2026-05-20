// Componente pequeño y reutilizable para estados de carga.
export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        {/* visually-hidden es accesible: no se ve, pero lo leen lectores de pantalla. */}
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
}
