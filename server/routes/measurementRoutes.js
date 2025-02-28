const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

// GET all measurements for a user
router.get('/user/:userId', measurementController.getUserMeasurements);

// GET measurement by ID
router.get('/:id', measurementController.getMeasurementById);

// CREATE new measurement
router.post('/', measurementController.createMeasurement);

// UPDATE measurement
router.put('/:id', measurementController.updateMeasurement);

// DELETE measurement
router.delete('/:id', measurementController.deleteMeasurement);

// GET measurement statistics
router.get('/user/:userId/stats', measurementController.getMeasurementStats);

module.exports = router;