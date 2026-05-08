const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    
    // Profile
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    
    // Gamification
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    achievements: [{ type: String }],
    
    // Settings
    themeMode: { type: String, enum: ['dark', 'light'], default: 'dark' },
    themeColor: { type: String, default: '#8b5cf6' },
    fontSize: { type: String, enum: ['Small', 'Medium', 'Large', 'Extra Large'], default: 'Medium' },
    
    // Audio
    volume: { type: Number, default: 80 },
    voiceSpeed: { type: String, enum: ['Slow', 'Normal', 'Fast'], default: 'Normal' },
    soundEffectsEnabled: { type: Boolean, default: true },
    
    // Accessibility & System
    captionsEnabled: { type: Boolean, default: false },
    autoUpdatesEnabled: { type: Boolean, default: true },
    region: { type: String, default: 'India' },
    appLanguage: { type: String, default: 'Tamil' },

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    selectedLanguage: { type: String, enum: ['Tamil', 'Telugu'], required: false },
    lastActivityDate: { type: Date },
    isActive: { type: Boolean, default: true },
    activityHistory: [{
        date: { type: String }, // YYYY-MM-DD
        count: { type: Number, default: 0 }
    }]
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
