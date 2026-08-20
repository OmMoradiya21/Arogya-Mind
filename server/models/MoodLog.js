const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true, enum: ['Angry', 'Sad', 'Anxious', 'Happy', 'Stressed'] },
}, { timestamps: true });

module.exports = mongoose.model('MoodLog', moodLogSchema);
