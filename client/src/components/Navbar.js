import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import { 
  Home as HomeIcon,
  FitnessCenter as WorkoutIcon,
  MonitorWeight as MeasurementsIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(() => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.includes('/workouts') || path.includes('/exercise') || path.includes('/session')) return 1;
    if (path.includes('/measurements')) return 2;
    return 0;
  });
  
  const isHomePage = location.pathname === '/';
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/workouts');
        break;
      case 2:
        navigate('/measurements');
        break;
      default:
        navigate('/');
    }
  };
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Gym Tracker';
    if (path === '/workouts') return 'Workout Categories';
    if (path.includes('/workouts/Push')) return 'Push Exercises';
    if (path.includes('/workouts/Pull')) return 'Pull Exercises';
    if (path.includes('/workouts/Legs')) return 'Legs Exercises';
    if (path.includes('/workouts/Cardio')) return 'Cardio Exercises';
    if (path.includes('/exercise/')) return 'Exercise Details';
    if (path.includes('/session/Push')) return 'Push Workout';
    if (path.includes('/session/Pull')) return 'Pull Workout';
    if (path.includes('/session/Legs')) return 'Legs Workout';
    if (path.includes('/session/Cardio')) return 'Cardio Workout';
    if (path.includes('/measurements')) return 'Body Measurements';
    
    return 'Gym Tracker';
  };
  
  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {!isHomePage && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
              component={motion.button}
              whileTap={{ scale: 0.9 }}
            >
              <BackIcon />
            </IconButton>
          )}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flexGrow: 1 }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1 }}
            >
              {getPageTitle()}
            </Typography>
          </motion.div>
        </Toolbar>
      </AppBar>
      
      <Paper 
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} 
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Workouts" icon={<WorkoutIcon />} />
          <BottomNavigationAction label="Measurements" icon={<MeasurementsIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Navbar;