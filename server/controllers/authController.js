const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Progress = require('../models/Progress');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.status(201).json({ success: true, message: 'Account created!', token, user: { id: user._id, username: user.username, email: user.email, selectedLanguage: user.selectedLanguage } });
    } catch (error) {
        console.error('SIGNUP ERROR:', error.message);
        console.error('FULL ERROR:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        const progress = await Progress.findOne({ user: user._id, language: user.selectedLanguage });
        const token = generateToken(user._id);
        res.json({ 
            success: true, 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                selectedLanguage: user.selectedLanguage 
            }, 
            progress: progress ? { 
                currentDay: progress.currentDay, 
                progressPercentage: progress.progressPercentage, 
                streakCount: progress.streakCount, 
                isCompleted: progress.isCompleted 
            } : null 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const html = `<div style="font-family:Arial;max-width:500px;margin:auto;padding:30px"><h2 style="color:#6366f1">🌐 Learn Language — Password Reset</h2><p>Hello <strong>${user.username}</strong>,</p><p>Click below to reset your password. Link expires in 15 minutes.</p><a href="${resetUrl}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a></div>`;
        await sendEmail({ to: user.email, subject: 'Password Reset Request', html });
        res.json({ success: true, message: 'Password reset email sent!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Email could not be sent.' });
    }
};

const resetPassword = async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    try {
        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ success: false, message: 'Token is invalid or expired.' });
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.json({ success: true, message: 'Password reset successful!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

module.exports = { signup, login, forgotPassword, resetPassword, getMe };