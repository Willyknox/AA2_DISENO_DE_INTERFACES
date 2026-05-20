// Servicio de autenticación local con soporte para tokens simulados (JWT)
// En una aplicación de producción, estas funciones llamarían a los endpoints del backend.

// Espera simulada para visualizar estados de carga (spinner) en la interfaz.
/**
 * SERVICIO DE AUTENTICACIÓN
 * 
 * Gestiona el inicio de sesión, registro y verificación de sesiones activas.
 * 
 * Lógica:
 * 1. Verificación de credenciales contra el listado de usuarios local.
 * 2. Generación de un token estructurado con la identidad y rol del usuario.
 * 3. Restauración de sesión persistente mediante validación del token en localStorage.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Base de datos de usuarios simulada para desarrollo.
const mockUsers = [
  { id: 1, email: 'admin@bikeshop.com', password: 'password123', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@bikeshop.com', password: 'password123', name: 'Regular User', role: 'user' }
];

export const authService = {
  async login(credentials) {
    await delay(800); // Simular petición de red
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token: `fake-jwt-token-for-${user.id}-role-${user.role}`
    };
  },

  async register(userData) {
    await delay(1000); // Simular petición de red
    
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('El correo electrónico ya está en uso');
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'user' // Rol por defecto para nuevos usuarios
    };

    const { password, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token: `fake-jwt-token-for-${newUser.id}-role-user`
    };
  },

  async verifyToken(token) {
    await delay(300);
    if (!token || !token.startsWith('fake-jwt-token-for-')) {
      throw new Error('Token inválido');
    }
    // Extraer información del usuario desde el formato de token simulado
    const parts = token.split('-');
    const id = parseInt(parts[4]);
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      throw new Error('Sesión expirada o inválida');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
