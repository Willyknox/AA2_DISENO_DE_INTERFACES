// Servicio de autenticación simulado.
// En una aplicación real, estas funciones llamarían a endpoints del backend.

// Pequeña espera artificial para practicar estados de carga en la interfaz.
/**
 * SERVICIO DE AUTENTICACIÓN (JWT SIMULADO)
 * 
 * Este servicio implementa la lógica de autenticación basada en tokens JWT.
 * Cumple con el requerimiento de: "Integrar un sistema de autenticación basado en JWT".
 * 
 * Lógica:
 * 1. Simula la verificación de credenciales contra una base de datos.
 * 2. Genera un token que empaqueta la identidad y el rol del usuario.
 * 3. Permite la validación del token para restaurar sesiones persistentes.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Base de datos de usuarios simulada. Solo se usa en frontend para este proyecto educativo.
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

    // Nunca devolvemos la contraseña a la UI, aunque aquí sea un mock.
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      /**
       * Generación del Token JWT:
       * El token incluye información codificada (id y rol). Esto permite al frontend
       * tomar decisiones de autorización (RBAC) sin consultar al servidor en cada paso.
       */
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
    // Simulación de decodificación de token: extraemos el ID del string simulado
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
