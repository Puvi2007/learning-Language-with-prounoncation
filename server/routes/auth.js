const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const passwordRules = body('password')
    .isLength({ min: 8 }).withMessage('Min 8 characters')
    .matches(/[A-Z]/).withMessage('One uppercase letter required')
    .matches(/[a-z]/).withMessage('One lowercase letter required')
    .matches(/[0-9]/).withMessage('One number required')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('One special character required');

router.post('/signup', [
    body('username').trim().isLength({ min: 3 }).withMessage('Username min 3 chars'),
    body('email').isEmail().withMessage('Valid email required'),
    passwordRules,
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Passwords do not match');
        return true;
    }),
], signup);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
], login);

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email required'),
], forgotPassword);

router.post('/reset-password/:token', [passwordRules], resetPassword);
router.get('/me', protect, getMe);

module.exports = router;