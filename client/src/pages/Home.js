import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import { 
  FitnessCenter as WorkoutIcon,
  DirectionsRun as CardioIcon,
  MonitorWeight as WeightIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { getUserWorkouts } from '../services/api';
import { format } from 'date-fns';

const categoryIcons = {
  Push: <WorkoutIcon />,
  Pull: <WorkoutIcon />,
  Legs: <WorkoutIcon />,
  Cardio: <CardioIcon />
};

const Home = () => {
  const navigate = useNavigate();
  const { activeUser } = useContext(UserContext);
  
  // Fetch recent workouts
  const { data: recentWorkouts, isLoading } = useQuery(
    ['recentWorkouts', activeUser?._id],
    () => getUserWorkouts({ userId: activeUser?._id, limit: 5 }),
    {
      enabled: !!activeUser,
      staleTime: 60000 // 1 minute
    }
  );
  
  const handleCategoryClick = (category) => {
    navigate(`/workouts/${category}`);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Workout Categories */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" component="h2" gutterBottom>
            Workout Categories
          </Typography>
          <Grid container spacing={2}>
            {['Push', 'Pull', 'Legs', 'Cardio'].map((category) => (
              <Grid item xs={6} key={category}>
                <Card 
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CardActionArea onClick={() => handleCategoryClick(category)}>
                    <CardContent sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      py: 3
                    }}>
                      <Box sx={{ mb: 1, color: 'primary.main' }}>
                        {categoryIcons[category]}
                      </Box>
                      <Typography variant="h6" component="div">
                        {category}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Quick Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center'
                }}>
                  <WeightIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                  <Typography variant="h6">
                    -- kg
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center'
                }}>
                  <TodayIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Last Workout
                  </Typography>
                  <Typography variant="h6">
                    {recentWorkouts && recentWorkouts.length > 0 
                      ? format(new Date(recentWorkouts[0].date), 'MMM d')
                      : '--'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Recent Activity
          </Typography>
          <Card>
            <CardContent>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : recentWorkouts && recentWorkouts.length > 0 ? (
                <List disablePadding>
                  {recentWorkouts.map((workout, index) => (
                    <React.Fragment key={workout._id}>
                      <ListItem 
                        button 
                        onClick={() => navigate(`/session/${workout.category}`, { state: { workoutId: workout._id } })}
                      >
                        <ListItemIcon>
                          {categoryIcons[workout.category]}
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${workout.category} Workout`} 
                          secondary={format(new Date(workout.date), 'MMMM d, yyyy')}
                        />
                      </ListItem>
                      {index < recentWorkouts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" align="center" sx={{ py: 2 }}>
                  No recent workouts found
                </Typography>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Home;