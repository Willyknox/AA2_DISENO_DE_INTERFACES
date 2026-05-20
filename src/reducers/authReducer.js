/**
 * Reducer de Autenticación
 * 
 * Gestiona el estado global de la sesión del usuario (carga, éxito, errores y logout).
 */
const getToken = () => {
  try {
    return (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') 
      ? window.localStorage.getItem('jwt_token') 
      : null;
  } catch (e) {
    return null;
  }
};

export const initialState = {
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};
