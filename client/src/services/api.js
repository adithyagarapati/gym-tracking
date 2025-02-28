import axios from 'axios';

// Determine the API URL based on the environment
const getApiUrl = () => {
  // If we're in a production build served by Nginx
  if (process.env.NODE_ENV === 'production') {
    // Use relative URL which will be proxied by Nginx
    return '/api';
  }
  
  // For development, use the full URL
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;