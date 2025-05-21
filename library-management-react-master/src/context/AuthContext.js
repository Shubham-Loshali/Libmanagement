import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService,
  getCurrentUser,
  isLoggedIn,
  initAuth
} from '../services/authService';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Initialize axios interceptors
        initAuth();
        
        // Check if user is logged in
        const loggedIn = isLoggedIn();
        setIsAuthenticated(loggedIn);
        
        // Get current user from localStorage
        if (loggedIn) {
          const user = getCurrentUser();
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginService(credentials);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const response = await registerService(userData);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Update user function
  const updateUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;