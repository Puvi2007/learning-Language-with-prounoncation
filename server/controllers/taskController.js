const Curriculum = require('../models/Curriculum');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

const getDayTasks = async (req, res) => {
    const { language, day } = req.params;
    const dayNum = parseInt(day);
    const userId = req.user._id;
    try {
        if (dayNum > 1) {
            const progress = await Progress.findOne({ user: userId, language });
            if (!progress || !progress.completedDays.includes(dayNum - 1)) {
                return res.status(403).json({ success: false, message: `Complete Day ${dayNum - 1} first!` });
            }
        }
        const curriculum = await Curriculum.findOne({ language, day: dayNum });
        if (!curriculum) return res.status(404).json({ success: false, message: 'Tasks not found.' });
        const progress = await Progress.findOne({ user: userId, language });
        const completedTaskIndices = progress?.completedTasks?.get(String(dayNum)) || [];
        res.json({ success: true, day: dayNum, theme: curriculum.theme, tasks: curriculum.tasks, completedTaskIndices, totalTasks: curriculum.tasks.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const completeTask = async (req, res) => {
    const { language, day, taskIndex } = req.body;
    const dayNum = parseInt(day);
    const taskIdx = parseInt(taskIndex);
    const userId = req.user._id;
    try {
        let progress = await Progress.findOne({ user: userId, language });
        if (!progress) progress = new Progress({ user: userId, language, currentDay: 1 });
        const dayKey = String(dayNum);
        const existingCompleted = progress.completedTasks.get(dayKey) || [];
        if (!existingCompleted.includes(taskIdx)) {
            existingCompleted.push(taskIdx);
            progress.completedTasks.set(dayKey, existingCompleted);
        }
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
        if (lastActivity) lastActivity.setHours(0, 0, 0, 0);
        if (!lastActivity || today - lastActivity === 86400000) {
            progress.currentStreak += 1;
            if (progress.currentStreak > progress.longestStreak) progress.longestStreak = progress.currentStreak;
        } else if (today - lastActivity > 86400000) {
            progress.currentStreak = 1;
        }
        progress.lastActivityDate = new Date();
        let dayJustCompleted = false;
        if (existingCompleted.length >= 10 && !progress.completedDays.includes(dayNum)) {
            progress.completedDays.push(dayNum);
            progress.currentDay = Math.min(dayNum + 1, 180);
            dayJustCompleted = true;
        }
        progress.calculateProgress();
        let certificate = null;
        if (progress.completedDays.length >= 180 && !progress.isCompleted) {
            progress.isCompleted = true;
            progress.completedAt = new Date();
            const user = await User.findById(userId);
            certificate = await Certificate.create({ user: userId, username: user.username, language });
        }
        await progress.save();
        res.json({ success: true, message: 'Task completed!', completedTaskIndices: existingCompleted, dayJustCompleted, overallProgress: progress.overallProgress, currentStreak: progress.currentStreak, nextDay: progress.currentDay, courseCompleted: progress.isCompleted, certificate: certificate ? { id: certificate.certificateId, completedAt: certificate.completedAt } : null });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { getDayTasks, completeTask };