import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Exercise API calls
export const getExercises = async (params) => {
  const response = await api.get('/exercises', { params });
  return response.data;
};

export const getExerciseById = async (id) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

// Workout API calls
export const getUserWorkouts = async ({ userId, category, startDate, endDate, limit }) => {
  const params = { category, startDate, endDate, limit };
  const response = await api.get(`/workouts/user/${userId}`, { params });
  return response.data;
};

export const getWorkoutById = async (id) => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await api.post('/workouts', workoutData);
  return response.data;
};

export const updateWorkout = async ({ id, workoutData }) => {
  const response = await api.put(`/workouts/${id}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await api.delete(`/workouts/${id}`);
  return response.data;
};

export const getMaxWeights = async ({ userId, exerciseId, startDate, endDate }) => {
  const params = { exerciseId, startDate, endDate };
  const response = await api.get(`/workouts/user/${userId}/max-weights`, { params });
  return response.data;
};

// Measurement API calls
export const getUserMeasurements = async ({ userId, startDate, endDate, limit }) => {
  const params = { startDate, endDate, limit };
  const response = await api.get(`/measurements/user/${userId}`, { params });
  return response.data;
};

export const createMeasurement = async (measurementData) => {
  const response = await api.post('/measurements', measurementData);
  return response.data;
};

export const updateMeasurement = async ({ id, measurementData }) => {
  const response = await api.put(`/measurements/${id}`, measurementData);
  return response.data;
};

export const deleteMeasurement = async (id) => {
  const response = await api.delete(`/measurements/${id}`);
  return response.data;
};

export const getMeasurementStats = async ({ userId, period }) => {
  const params = { period };
  const response = await api.get(`/measurements/user/${userId}/stats`, { params });
  return response.data;
};

export default api;