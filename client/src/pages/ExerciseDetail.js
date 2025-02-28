import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Chip,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import { 
  FitnessCenter as EquipmentIcon,
  SportsHandball as MuscleIcon,
  Speed as DifficultyIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getExerciseById } from '../services/api';

const ExerciseDetail = () => {
  const { id } = useParams();
  
  // Fetch exercise details
  const { data: exercise, isLoading } = useQuery(
    ['exercise', id],
    () => getExerciseById(id),
    {
      staleTime: 300000 // 5 minutes
    }
  );
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!exercise) {
    return (
      <Typography variant="h6" align="center" sx={{ py: 4 }}>
        Exercise not found
      </Typography>
    );
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          {exercise.name}
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={exercise.category} color="primary" size="small" />
          <Chip label={exercise.subcategory} size="small" />
          <Chip label={exercise.difficulty} size="small" />
        </Box>
        
        {/* Video player */}
        {exercise.video_url && (
          <Card sx={{ mb: 3 }}>
            <video
              controls
              width="100%"
              poster="/images/video-placeholder.jpg"
              style={{ borderRadius: '12px 12px 0 0' }}
            >
              <source src={`http://localhost:5000${exercise.video_url}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Card>
        )}
        
        {/* Exercise details */}
        <Card>
          <CardContent>
            <List disablePadding>
              {/* Target muscles */}
              <ListItem>
                <ListItemIcon>
                  <MuscleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Target Muscles"
                  secondary={exercise.target_muscles.join(', ')}
                />
              </ListItem>
              
              <Divider component="li" />
              
              {/* Equipment */}
              <ListItem>
                <ListItemIcon>
                  <EquipmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Equipment"
                  secondary={exercise.equipment.join(', ')}
                />
              </ListItem>
              
              <Divider component="li" />
              
              {/* Difficulty */}
              <ListItem>
                <ListItemIcon>
                  <DifficultyIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Difficulty"
                  secondary={exercise.difficulty}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
        
        {/* Instructions or tips could be added here in future phases */}
      </motion.div>
    </Box>
  );
};

export default ExerciseDetail;