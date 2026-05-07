const mongoose = require('mongoose');

const TaskItemSchema = new mongoose.Schema({
    taskIndex: { type: Number, required: true },
    word: { type: String, required: true },
    transliteration: { type: String },
    meaning: { type: String },
    exampleSentence: { type: String },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
});

const CurriculumSchema = new mongoose.Schema({
    language: { type: String, required: true },
    day: { type: Number, required: true, min: 1, max: 180 },
    theme: { type: String },
    tasks: [TaskItemSchema],
}, { timestamps: true });

CurriculumSchema.index({ language: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Curriculum', CurriculumSchema);