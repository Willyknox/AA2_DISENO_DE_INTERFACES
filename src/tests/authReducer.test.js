import { describe, it, expect } from 'vitest';
import { authReducer, initialState } from '../reducers/authReducer';

describe('authReducer', () => {
  it('should handle LOGIN_START', () => {
    const action = { type: 'LOGIN_START' };
    const newState = authReducer(initialState, action);
    
    expect(newState.loading).toBe(true);
    expect(newState.error).toBe(null);
  });

  it('should handle LOGIN_SUCCESS', () => {
    const payload = {
      user: { id: 1, name: 'Test User' },
      token: 'fake-token'
    };
    const action = { type: 'LOGIN_SUCCESS', payload };
    const newState = authReducer(initialState, action);
    
    expect(newState.loading).toBe(false);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toEqual(payload.user);
    expect(newState.token).toBe('fake-token');
    expect(newState.error).toBe(null);
  });

  it('should handle LOGIN_ERROR', () => {
    const action = { type: 'LOGIN_ERROR', payload: 'Invalid credentials' };
    const newState = authReducer(initialState, action);
    
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Invalid credentials');
    expect(newState.isAuthenticated).toBe(false);
  });

  it('should handle LOGOUT', () => {
    const loggedInState = {
      ...initialState,
      user: { id: 1 },
      token: 'fake-token',
      isAuthenticated: true
    };
    
    const action = { type: 'LOGOUT' };
    const newState = authReducer(loggedInState, action);
    
    expect(newState.user).toBe(null);
    expect(newState.token).toBe(null);
    expect(newState.isAuthenticated).toBe(false);
  });
});
