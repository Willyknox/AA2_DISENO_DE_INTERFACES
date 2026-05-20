import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ROLE GUARD (Control de Acceso basado en Roles - RBAC)
 * 
 * Implementa el "Control de acceso basado en roles que impida el acceso no autorizado".
 * Verifica que el usuario tenga los privilegios necesarios antes de renderizar la página.
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
