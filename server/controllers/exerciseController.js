const Exercise = require('../models/Exercise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.mp4', '.webm', '.mov', '.avi'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Get all exercises
exports.getExercises = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    
    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(200).json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new exercise
exports.createExercise = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      subcategory, 
      target_muscles, 
      equipment, 
      difficulty 
    } = req.body;
    
    let video_url = '';
    if (req.file) {
      video_url = `/uploads/videos/${req.file.filename}`;
    }
    
    const newExercise = new Exercise({
      name,
      category,
      subcategory,
      target_muscles: target_muscles ? JSON.parse(target_muscles) : [],
      equipment: equipment ? JSON.parse(equipment) : [],
      difficulty,
      video_url
    });
    
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update exercise
exports.updateExercise = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      subcategory, 
      target_muscles, 
      equipment, 
      difficulty 
    } = req.body;
    
    const updateData = {
      name,
      category,
      subcategory,
      target_muscles: target_muscles ? JSON.parse(target_muscles) : undefined,
      equipment: equipment ? JSON.parse(equipment) : undefined,
      difficulty
    };
    
    if (req.file) {
      updateData.video_url = `/uploads/videos/${req.file.filename}`;
      
      // Delete old video if exists
      const oldExercise = await Exercise.findById(req.params.id);
      if (oldExercise && oldExercise.video_url) {
        const oldVideoPath = path.join(__dirname, '..', oldExercise.video_url);
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }
    }
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );
    
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    res.status(200).json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Delete video file if exists
    if (exercise.video_url) {
      const videoPath = path.join(__dirname, '..', exercise.video_url);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    await Exercise.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
};