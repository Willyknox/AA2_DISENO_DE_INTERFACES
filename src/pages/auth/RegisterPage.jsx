import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  // Guardamos todos los campos del formulario en un solo objeto para manejarlos juntos.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    // [id] es una propiedad dinámica: actualiza name, email, password o confirmPassword según el input.
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validación en frontend: mejora UX antes de llamar al servicio.
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      // El error se gestiona en el contexto y se muestra debajo del título.
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Crear Cuenta</h2>
              
              {(error || validationError) && (
                <div className="alert alert-danger" role="alert">
                  {validationError || error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre Completo</label>
                  <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} required minLength="6" />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                  <input type="password" className="form-control" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6" />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
