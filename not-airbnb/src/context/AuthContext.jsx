import React, { createContext, useContext, useState } from 'react';

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

  const login = (email, password) => {
    // In a real app, this would make an API call
    setUser({
      id: Date.now(),
      email,
      role: email.includes('host') ? 'host' : 'traveler'
    });
  };

  const register = (email, password, role = 'traveler') => {
    // In a real app, this would make an API call
    setUser({
      id: Date.now(),
      email,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 