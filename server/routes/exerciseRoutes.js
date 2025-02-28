const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

// GET all exercises
router.get('/', exerciseController.getExercises);

// GET exercise by ID
router.get('/:id', exerciseController.getExerciseById);

// CREATE new exercise
router.post('/', exerciseController.upload.single('video'), exerciseController.createExercise);

// UPDATE exercise
router.put('/:id', exerciseController.upload.single('video'), exerciseController.updateExercise);

// DELETE exercise
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;