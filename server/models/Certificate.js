const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    language: { type: String, required: true },
    completedAt: { type: Date, default: Date.now },
    certificateId: {
        type: String,
        unique: true,
        default: () => `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);