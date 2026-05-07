const express = require('express');
const router = express.Router();
const { getDayTasks, completeTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:language/:day', protect, getDayTasks);
router.post('/complete', protect, completeTask);

module.exports = router;