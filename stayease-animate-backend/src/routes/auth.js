const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { signupValidation, loginValidation } = require('../validators/authValidators');

// Public routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);

// Protected routes  
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);

// Test route
router.get('/test', authController.test);

module.exports = router;
