import axios from 'axios';

// Base URL for backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle specific error statuses
    if (response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access denied:', response.data?.error);
    } else if (response?.status === 404) {
      // Not found
      console.error('Resource not found:', response.config.url);
    } else if (response?.status >= 500) {
      // Server error
      console.error('Server error:', response.data?.error);
    }
    
    // Return a consistent error format
    return Promise.reject({
      message: response?.data?.error || 'An error occurred',
      status: response?.status,
      data: response?.data
    });
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current user profile
  getProfile: () => api.get('/auth/me'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// ==================== EVENTS API ====================
export const eventAPI = {
  // Get all events (public)
  getEvents: (params = {}) => api.get('/events', { params }),
  
  // Get single event
  getEventById: (id) => api.get(`/events/${id}`),
  
  // Create new event (organizer only)
  createEvent: (eventData) => api.post('/events', eventData),
  
  // Update event (organizer only)
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  
  // Delete event (organizer only)
  deleteEvent: (id) => api.delete(`/events/${id}`),
  
  // Get event calendar (public)
  getEventCalendar: (params = {}) => api.get('/events/calendar', { params }),
  
  // Get organizer's events
  getMyEvents: () => api.get('/events/organizer/my-events'),
};

// ==================== FLOOR PLAN API ====================
export const floorplanAPI = {
  // Get floor plan for event
  getFloorPlan: (eventId) => api.get(`/floorplan/${eventId}`),
  
  // Save/update floor plan
  saveFloorPlan: (eventId, planData) => api.post(`/floorplan/${eventId}`, planData),
  
  // Assign stand to exhibitor
  assignStand: (eventId, data) => api.post(`/floorplan/${eventId}/assign-stand`, data),
  
  // Check for collisions
  checkCollisions: (eventId, objects) => api.post(`/floorplan/${eventId}/check-collisions`, { objects }),
  
  // Get available stands
  getAvailableStands: (eventId) => api.get(`/floorplan/${eventId}/available-stands`),
};

// ==================== EXHIBITION API ====================
export const exhibitionAPI = {
  // Apply for exhibition
  applyForEvent: (data) => api.post('/exhibition/apply', data),
  
  // Get my applications
  getMyApplications: () => api.get('/exhibition/my-applications'),
  
  // Get applications for an event (organizer only)
  getEventApplications: (eventId) => api.get(`/exhibition/event/${eventId}`),
  
  // Update application status (organizer only)
  updateApplicationStatus: (applicationId, data) => api.put(`/exhibition/${applicationId}`, data),
  
  // Select stand preference
  selectStandPreference: (data) => api.post('/exhibition/select-stand', data),
};

// ==================== UTILITY FUNCTIONS ====================
// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'visitor';
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default api;