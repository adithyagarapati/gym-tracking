import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  CardMedia
} from '@mui/material';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Push',
    description: 'Chest, Shoulders, Triceps',
    image: '/images/push-workout.jpg'
  },
  {
    name: 'Pull',
    description: 'Back, Biceps, Rear Delts',
    image: '/images/pull-workout.jpg'
  },
  {
    name: 'Legs',
    description: 'Quads, Hamstrings, Calves',
    image: '/images/legs-workout.jpg'
  },
  {
    name: 'Cardio',
    description: 'Endurance, HIIT, Conditioning',
    image: '/images/cardio-workout.jpg'
  }
];

const WorkoutCategories = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (category) => {
    navigate(`/workouts/${category}`);
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Choose Workout Category
      </Typography>
      
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} key={category.name}>
            <Card 
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardActionArea onClick={() => handleCategoryClick(category.name)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WorkoutCategories;