import React, { useContext } from 'react';
import { Box, Card, Avatar, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';

const ProfileSwitcher = () => {
  const { activeUser, setActiveUser, users } = useContext(UserContext);

  if (!users || users.length === 0) return null;

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        width: '100%',
        overflowX: 'auto',
        py: 2,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {users.map((user) => (
        <Card
          key={user._id}
          onClick={() => setActiveUser(user)}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            p: 2,
            minWidth: 160,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            border: activeUser?._id === user._id ? 2 : 0,
            borderColor: 'primary.main',
            boxShadow: activeUser?._id === user._id 
              ? '0 0 15px rgba(144, 202, 249, 0.5)' 
              : 'none',
            backgroundColor: activeUser?._id === user._id 
              ? 'rgba(144, 202, 249, 0.08)' 
              : 'background.paper',
          }}
        >
          <Avatar
            src={user.profile_image}
            alt={user.name}
            sx={{ 
              width: 64, 
              height: 64,
              border: activeUser?._id === user._id ? 2 : 0,
              borderColor: 'primary.main',
            }}
          />
          <Typography variant="h6" component="h2" align="center">
            {user.name}
          </Typography>
          {activeUser?._id === user._id && (
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: 'primary.main' 
              }}
            />
          )}
        </Card>
      ))}
    </Stack>
  );
};

export default ProfileSwitcher;