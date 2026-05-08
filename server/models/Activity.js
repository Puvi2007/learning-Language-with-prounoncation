const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    language: { type: String, required: true },
    day: { type: Number, required: true, min: 1, max: 14 },
    activityType: { 
        type: String, 
        enum: ['pronunciation', 'matching', 'listening', 'repeat', 'fill-in-the-blank'], 
        required: true 
    },
    word: { type: String, required: true }, // Display word (Transliteration)
    nativeWord: { type: String }, // Native script (e.g. வணக்கம்)
    meaning: { type: String, required: true },
    pronunciation: { type: String }, // Optional: link to audio
    transliteration: { type: String },
    exampleSentence: { type: String },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
}, { timestamps: true });

ActivitySchema.index({ language: 1, day: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
