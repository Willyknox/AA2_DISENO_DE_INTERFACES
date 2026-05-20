import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authReducer, initialState } from '../reducers/authReducer';
import { authService } from '../services/authService';

/**
 * CONTEXTO DE AUTENTICACIÓN
 * 
 * Centraliza el estado de seguridad de la aplicación.
 * Gestiona "redirecciones y estados durante el proceso de autenticación".
 */
export const AuthContext = createContext();

// Hook personalizado: así los componentes pueden escribir useAuth() en vez de useContext(AuthContext).
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  /**
   * useReducer: Gestiona la complejidad de los estados (Cargando, Error, Éxito).
   * Proporciona una transición de estados predecible y fácil de testear.
   */
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Persistencia de Sesión:
   * Al montar la app, se busca el token en localStorage. Si existe, se valida 
   * con el servicio para restaurar la sesión automáticamente (UX fluida).
   */
  useEffect(() => {
    const restoreSession = async () => {
      if (state.token) {
        try {
          const user = await authService.verifyToken(state.token);
          dispatch({ type: 'RESTORE_SESSION', payload: { user, token: state.token } });
        } catch (error) {
          dispatch({ type: 'LOGOUT' });
          localStorage.removeItem('jwt_token');
        }
      }
    };
    restoreSession();
  }, []);

  const login = async (credentials) => {
    // Avisamos al reducer de que empieza una operación asíncrona: la UI puede mostrar “cargando”.
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
      // localStorage persiste el token aunque el usuario recargue el navegador.
      localStorage.setItem('jwt_token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await authService.register(userData);
      localStorage.setItem('jwt_token', response.token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response });
      return response;
    } catch (error) {
      dispatch({ type: 'REGISTER_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    // Para cerrar sesión hay que borrar tanto el token persistido como el estado de React.
    localStorage.removeItem('jwt_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    // value expone estado + acciones. Cualquier hijo envuelto por AuthProvider puede consumirlo.
    <AuthContext.Provider value={{ ...state, login, register, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
