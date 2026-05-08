const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, async (req, res) => {
    res.json({ success: true, user: req.user });
});

router.put('/update', protect, async (req, res) => {
    try {
        const fieldsToUpdate = {
            username: req.body.username,
            email: req.body.email,
            bio: req.body.bio,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            role: req.body.role,
            streak: req.body.streak,
            xp: req.body.xp,
            achievements: req.body.achievements,
            themeMode: req.body.themeMode,
            themeColor: req.body.themeColor,
            fontSize: req.body.fontSize,
            volume: req.body.volume,
            voiceSpeed: req.body.voiceSpeed,
            soundEffectsEnabled: req.body.soundEffectsEnabled,
            captionsEnabled: req.body.captionsEnabled,
            autoUpdatesEnabled: req.body.autoUpdatesEnabled,
            region: req.body.region,
            appLanguage: req.body.appLanguage,
            selectedLanguage: req.body.selectedLanguage,
            lastActivityDate: req.body.lastActivityDate,
            isActive: req.body.isActive
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

        const user = await User.findByIdAndUpdate(
            req.user._id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

router.post('/change-password', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!req.body.currentPassword || !req.body.newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide current and new password' });
        }
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }
        user.password = req.body.newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

router.delete('/', protect, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isActive: false });
        res.json({ success: true, message: 'Account deactivated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;