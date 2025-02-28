const Workout = require('../models/Workout');

// Get all workouts for a user
exports.getWorkoutsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await Workout.find({ user_id: userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a workout by ID
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new workout
exports.createWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a workout
exports.updateWorkout = async (req, res) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get max weights for exercises by user
exports.getMaxWeightsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const maxWeights = await Workout.aggregate([
      { $match: { user_id: userId } },
      { $unwind: '$exercises' },
      {
        $group: {
          _id: '$exercises.exercise_id',
          maxWeight: { $max: '$exercises.sets.weight' }
        }
      }
    ]);
    
    res.json(maxWeights);
  } catch (error) {
    console.error('Error fetching max weights:', error);
    res.status(500).json({ message: 'Server error' });
  }
};