import React, { createContext, useContext, useState, useEffect } from 'react';
import useTheme from '../hooks/useTheme';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme settings globally
  useTheme(user);

  useEffect(() => {
    const storedUser = localStorage.getItem('llwp_user');
    const storedToken = localStorage.getItem('llwp_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem('llwp_user');
        localStorage.removeItem('llwp_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token, progressData) => {
    localStorage.setItem('llwp_token', token);
    localStorage.setItem('llwp_user', JSON.stringify(userData));
    setUser(userData);
    setProgress(progressData);
  };

  const logout = () => {
    localStorage.removeItem('llwp_token');
    localStorage.removeItem('llwp_user');
    setUser(null);
    setProgress(null);
  };

  const updateUser = async (updatedFields, persist = true) => {
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem('llwp_user', JSON.stringify(merged));

    if (persist) {
      try {
        const token = localStorage.getItem('llwp_token');
        await fetch('http://localhost:5000/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedFields)
        });
      } catch (error) {
        console.error("Failed to persist user updates", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, progress, loading, login, logout, updateUser, setProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
