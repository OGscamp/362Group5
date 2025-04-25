import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject({
        error: error.response.data.error || 'An error occurred',
        status: error.response.status
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      return Promise.reject({
        error: 'Network Error: Could not connect to the server',
        status: 0
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      return Promise.reject({
        error: error.message || 'An unexpected error occurred',
        status: 500
      });
    }
  }
);

export const propertyService = {
  getAllProperties: async () => {
    try {
      console.log('Fetching all properties...');
      const response = await api.get('/properties');
      console.log('Properties fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  getUserProperties: async (userId) => {
    const response = await api.get(`/properties/user/${userId}`);
    return response.data || [];
  },

  getPropertyById: async (id) => {
    try {
      console.log(`Fetching property with ID: ${id}`);
      const response = await api.get(`/properties/${id}`);
      console.log('Property fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  createProperty: async (propertyData) => {
    try {
      console.log('Creating new property:', propertyData);
      const response = await api.post('/properties', propertyData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Property created successfully:', response.data);
      return { success: true, ...response.data };
    } catch (error) {
      console.error('Error creating property:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to create property' 
      };
    }
  },

  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    try {
      console.log(`Deleting property with ID: ${id}`);
      const response = await api.delete(`/properties/${id}`);
      console.log('Property deleted successfully:', response.data);
      return { success: true, ...response.data };
    } catch (error) {
      console.error('Error deleting property:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete property';
      throw {
        error: errorMessage,
        status: error.response?.status || 500
      };
    }
  },

  updatePropertyPhotos: async (id, photos) => {
    const response = await api.put(`/properties/${id}/photos`, photos);
    return response.data;
  },

  searchProperties: (params) => {
    try {
      console.log('Making search request with params:', params.toString());
      return api.get(`/properties/search?${params.toString()}`);
    } catch (error) {
      console.error('Error in searchProperties:', error);
      throw error;
    }
  }
};

export const bookingService = {
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data || [];
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    try {
      console.log('Updating booking status:', { id, status });
      const response = await api.put(`/bookings/${id}/status`, { status });
      console.log('Status update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  }
};

export const reviewService = {
  getReviews: (propertyId) => api.get(`/reviews/property/${propertyId}`),

  createReview: (reviewData) => api.post('/reviews', reviewData),

  updateReview: (id, review) => api.put(`/review/${id}`, review),

  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

export const chatService = {
  getMessages: (userId) => api.get(`/chat/history?userId=${userId}`),
  sendMessage: (message) => api.post('/chat/send', message),
};

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  register: (userData) => api.post('/auth/register', userData),

  logout: async () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },

  getCurrentUser: () => api.get('/auth/me'),

  deleteUser: (username) => api.delete('/auth/user', { data: { username } }),

  updatePassword: (username, newPassword) => api.put('/auth/password', { username, newPassword })
};

// Payment methods
export const paymentService = {
  addPaymentMethod: async (formData) => {
    try {
      const response = await api.post('/payments', formData);
      return {
        message: 'Payment method added successfully',
        paymentMethod: response.data
      };
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments');
      return {
        paymentMethods: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  },

  deletePaymentMethod: async (id) => {
    try {
      const response = await api.delete(`/payments/${id}`);
      return {
        message: 'Payment method deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  setDefaultPaymentMethod: async (id) => {
    try {
      const response = await api.put(`/payments/${id}/default`);
      return {
        message: 'Default payment method updated'
      };
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  }
}; 