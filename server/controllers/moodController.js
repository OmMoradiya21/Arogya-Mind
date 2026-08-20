const MoodLog = require('../models/MoodLog');

exports.addMood = async (req, res) => {
  try {
    const { mood } = req.body;
    const newLog = new MoodLog({ userId: req.user.id, mood });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMoods = async (req, res) => {
  try {
    const logs = await MoodLog.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
