import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege las rutas para usuarios no autenticados
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!isAuthenticated) {
    // Redirige al login guardando la ruta de origen para poder volver tras autenticarse
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si pasa la comprobación, se renderiza la página protegida.
  return children;
};

export default ProtectedRoute;
