import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { UserContext } from '../context/UserContext';
import Navbar from './Navbar';
import ProfileSwitcher from './ProfileSwitcher';

const Layout = () => {
  const { isLoading, error } = useContext(UserContext);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          p: 3
        }}
      >
        <Typography variant="h5" color="error" align="center">
          Error loading app data. Please try again later.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ pb: 7 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ pt: 2 }}>
        {isHomePage && <ProfileSwitcher />}
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;