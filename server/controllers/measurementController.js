const Measurement = require('../models/Measurement');

// Get all measurements for a user
exports.getUserMeasurements = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, limit } = req.query;
    
    let query = { user_id: userId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) };
    }
    
    let measurementsQuery = Measurement.find(query).sort({ date: -1 });
    
    if (limit) {
      measurementsQuery = measurementsQuery.limit(parseInt(limit));
    }
    
    const measurements = await measurementsQuery;
    
    res.status(200).json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get measurement by ID
exports.getMeasurementById = async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    
    res.status(200).json(measurement);
  } catch (error) {
    console.error('Error fetching measurement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new measurement
exports.createMeasurement = async (req, res) => {
  try {
    const { user_id, date, weight, body_fat } = req.body;
    
    const newMeasurement = new Measurement({
      user_id,
      date: date || new Date(),
      weight,
      body_fat
    });
    
    const savedMeasurement = await newMeasurement.save();
    res.status(201).json(savedMeasurement);
  } catch (error) {
    console.error('Error creating measurement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update measurement
exports.updateMeasurement = async (req, res) => {
  try {
    const { date, weight, body_fat } = req.body;
    
    const updateData = {};
    if (date) updateData.date = new Date(date);
    if (weight !== undefined) updateData.weight = weight;
    if (body_fat !== undefined) updateData.body_fat = body_fat;
    
    const updatedMeasurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedMeasurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    
    res.status(200).json(updatedMeasurement);
  } catch (error) {
    console.error('Error updating measurement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete measurement
exports.deleteMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndDelete(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    
    res.status(200).json({ message: 'Measurement deleted successfully' });
  } catch (error) {
    console.error('Error deleting measurement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get measurement statistics
exports.getMeasurementStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period } = req.query;
    
    let groupFormat;
    let dateRange = {};
    
    const now = new Date();
    
    // Set date range and group format based on period
    if (period === 'weekly') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      dateRange = { $gte: weekAgo };
      groupFormat = '%Y-%m-%d';
    } else if (period === 'monthly') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      dateRange = { $gte: monthAgo };
      groupFormat = '%Y-%m-%d';
    } else if (period === 'yearly') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      dateRange = { $gte: yearAgo };
      groupFormat = '%Y-%m';
    } else {
      // Default to all time with monthly grouping
      groupFormat = '%Y-%m';
    }
    
    const stats = await Measurement.aggregate([
      { 
        $match: { 
          user_id: mongoose.Types.ObjectId(userId),
          ...(Object.keys(dateRange).length > 0 ? { date: dateRange } : {})
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$date' } },
          avgWeight: { $avg: '$weight' },
          minWeight: { $min: '$weight' },
          maxWeight: { $max: '$weight' },
          avgBodyFat: { $avg: '$body_fat' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching measurement stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};