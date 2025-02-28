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

// User API functions
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

// Exercise API functions
export const getExercises = async () => {
  const response = await api.get('/exercises');
  return response.data;
};

export const getExerciseById = async (exerciseId) => {
  const response = await api.get(`/exercises/${exerciseId}`);
  return response.data;
};

export const createExercise = async (exerciseData) => {
  const response = await api.post('/exercises', exerciseData);
  return response.data;
};

export const updateExercise = async (exerciseId, exerciseData) => {
  const response = await api.put(`/exercises/${exerciseId}`, exerciseData);
  return response.data;
};

export const deleteExercise = async (exerciseId) => {
  const response = await api.delete(`/exercises/${exerciseId}`);
  return response.data;
};

// Workout API functions
export const getWorkoutsByUser = async (userId) => {
  const response = await api.get(`/workouts/user/${userId}`);
  return response.data;
};

// Add the missing getUserWorkouts function (alias for getWorkoutsByUser)
export const getUserWorkouts = async (userId) => {
  return getWorkoutsByUser(userId);
};

export const getWorkoutById = async (workoutId) => {
  const response = await api.get(`/workouts/${workoutId}`);
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await api.post('/workouts', workoutData);
  return response.data;
};

export const updateWorkout = async (workoutId, workoutData) => {
  const response = await api.put(`/workouts/${workoutId}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (workoutId) => {
  const response = await api.delete(`/workouts/${workoutId}`);
  return response.data;
};

export const getMaxWeightsByUser = async (userId) => {
  const response = await api.get(`/workouts/max-weights/${userId}`);
  return response.data;
};

// Measurement API functions
export const getMeasurementsByUser = async (userId) => {
  const response = await api.get(`/measurements/user/${userId}`);
  return response.data;
};

export const getMeasurementById = async (measurementId) => {
  const response = await api.get(`/measurements/${measurementId}`);
  return response.data;
};

export const createMeasurement = async (measurementData) => {
  const response = await api.post('/measurements', measurementData);
  return response.data;
};

export const updateMeasurement = async (measurementId, measurementData) => {
  const response = await api.put(`/measurements/${measurementId}`, measurementData);
  return response.data;
};

// Health check
export const checkApiHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Default export for backward compatibility
export default api;