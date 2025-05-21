import axios from 'axios';

// In a real application, this would be the base URL of your API
const API_URL = 'http://localhost:5000/api';

// Set up axios interceptors to include the token in requests
const setupAxiosInterceptors = (token) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Register a new user
export const register = async (userData) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/auth/register`, userData);
    // const { token, user } = response.data;
    
    // For now, we'll simulate the API call
    console.log('Registering new user:', userData);
    const token = 'simulated-jwt-token';
    const user = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user'
    };
    
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Set up axios interceptors
    setupAxiosInterceptors(token);
    
    return { token, user };
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/auth/login`, credentials);
    // const { token, user } = response.data;
    
    // For now, we'll simulate the API call
    console.log('Logging in with credentials:', credentials);
    const token = 'simulated-jwt-token';
    const user = {
      id: 1,
      name: 'Test User',
      email: credentials.email,
      role: credentials.email.includes('admin') ? 'admin' : 'user'
    };
    
    // Store token and user data in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Set up axios interceptors
    setupAxiosInterceptors(token);
    
    return { token, user };
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  // In a real app, this might also call an API endpoint
  // to invalidate the token on the server
  
  // Remove token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  
  // Redirect to home page
  window.location.href = '/';
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

// Check if user has a specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  if (user && user.role) {
    return user.role === role;
  }
  return false;
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.put(`${API_URL}/auth/updatedetails`, userData);
    // const updatedUser = response.data.data;
    
    // For now, we'll simulate the API call
    console.log('Updating user profile:', userData);
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    
    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.put(`${API_URL}/auth/updatepassword`, passwordData);
    // return response.data;
    
    // For now, we'll simulate the API call
    console.log('Changing password:', passwordData);
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Initialize auth state from localStorage
export const initAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setupAxiosInterceptors(token);
  }
};