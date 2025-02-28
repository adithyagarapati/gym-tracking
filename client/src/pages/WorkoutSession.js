import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  IconButton,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon,
  Remove as RemoveIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { 
  getExercises, 
  getWorkoutById, 
  createWorkout, 
  updateWorkout 
} from '../services/api';

const WorkoutSession = () => {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeUser } = useContext(UserContext);
  
  const workoutId = location.state?.workoutId;
  const isEditMode = !!workoutId;
  
  // State for workout data
  const [exercises, setExercises] = useState([]);
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Fetch exercises for the category
  const { data: availableExercises, isLoading: loadingExercises } = useQuery(
    ['exercises', category],
    () => getExercises({ category }),
    {
      staleTime: 300000 // 5 minutes
    }
  );
  
  // Fetch workout if in edit mode
  const { data: existingWorkout, isLoading: loadingWorkout } = useQuery(
    ['workout', workoutId],
    () => getWorkoutById(workoutId),
    {
      enabled: isEditMode,
      staleTime: 60000, // 1 minute
      onSuccess: (data) => {
        if (data) {
          setExercises(data.exercises.map(ex => ({
            exercise_id: ex.exercise_id._id,
            name: ex.exercise_id.name,
            sets: ex.sets.map(set => ({
              set_number: set.set_number,
              weight: set.weight,
              reps: set.reps,
              completed: set.completed
            }))
          })));
        }
      }
    }
  );
  
  // Create workout mutation
  const createWorkoutMutation = useMutation(createWorkout, {
    onSuccess: () => {
      queryClient.invalidateQueries(['recentWorkouts', activeUser?._id]);
      setSnackbar({
        open: true,
        message: 'Workout saved successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/'), 1500);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error saving workout: ${error.message}`,
        severity: 'error'
      });
    }
  });
  
  // Update workout mutation
  const updateWorkoutMutation = useMutation(
    (data) => updateWorkout({ id: workoutId, workoutData: data }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recentWorkouts', activeUser?._id]);
        queryClient.invalidateQueries(['workout', workoutId]);
        setSnackbar({
          open: true,
          message: 'Workout updated successfully!',
          severity: 'success'
        });
        setTimeout(() => navigate('/'), 1500);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error updating workout: ${error.message}`,
          severity: 'error'
        });
      }
    }
  );
  
  // Add exercise to workout
  const handleAddExercise = (exercise) => {
    setExercises([
      ...exercises,
      {
        exercise_id: exercise._id,
        name: exercise.name,
        sets: [
          { set_number: 1, weight: 0, reps: 0, completed: false },
          { set_number: 2, weight: 0, reps: 0, completed: false },
          { set_number: 3, weight: 0, reps: 0, completed: false }
        ]
      }
    ]);
    setOpenExerciseDialog(false);
  };
  
  // Remove exercise from workout
  const handleRemoveExercise = (index) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };
  
  // Update set data
  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = field === 'completed' 
      ? value 
      : Number(value);
    setExercises(updatedExercises);
  };
  
  // Save workout
  const handleSaveWorkout = () => {
    if (!activeUser) {
      setSnackbar({
        open: true,
        message: 'Please select a user profile first',
        severity: 'error'
      });
      return;
    }
    
    if (exercises.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one exercise',
        severity: 'error'
      });
      return;
    }
    
    const workoutData = {
      user_id: activeUser._id,
      category,
      exercises: exercises.map(ex => ({
        exercise_id: ex.exercise_id,
        sets: ex.sets
      }))
    };
    
    if (isEditMode) {
      updateWorkoutMutation.mutate(workoutData);
    } else {
      createWorkoutMutation.mutate(workoutData);
    }
  };
  
  // View exercise details
  const handleViewExercise = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };
  
  // Loading state
  if ((isEditMode && loadingWorkout) || loadingExercises) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 2, pb: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit' : 'New'} {category} Workout
      </Typography>
      
      {/* Exercise list */}
      {exercises.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          {exercises.map((exercise, exerciseIndex) => (
            <Accordion 
              key={`${exercise.exercise_id}-${exerciseIndex}`}
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exerciseIndex * 0.1 }}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <Typography>{exercise.name}</Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewExercise(exercise.exercise_id);
                      }}
                    >
                      <VideocamIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExercise(exerciseIndex);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ width: '33%', textAlign: 'center' }}>
                        Set
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ width: '33%', textAlign: 'center' }}>
                        Weight (kg)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ width: '33%', textAlign: 'center' }}>
                        Reps
                      </Typography>
                    </Box>
                    <Divider />
                  </Grid>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <Grid item xs={12} key={`set-${setIndex}`}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ width: '33%', textAlign: 'center' }}>
                          {set.set_number}
                        </Typography>
                        <TextField
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                          InputProps={{ inputProps: { min: 0, step: 2.5 } }}
                          size="small"
                          sx={{ width: '30%' }}
                        />
                        <TextField
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                          InputProps={{ inputProps: { min: 0 } }}
                          size="small"
                          sx={{ width: '30%' }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Card sx={{ mb: 3, p: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No exercises added yet
          </Typography>
        </Card>
      )}
      
      {/* Add exercise button */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpenExerciseDialog(true)}
        fullWidth
        sx={{ mb: 3 }}
      >
        Add Exercise
      </Button>
      
      {/* Save workout button */}
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        onClick={handleSaveWorkout}
        fullWidth
        disabled={exercises.length === 0 || createWorkoutMutation.isLoading || updateWorkoutMutation.isLoading}
      >
        {createWorkoutMutation.isLoading || updateWorkoutMutation.isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Save ${category} Workout`
        )}
      </Button>
      
      {/* Exercise selection dialog */}
      <Dialog 
        open={openExerciseDialog} 
        onClose={() => setOpenExerciseDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select Exercise</DialogTitle>
        <DialogContent dividers>
          {availableExercises && availableExercises.length > 0 ? (
            <List>
              {availableExercises.map((exercise) => (
                <ListItem 
                  button 
                  key={exercise._id}
                  onClick={() => handleAddExercise(exercise)}
                  disabled={exercises.some(ex => ex.exercise_id === exercise._id)}
                >
                  <ListItemText 
                    primary={exercise.name} 
                    secondary={exercise.subcategory}
                  />
                  {exercises.some(ex => ex.exercise_id === exercise._id) ? (
                    <Chip label="Added" size="small" color="primary" />
                  ) : (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleAddExercise(exercise)}>
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 2 }}>
              No exercises available for this category
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExerciseDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WorkoutSession;