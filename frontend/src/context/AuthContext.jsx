import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token validity on initial load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      return data;
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await authApi.register({ name, email, password });
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
