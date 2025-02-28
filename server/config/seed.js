const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exercise = require('../models/Exercise');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed Users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create predefined users
    const users = await User.insertMany([
      {
        name: 'Adithya',
        profile_image: '/images/adithya.jpg',
      },
      {
        name: 'Harsha',
        profile_image: '/images/harsha.jpg',
      }
    ]);
    
    console.log('Users seeded successfully');
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed exercises with the specified exercises list
const seedExercises = async () => {
  try {
    // Clear existing exercises
    await Exercise.deleteMany({});
    
    // Push exercises
    const pushExercises = [
      {
        name: 'Incline Dumbell Press',
        category: 'Push',
        subcategory: 'Chest',
        target_muscles: ['Upper Chest', 'Shoulders', 'Triceps'],
        equipment: ['Dumbbells', 'Incline Bench'],
        difficulty: 'Intermediate',
        video_url: '/videos/incline-dumbbell-press.mp4',
      },
      {
        name: 'Chest Fly Machine',
        category: 'Push',
        subcategory: 'Chest',
        target_muscles: ['Chest', 'Shoulders'],
        equipment: ['Fly Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/chest-fly-machine.mp4',
      },
      {
        name: 'Chest Press',
        category: 'Push',
        subcategory: 'Chest',
        target_muscles: ['Chest', 'Shoulders', 'Triceps'],
        equipment: ['Chest Press Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/chest-press.mp4',
      },
      {
        name: 'Shoulder Raises Machine',
        category: 'Push',
        subcategory: 'Shoulders',
        target_muscles: ['Shoulders', 'Trapezius'],
        equipment: ['Shoulder Press Machine'],
        difficulty: 'Intermediate',
        video_url: '/videos/shoulder-raises-machine.mp4',
      },
      {
        name: 'Shoulder Lateral Raises Machine',
        category: 'Push',
        subcategory: 'Shoulders',
        target_muscles: ['Lateral Deltoids'],
        equipment: ['Lateral Raise Machine'],
        difficulty: 'Intermediate',
        video_url: '/videos/shoulder-lateral-raises-machine.mp4',
      },
      {
        name: 'Tricep Overhead Extensions',
        category: 'Push',
        subcategory: 'Triceps',
        target_muscles: ['Triceps'],
        equipment: ['Dumbbells', 'Cable Machine'],
        difficulty: 'Intermediate',
        video_url: '/videos/tricep-overhead-extensions.mp4',
      },
      {
        name: 'Tricep Pull Downs',
        category: 'Push',
        subcategory: 'Triceps',
        target_muscles: ['Triceps'],
        equipment: ['Cable Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/tricep-pull-downs.mp4',
      }
    ];
    
    // Pull exercises
    const pullExercises = [
      {
        name: 'Pull-ups',
        category: 'Pull',
        subcategory: 'Back',
        target_muscles: ['Lats', 'Biceps', 'Upper Back'],
        equipment: ['Pull-up Bar'],
        difficulty: 'Advanced',
        video_url: '/videos/pull-ups.mp4',
      },
      {
        name: 'Lat Pulldowns',
        category: 'Pull',
        subcategory: 'Back',
        target_muscles: ['Lats', 'Biceps'],
        equipment: ['Lat Pulldown Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/lat-pulldowns.mp4',
      },
      {
        name: 'Dumbell Rows',
        category: 'Pull',
        subcategory: 'Back',
        target_muscles: ['Middle Back', 'Lats', 'Biceps'],
        equipment: ['Dumbbells', 'Bench'],
        difficulty: 'Intermediate',
        video_url: '/videos/dumbbell-rows.mp4',
      },
      {
        name: 'Chest Supported Cable Rows',
        category: 'Pull',
        subcategory: 'Back',
        target_muscles: ['Middle Back', 'Lats', 'Rear Deltoids'],
        equipment: ['Cable Machine', 'Bench'],
        difficulty: 'Intermediate',
        video_url: '/videos/chest-supported-cable-rows.mp4',
      },
      {
        name: 'Bicep Preacher Curls',
        category: 'Pull',
        subcategory: 'Biceps',
        target_muscles: ['Biceps'],
        equipment: ['Preacher Curl Bench', 'Barbell or EZ Bar'],
        difficulty: 'Intermediate',
        video_url: '/videos/bicep-preacher-curls.mp4',
      },
      {
        name: 'Hammer Curls',
        category: 'Pull',
        subcategory: 'Biceps',
        target_muscles: ['Biceps', 'Forearms'],
        equipment: ['Dumbbells'],
        difficulty: 'Beginner',
        video_url: '/videos/hammer-curls.mp4',
      },
      {
        name: 'Face Pulls',
        category: 'Pull',
        subcategory: 'Rear Delts',
        target_muscles: ['Rear Deltoids', 'Trapezius', 'Rotator Cuff'],
        equipment: ['Cable Machine', 'Rope Attachment'],
        difficulty: 'Intermediate',
        video_url: '/videos/face-pulls.mp4',
      },
      {
        name: 'Reverse Flyes',
        category: 'Pull',
        subcategory: 'Rear Delts',
        target_muscles: ['Rear Deltoids', 'Upper Back'],
        equipment: ['Dumbbells', 'Reverse Fly Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/reverse-flyes.mp4',
      }
    ];
    
    // Legs exercises
    const legsExercises = [
      {
        name: 'Squats',
        category: 'Legs',
        subcategory: 'Quads',
        target_muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
        equipment: ['Barbell', 'Squat Rack'],
        difficulty: 'Intermediate',
        video_url: '/videos/squats.mp4',
      },
      {
        name: 'Leg Press',
        category: 'Legs',
        subcategory: 'Quads',
        target_muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: ['Leg Press Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/leg-press.mp4',
      },
      {
        name: 'Leg Extensions',
        category: 'Legs',
        subcategory: 'Quads',
        target_muscles: ['Quadriceps'],
        equipment: ['Leg Extension Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/leg-extensions.mp4',
      },
      {
        name: 'Lunges',
        category: 'Legs',
        subcategory: 'Quads',
        target_muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
        equipment: ['Dumbbells', 'Bodyweight'],
        difficulty: 'Intermediate',
        video_url: '/videos/lunges.mp4',
      },
      {
        name: 'Goblet Squats',
        category: 'Legs',
        subcategory: 'Quads',
        target_muscles: ['Quadriceps', 'Glutes', 'Core'],
        equipment: ['Kettlebell', 'Dumbbell'],
        difficulty: 'Beginner',
        video_url: '/videos/goblet-squats.mp4',
      },
      {
        name: 'Romanian Deadlift',
        category: 'Legs',
        subcategory: 'Hamstrings',
        target_muscles: ['Hamstrings', 'Glutes', 'Lower Back'],
        equipment: ['Barbell', 'Dumbbells'],
        difficulty: 'Intermediate',
        video_url: '/videos/romanian-deadlift.mp4',
      },
      {
        name: 'Leg Curls',
        category: 'Legs',
        subcategory: 'Hamstrings',
        target_muscles: ['Hamstrings'],
        equipment: ['Leg Curl Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/leg-curls.mp4',
      },
      {
        name: 'Standing Calf Raises',
        category: 'Legs',
        subcategory: 'Calves',
        target_muscles: ['Calves'],
        equipment: ['Calf Raise Machine', 'Smith Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/standing-calf-raises.mp4',
      }
    ];
    
    // Cardio exercises
    const cardioExercises = [
      {
        name: 'Treadmill',
        category: 'Cardio',
        subcategory: 'Indoor',
        target_muscles: ['Heart', 'Legs', 'Core'],
        equipment: ['Treadmill'],
        difficulty: 'Beginner',
        video_url: '/videos/treadmill.mp4',
      },
      {
        name: 'Elliptical',
        category: 'Cardio',
        subcategory: 'Indoor',
        target_muscles: ['Heart', 'Full Body'],
        equipment: ['Elliptical Machine'],
        difficulty: 'Beginner',
        video_url: '/videos/elliptical.mp4',
      },
      {
        name: 'Stationary Bike',
        category: 'Cardio',
        subcategory: 'Indoor',
        target_muscles: ['Heart', 'Legs'],
        equipment: ['Stationary Bike'],
        difficulty: 'Beginner',
        video_url: '/videos/stationary-bike.mp4',
      },
      {
        name: 'Burpees',
        category: 'Cardio',
        subcategory: 'HIIT',
        target_muscles: ['Full Body', 'Heart'],
        equipment: ['Bodyweight'],
        difficulty: 'Advanced',
        video_url: '/videos/burpees.mp4',
      },
      {
        name: 'Jumping Jacks',
        category: 'Cardio',
        subcategory: 'HIIT',
        target_muscles: ['Heart', 'Shoulders', 'Legs'],
        equipment: ['Bodyweight'],
        difficulty: 'Beginner',
        video_url: '/videos/jumping-jacks.mp4',
      },
      {
        name: 'Skips',
        category: 'Cardio',
        subcategory: 'HIIT',
        target_muscles: ['Heart', 'Legs', 'Calves'],
        equipment: ['Jump Rope'],
        difficulty: 'Intermediate',
        video_url: '/videos/skips.mp4',
      }
    ];
    
    // Insert all exercises
    await Exercise.insertMany([
      ...pushExercises,
      ...pullExercises,
      ...legsExercises,
      ...cardioExercises
    ]);
    
    console.log('Exercises seeded successfully');
  } catch (error) {
    console.error('Error seeding exercises:', error);
    throw error;
  }
};

// Run the seeding
const seedDatabase = async () => {
  try {
    await seedUsers();
    await seedExercises();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();