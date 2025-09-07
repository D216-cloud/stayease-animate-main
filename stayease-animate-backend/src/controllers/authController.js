const authService = require('../services/authService');
const { validationResult } = require('express-validator');

// Signup new user
const signup = async (req, res) => {
  try {
    console.log('Signup called with data:', req.body);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { first_name, last_name, email, password, role } = req.body;

    const result = await authService.signup({
      first_name,
      last_name,
      email,
      password,
      role: role || 'customer' // Default to customer if no role provided
    });

    console.log('Signup successful for:', email);
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Signup failed'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('Login called with email:', req.body.email);
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    const result = await authService.login(email, password);

    console.log('Login successful for:', email, 'Role:', result.user.role);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// Get current user (protected route)
const me = async (req, res) => {
  try {
    console.log('Me called for userId:', req.user.userId);
    
    // req.user is set by authMiddleware
    const userId = req.user.userId;

    const result = await authService.getCurrentUser(userId);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'User not found'
    });
  }
};

// Logout user (optional - mainly for clearing client-side token)
const logout = async (req, res) => {
  try {
    console.log('Logout called');
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove token from client storage.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Test endpoint to check if server is running
const test = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth endpoints are working',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Connected'
  });
};

module.exports = {
  signup,
  login,
  me,
  logout,
  test
};
