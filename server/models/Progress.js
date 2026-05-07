const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  currentDay: { type: Number, default: 1 },
  completedTasks: { type: Map, of: [Number], default: {} },
  completedDays: [{ type: Number }],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date },
  overallProgress: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

ProgressSchema.methods.calculateProgress = function() {
  const totalTasks = 180 * 10;
  let completedCount = 0;
  for (let [, tasks] of this.completedTasks) {
    completedCount += tasks.length;
  }
  this.overallProgress = Math.round((completedCount / totalTasks) * 100);
};

module.exports = mongoose.model('Progress', ProgressSchema);