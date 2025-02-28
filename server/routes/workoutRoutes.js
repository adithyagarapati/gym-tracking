const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// GET all workouts for a user
router.get('/user/:userId', workoutController.getUserWorkouts);

// GET workout by ID
router.get('/:id', workoutController.getWorkoutById);

// CREATE new workout
router.post('/', workoutController.createWorkout);

// UPDATE workout
router.put('/:id', workoutController.updateWorkout);

// DELETE workout
router.delete('/:id', workoutController.deleteWorkout);

// GET max weights for exercises by user
router.get('/user/:userId/max-weights', workoutController.getMaxWeights);

module.exports = router;