/**
 * useAuth Hook - Authentication State Management
 * ==============================================
 * Handles user authentication state, login, logout, and signup.
 * Auth tokens are expected via httpOnly cookies (backend handles this).
 * 
 * This hook is backend-agnostic and only makes HTTP calls.
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { ApiError } from '@/lib/api';

// User interface - minimal, backend defines actual shape
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Auth context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check auth status on mount
  const checkAuth = useCallback(async () => {
    try {
      const userData = await api.get<User>('/auth/me');
      setUser(userData);
    } catch (err) {
      // Silently fail - no backend connected or user not logged in
      // This allows pages to work without authentication
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await api.post<User>('/auth/login', { email, password });
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof ApiError 
        ? (err.data as { message?: string })?.message || 'Login failed'
        : 'An unexpected error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Signup handler
  const signup = useCallback(async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await api.post<User>('/auth/signup', { email, password, name });
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof ApiError 
        ? (err.data as { message?: string })?.message || 'Signup failed'
        : 'An unexpected error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    }
  }, [navigate]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    signup,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default useAuth;