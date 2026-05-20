import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BikesPage from './pages/BikesPage';
import BikeDetailPage from './pages/BikeDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBikesPage from './pages/admin/AdminBikesPage';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Header y Footer están fuera de <Routes>, así aparecen en todas las páginas. */}
      <Header />
      <main>
        {/* Routes decide qué componente mostrar según la URL actual del navegador. */}
        <Routes>
          {/* Rutas públicas: no necesitan que el usuario haya iniciado sesión. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/bikes" element={<BikesPage />} />
          {/* :id es un parámetro dinámico; por ejemplo /bikes/3 carga la bici con id 3. */}
          <Route path="/bikes/:id" element={<BikeDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Ruta protegida: primero comprueba login; si no hay sesión redirige a /login. */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Ruta protegida + control de rol: solo puede entrar un usuario con role='admin'. */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/admin/bikes" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['admin']}>
                <AdminBikesPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
