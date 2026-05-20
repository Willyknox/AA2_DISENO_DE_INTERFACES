import { describe, it, expect, vi } from 'vitest';
import { authService } from '../services/authService';

describe('authService', () => {
  it('should successfully login an existing user', async () => {
    const credentials = { email: 'admin@bikeshop.com', password: 'password123' };
    const response = await authService.login(credentials);
    
    expect(response.user).toBeDefined();
    expect(response.user.email).toBe(credentials.email);
    expect(response.user.role).toBe('admin');
    expect(response.token).toContain('fake-jwt-token');
  });

  it('should reject invalid credentials', async () => {
    const credentials = { email: 'admin@bikeshop.com', password: 'wrongpassword' };
    
    await expect(authService.login(credentials)).rejects.toThrow('Credenciales inválidas');
  });

  it('should register a new user successfully', async () => {
    const newUser = { name: 'Test User', email: 'test@bikeshop.com', password: 'testpassword' };
    const response = await authService.register(newUser);
    
    expect(response.user).toBeDefined();
    expect(response.user.email).toBe(newUser.email);
    expect(response.user.role).toBe('user');
    expect(response.token).toContain('fake-jwt-token');
  });

  it('should verify a valid fake token correctly', async () => {
    const token = 'fake-jwt-token-for-1-role-admin';
    const user = await authService.verifyToken(token);
    
    expect(user).toBeDefined();
    expect(user.role).toBe('admin');
    expect(user.email).toBe('admin@bikeshop.com');
  });

  it('should throw an error for an invalid fake token', async () => {
    const token = 'invalid-token-format';
    
    await expect(authService.verifyToken(token)).rejects.toThrow('Token inválido');
  });
});
