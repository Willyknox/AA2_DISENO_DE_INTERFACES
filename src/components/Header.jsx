import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Cabecera principal: muestra navegación distinta según si el usuario está logueado y su rol.
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Tras cerrar sesión enviamos al inicio para evitar que permanezca en una zona privada.
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">BikeShop</Link>
        {/* Botón hamburguesa de Bootstrap para pantallas pequeñas. */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/bikes">Catálogo</Link></li>
            {isAuthenticated ? (
              <>
                {/* Solo los administradores ven el acceso a la gestión de bicicletas. */}
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/bikes">Gestión de bicicletas</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to={user?.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn nav-link">Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Entrar</Link></li>
                <li className="nav-item"><Link className="btn btn-outline-light ms-2" to="/register">Registro</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
