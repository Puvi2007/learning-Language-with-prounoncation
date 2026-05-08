const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

const getUserProgress = async (req, res) => {
  const userId = req.user._id;
  const { language } = req.query;
  try {
    const query = { user: userId };
    if (language) query.language = language;
    const user = await User.findById(userId); // Fresh fetch to ensure latest history
    const progress = await Progress.findOne(query);
    
    if (progress) {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      user.activityHistory.push({ date: dateStr, count: progress.completedActivities.size * 5 }); // Estimate
      await user.save();
    }

    res.json({
      success: true,
      progress: progress ? {
        language: progress.language,
        currentDay: progress.currentDay,
        progressPercentage: progress.progressPercentage,
        completedDays: progress.completedDays,
        streakCount: progress.streakCount,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
      } : null,
      activityHistory: user ? user.activityHistory : []
    });
  } catch (error) {
    console.error("getUserProgress error:", error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const selectLanguage = async (req, res) => {
  const { language } = req.body;
  const userId = req.user._id;
  const validLanguages = ['Tamil', 'Telugu'];
  if (!validLanguages.includes(language)) {
    return res.status(400).json({ success: false, message: 'Invalid language selection.' });
  }
  try {
    await User.findByIdAndUpdate(userId, { selectedLanguage: language });
    let progress = await Progress.findOne({ user: userId, language });
    if (!progress) {
      progress = await Progress.create({ 
        user: userId, 
        language, 
        currentDay: 1,
        completedActivities: {},
        completedDays: []
      });
    }
    res.json({ 
      success: true, 
      message: `Language set to ${language}!`, 
      currentDay: progress.currentDay, 
      progressPercentage: progress.progressPercentage 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getCertificate = async (req, res) => {
  const userId = req.user._id;
  const { language, type } = req.query;
  try {
    const query = { user: userId, language };
    if (type) query.certificateType = type;
    
    const certs = await Certificate.find(query);
    res.json({ success: true, certificates: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const resetProgress = async (req, res) => {
  const userId = req.user._id;
  const { language } = req.body;
  try {
    await Progress.findOneAndDelete({ user: userId, language });
    await User.findByIdAndUpdate(userId, { streak: 0 });
    res.json({ success: true, message: 'Progress reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getUserProgress, selectLanguage, getCertificate, resetProgress };
