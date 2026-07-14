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

module.exports = router;
