/**
 * AUTH REDUCER
 * 
 * Gestiona las transiciones de estado de la autenticación.
 * Cumple con la gestión de "estados durante el proceso de autenticación".
 */
// Lee el token de forma segura: en tests o renderizados fuera del navegador puede no existir window.
const getToken = () => {
  try {
    return (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') 
      ? window.localStorage.getItem('jwt_token') 
      : null;
  } catch (e) {
    return null;
  }
};

// Estado inicial de autenticación: arranca consultando si ya había token guardado.
export const initialState = {
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

// Un reducer recibe el estado actual y una acción, y devuelve el siguiente estado.
// Importante: no se muta el objeto original; se crea una copia con ...state.
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
      // Si llega una acción desconocida, devolvemos el estado sin cambios.
      return state;
  }
};
