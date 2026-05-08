const express = require('express');
const router = express.Router();
const { getDayActivities, completeActivity } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:language/:day', protect, getDayActivities);
router.post('/complete', protect, completeActivity);

module.exports = router;