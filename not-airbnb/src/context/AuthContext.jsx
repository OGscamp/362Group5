import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.data && response.data.username) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        setError(error.error || 'Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await authService.login({ username, password });
      console.log('Login response in AuthContext:', response); // Debug log
      if (response.success) {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        if (response.user && response.user._id) {
          localStorage.setItem('userId', response.user._id);
        }
        console.log('Token in localStorage:', localStorage.getItem('token'));
        console.log('UserId in localStorage:', localStorage.getItem('userId'));
        setUser(response.user);
        setError(null);
        return { success: true };
      }
      setError(response.error || 'Invalid credentials');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return { success: false, error: response.error || 'Invalid credentials' };
    } catch (error) {
      setError(error.error || 'Login failed');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return { success: false, error: error.error || 'Login failed' };
    }
  };

  const register = async (username, password) => {
    try {
      setError(null);
      const response = await authService.register({ username, password });
      if (response.data && response.data.success) {
        return { success: true };
      }
      return { success: false, error: response.data?.error || 'Invalid response from server' };
    } catch (error) {
      setError(error.error || 'Registration failed');
      return { success: false, error: error.error || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const response = await authService.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      if (response.success) {
      setUser(null);
      return { success: true };
      }
      return { success: false, error: response.error || 'Failed to logout' };
    } catch (error) {
      setError(error.error || 'Logout failed');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return { success: false, error: error.error || 'Logout failed' };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 