const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  currentDay: { type: Number, default: 1 },
  completedActivities: { type: Map, of: [Number], default: {} }, // Day -> Array of Activity Indices
  completedDays: [{ type: Number }], // Array of completed day numbers (1-14)
  streakCount: { type: Number, default: 0 },
  lastActivityDate: { type: Date },
  progressPercentage: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

ProgressSchema.methods.calculateProgress = function() {
  const totalActivities = 14 * 10;
  let completedCount = 0;
  for (let [, activities] of this.completedActivities) {
    completedCount += activities.length;
  }
  this.progressPercentage = Math.round((completedCount / totalActivities) * 100);
};

module.exports = mongoose.model('Progress', ProgressSchema);