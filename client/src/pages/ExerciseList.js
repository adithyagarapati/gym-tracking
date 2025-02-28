import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getExercises } from '../services/api';

const ExerciseList = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState('all');
  
  // Fetch exercises for the selected category
  const { data: exercises, isLoading } = useQuery(
    ['exercises', category],
    () => getExercises({ category }),
    {
      staleTime: 300000 // 5 minutes
    }
  );
  
  // Get unique subcategories
  const subcategories = exercises 
    ? ['all', ...new Set(exercises.map(ex => ex.subcategory))]
    : ['all'];
  
  const handleSubcategoryChange = (event, newValue) => {
    setSubcategory(newValue);
  };
  
  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };
  
  const handleStartWorkout = () => {
    navigate(`/session/${category}`);
  };
  
  // Filter exercises by subcategory
  const filteredExercises = exercises && subcategory !== 'all'
    ? exercises.filter(ex => ex.subcategory === subcategory)
    : exercises;
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {category} Exercises
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Subcategory tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={subcategory} 
              onChange={handleSubcategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {subcategories.map(sub => (
                <Tab 
                  key={sub} 
                  label={sub === 'all' ? 'All' : sub} 
                  value={sub} 
                />
              ))}
            </Tabs>
          </Box>
          
          {/* Exercise list */}
          {filteredExercises && filteredExercises.length > 0 ? (
            <List>
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListItem button onClick={() => handleExerciseClick(exercise._id)}>
                    <ListItemText 
                      primary={exercise.name} 
                      secondary={`${exercise.subcategory} • ${exercise.difficulty}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleExerciseClick(exercise._id)}>
                        <ChevronRightIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredExercises.length - 1 && <Divider />}
                </motion.div>
              ))}
            </List>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              No exercises found for this category
            </Typography>
          )}
          
          {/* Start workout button */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleStartWorkout}
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start {category} Workout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ExerciseList;