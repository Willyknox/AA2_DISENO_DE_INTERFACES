import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { authReducer, initialState } from '../reducers/authReducer';
import { authService } from '../services/authService';

/**
 * Contexto de Autenticación
 */
export const AuthContext = createContext();

// Hook para consumir el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restaurar la sesión al montar la aplicación si existe un token guardado
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
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
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
    localStorage.removeItem('jwt_token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
