import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PROTECTED ROUTE (Guardián de Autenticación)
 * 
 * Implementa la "Protección de rutas" exigida.
 * Impide el acceso a usuarios no logueados redirigiéndolos al login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!isAuthenticated) {
    /**
     * Gestión de Redirecciones:
     * Guardamos la ubicación actual en el estado del router. Tras un login exitoso,
     * la aplicación podrá devolver al usuario exactamente a donde intentaba ir.
     */
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si pasa la comprobación, se renderiza la página protegida.
  return children;
};

export default ProtectedRoute;
