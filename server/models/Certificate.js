const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    language: { type: String, required: true },
    certificateType: { 
        type: String, 
        enum: ['Daily', 'Progress', 'Final'], 
        required: true 
    },
    rank: {
        type: String,
        enum: ['Gold', 'Silver', 'Bronze', 'None'],
        default: 'None'
    },
    dayCompleted: { type: Number }, // For Daily type
    completionPercentage: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    certificateId: {
        type: String,
        unique: true,
        default: () => `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
}, { timestamps: true });

// Compound index to ensure uniqueness per user per language per type/day/percentage
// This ensures that 'Progress' certificates for different milestones (25%, 50%, etc.) don't collide.
CertificateSchema.index({ user: 1, language: 1, certificateType: 1, dayCompleted: 1, completionPercentage: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', CertificateSchema);