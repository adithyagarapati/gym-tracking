const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Get all workouts for a user
router.get('/user/:userId', workoutController.getWorkoutsByUser);

// Get a workout by ID
router.get('/:id', workoutController.getWorkoutById);

// Create a new workout
router.post('/', workoutController.createWorkout);

// Update a workout
router.put('/:id', workoutController.updateWorkout);

// Delete a workout
router.delete('/:id', workoutController.deleteWorkout);

// Get max weights for exercises by user
router.get('/max-weights/:userId', workoutController.getMaxWeightsByUser);

module.exports = router;