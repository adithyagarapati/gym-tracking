// Get max weights for exercises by user
exports.getMaxWeights = async (req, res) => {
  try {
    const { userId } = req.params;
    const { exerciseId, startDate, endDate } = req.query;
    
    let matchQuery = { user_id: mongoose.Types.ObjectId(userId) };
    
    if (exerciseId) {
      matchQuery['exercises.exercise_id'] = mongoose.Types.ObjectId(exerciseId);
    }
    
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    
    const maxWeights = await Workout.aggregate([
      { $match: matchQuery },
      { $unwind: '$exercises' },
      { $unwind: '$exercises.sets' },
      {
        $group: {
          _id: {
            exercise_id: '$exercises.exercise_id',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          maxWeight: { $max: '$exercises.sets.weight' }
        }
      },
      {
        $sort: { '_id.date': 1 }
      },
      {
        $group: {
          _id: '$_id.exercise_id',
          weightData: {
            $push: {
              date: '$_id.date',
              weight: '$maxWeight'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'exercises',
          localField: '_id',
          foreignField: '_id',
          as: 'exercise'
        }
      },
      {
        $project: {
          _id: 1,
          exercise: { $arrayElemAt: ['$exercise', 0] },
          weightData: 1
        }
      }
    ]);
    
    res.status(200).json(maxWeights);
  } catch (error) {
    console.error('Error fetching max weights:', error);
    res.status(500).json({ message: 'Server error' });
  }
};