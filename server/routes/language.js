const express = require('express');
const router = express.Router();
const { getUserProgress, selectLanguage, getCertificate, resetProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/select', protect, selectLanguage);
router.post('/reset-progress', protect, resetProgress);
router.get('/progress', protect, getUserProgress);
router.get('/certificate', protect, getCertificate);

module.exports = router;