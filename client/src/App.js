import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { UserProvider } from './context/UserContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import WorkoutCategories from './pages/WorkoutCategories';
import ExerciseList from './pages/ExerciseList';
import ExerciseDetail from './pages/ExerciseDetail';
import WorkoutSession from './pages/WorkoutSession';
import MeasurementsPage from './pages/MeasurementsPage';

function App() {
  return (
    <UserProvider>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary'
      }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="workouts" element={<WorkoutCategories />} />
            <Route path="workouts/:category" element={<ExerciseList />} />
            <Route path="exercise/:id" element={<ExerciseDetail />} />
            <Route path="session/:category" element={<WorkoutSession />} />
            <Route path="measurements" element={<MeasurementsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Box>
    </UserProvider>
  );
}

export default App;