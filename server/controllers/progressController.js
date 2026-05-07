const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

const getUserProgress = async (req, res) => {
  const userId = req.user._id;
  const { language } = req.query;
  try {
    const query = { user: userId };
    if (language) query.language = language;
    const progress = await Progress.findOne(query);
    if (!progress) return res.json({ success: true, progress: null });
    res.json({
      success: true,
      progress: {
        language: progress.language,
        currentDay: progress.currentDay,
        overallProgress: progress.overallProgress,
        completedDays: progress.completedDays,
        currentStreak: progress.currentStreak,
        longestStreak: progress.longestStreak,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const selectLanguage = async (req, res) => {
  const { language } = req.body;
  const userId = req.user._id;
  const validLanguages = ['Tamil','English','French','Telugu','Kannada','Malayalam','Sanskrit','Hindi'];
  if (!validLanguages.includes(language)) {
    return res.status(400).json({ success: false, message: 'Invalid language.' });
  }
  try {
    await User.findByIdAndUpdate(userId, { selectedLanguage: language, languageStartDate: new Date() });
    let progress = await Progress.findOne({ user: userId, language });
    if (!progress) progress = await Progress.create({ user: userId, language, currentDay: 1 });
    res.json({ success: true, message: `Language set to ${language}!`, currentDay: progress.currentDay, overallProgress: progress.overallProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getCertificate = async (req, res) => {
  const userId = req.user._id;
  const { language } = req.query;
  try {
    const cert = await Certificate.findOne({ user: userId, language });
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not yet earned.' });
    res.json({ success: true, certificate: { certificateId: cert.certificateId, username: cert.username, language: cert.language, completedAt: cert.completedAt } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const resetProgress = async (req, res) => {
  const userId = req.user._id;
  const { language } = req.body;
  try {
    await Progress.findOneAndDelete({ user: userId, language });
    res.json({ success: true, message: 'Progress reset successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getUserProgress, selectLanguage, getCertificate, resetProgress };
