const User = require('../models/User');
const { generateTokenForUser } = require('../utils/jwt');

class AuthService {
  // Register/Signup new user
  async signup(userData) {
    try {
      const { first_name, last_name, email, password, role = 'customer' } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user (password will be hashed by the pre-save middleware)
      const user = new User({
        first_name,
        last_name,
        email,
        password,
        role
      });

      await user.save();

      // Generate JWT token
      const token = generateTokenForUser(user);

      return {
        success: true,
        message: 'User registered successfully',
        user: user.toPublicJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user by email and include password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if password is correct
      const isPasswordCorrect = await user.correctPassword(password, user.password);
      
      if (!isPasswordCorrect) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = generateTokenForUser(user);

      return {
        success: true,
        message: 'Login successful',
        user: user.toPublicJSON(),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Get current user by ID
  async getCurrentUser(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user: user.toPublicJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate user credentials (used for additional security checks)
  async validateUser(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw new Error('User validation failed');
    }
  }
}

module.exports = new AuthService();
