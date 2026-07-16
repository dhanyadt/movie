const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authController.register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authController.login);

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, authController.getMe);

router.put('/profile', protect, authController.updateProfile);

// @desc    Update current logged in user password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, authController.updatePassword);

module.exports = router;
