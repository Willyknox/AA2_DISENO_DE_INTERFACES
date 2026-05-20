import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente para restringir el acceso a rutas según el rol de usuario
 */
const RoleGuard = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Si no tiene el rol correcto, mandamos a una página segura en vez de mostrar contenido admin.
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleGuard;
