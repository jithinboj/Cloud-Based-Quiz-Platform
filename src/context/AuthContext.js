import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import the centralized api instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On initial load, check for token and user data in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Set the token in the api instance header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    // Store user data and token
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);

    // Update state
    setUser(userData);
    setToken(userToken);

    // Set token for all future Axios requests
    api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
    
    // Navigate to the correct dashboard
    if (userData.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (userData.role === 'student') {
      navigate('/student/dashboard');
    }
  };

  const logout = () => {
    // Clear user data and token
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Reset state
    setUser(null);
    setToken(null);

    // Remove Authorization header
    delete api.defaults.headers.common['Authorization'];

    // Navigate to the home page
    navigate('/');
  };

  const authContextValue = {
    user,
    token,
    isLoggedIn: !!token,
    loading,
    login,
    logout,
  };

  // The loading state prevents rendering protected routes before auth state is confirmed
  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
