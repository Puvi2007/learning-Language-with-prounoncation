const Activity = require('../models/Activity');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const { generateDailyActivities } = require('../utils/aiActivityGenerator');

const getDayActivities = async (req, res) => {
    const { language, day } = req.params;
    const dayNum = parseInt(day);
    const userId = req.user._id;

    try {
        // Ensure user is on this day or has completed it
        let progress = await Progress.findOne({ user: userId, language });
        if (!progress) {
            progress = await Progress.create({ user: userId, language, currentDay: 1 });
        }

        if (dayNum > progress.currentDay) {
            return res.status(403).json({ success: false, message: `Day ${dayNum} is locked. Complete previous days first.` });
        }

        // Generate or Fetch activities
        const activities = await generateDailyActivities(language, dayNum);
        
        const completedIndices = progress.completedActivities.get(String(dayNum)) || [];
        
        res.json({ 
            success: true, 
            day: dayNum, 
            activities, 
            tasks: activities, 
            completedIndices,
            totalActivities: activities.length,
            progressPercentage: progress.progressPercentage
        });
    } catch (error) {
        console.error("getDayActivities error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching activities.' });
    }
};

const completeActivity = async (req, res) => {
    const { language, day, activityIndex } = req.body;
    const dayNum = parseInt(day);
    const actIdx = parseInt(activityIndex);
    const userId = req.user._id;

    try {
        let progress = await Progress.findOne({ user: userId, language });
        if (!progress) progress = new Progress({ user: userId, language, currentDay: 1 });

        const dayKey = String(dayNum);
        const existingCompleted = progress.completedActivities.get(dayKey) || [];
        
        if (!existingCompleted.includes(actIdx)) {
            existingCompleted.push(actIdx);
            progress.completedActivities.set(dayKey, existingCompleted);
        }

        // Streak Logic
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const lastActivity = progress.lastActivityDate ? new Date(progress.lastActivityDate) : null;
        if (lastActivity) lastActivity.setHours(0, 0, 0, 0);

        let streakUpdated = false;
        if (!lastActivity) {
            progress.streakCount = 1;
            streakUpdated = true;
        } else {
            const diffTime = Math.abs(today - lastActivity);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                progress.streakCount += 1;
                streakUpdated = true;
            } else if (diffDays > 1) {
                progress.streakCount = 1;
                streakUpdated = true;
            }
        }
        
        progress.lastActivityDate = new Date();
        if (streakUpdated || true) {
            // Manual YYYY-MM-DD to avoid locale issues
            const now = new Date();
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            
            const user = await User.findById(userId);
            if (user) {
                const activityIdx = user.activityHistory.findIndex(a => a.date === dateStr);
                if (activityIdx !== -1) {
                    user.activityHistory[activityIdx].count += 1;
                } else {
                    user.activityHistory.push({ date: dateStr, count: 1 });
                }
                user.streak = progress.streakCount;
                user.lastActivityDate = progress.lastActivityDate;
                await user.save();
            }
        }

        let dayJustCompleted = false;
        if (existingCompleted.length >= 10 && !progress.completedDays.includes(dayNum)) {
            progress.completedDays.push(dayNum);
            progress.currentDay = Math.min(dayNum + 1, 14);
            dayJustCompleted = true;

            // Generate Daily Certificate (Wrap in try/catch to ensure progress still saves)
            try {
                const existingDailyCert = await Certificate.findOne({
                    user: userId,
                    language,
                    certificateType: 'Daily',
                    dayCompleted: dayNum
                });

                if (!existingDailyCert) {
                    await Certificate.create({
                        user: userId,
                        username: req.user.username,
                        language,
                        certificateType: 'Daily',
                        dayCompleted: dayNum,
                        completionPercentage: Math.round((progress.completedDays.length / 14) * 100)
                    });
                }
            } catch (certError) {
                console.error("Daily Certificate generation failed:", certError);
            }
        }

        progress.calculateProgress();

        // Check for Milestones (25%, 50%, 75%, 100%)
        try {
            const milestones = [25, 50, 75, 100];
            for (let m of milestones) {
                if (progress.progressPercentage >= m) {
                    const existingCert = await Certificate.findOne({ 
                        user: userId, 
                        language, 
                        certificateType: m === 100 ? 'Final' : 'Progress',
                        completionPercentage: m 
                    });
                    if (!existingCert) {
                        // TIERED RANKING LOGIC
                        let rank = 'Bronze';
                        if (progress.progressPercentage >= 90) rank = 'Gold';
                        else if (progress.progressPercentage >= 70) rank = 'Silver';
                        else if (progress.progressPercentage >= 40) rank = 'Bronze';

                        await Certificate.create({
                            user: userId,
                            username: req.user.username,
                            language,
                            certificateType: m === 100 ? 'Final' : 'Progress',
                            completionPercentage: m,
                            rank: rank 
                        });
                        if (m === 100) {
                            progress.isCompleted = true;
                            progress.completedAt = new Date();
                        }
                    }
                }
            }
        } catch (milestoneError) {
            console.error("Milestone check/cert failed:", milestoneError);
        }

        await progress.save();
        
        res.json({ 
            success: true, 
            message: 'Activity completed!', 
            completedIndices: existingCompleted, 
            dayJustCompleted, 
            progressPercentage: progress.progressPercentage,
            streakCount: progress.streakCount,
            nextDay: progress.currentDay,
            courseCompleted: progress.isCompleted
        });
    } catch (error) {
        console.error("completeActivity error:", error);
        res.status(500).json({ success: false, message: 'Server error saving progress.' });
    }
};

module.exports = { getDayActivities, completeActivity };
