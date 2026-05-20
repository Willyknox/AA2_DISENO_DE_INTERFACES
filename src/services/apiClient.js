// URL base del API local. json-server suele ejecutarse en http://localhost:3001.
const API_URL = 'http://localhost:3001';

export const apiClient = {
  // Función común para todas las peticiones: añade JSON, token y gestión de errores.
  async fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Si hay token, se envía en Authorization. En un backend real esto permite identificar al usuario.
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      if (response.status === 401) {
        // 401 significa “no autorizado”: limpiamos token y mandamos al login.
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
      }
      // Intentamos leer el mensaje del servidor; si no existe, usamos un mensaje genérico.
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  },

  // Métodos de conveniencia para escribir bikeService.get('/bikes') en vez de repetir fetch completo.
  get(endpoint) {
    return this.fetchWithAuth(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data) {
    return this.fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint) {
    return this.fetchWithAuth(endpoint, { method: 'DELETE' });
  }
};
