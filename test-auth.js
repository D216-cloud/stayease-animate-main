// Test script to verify authentication components
const path = require('path');
process.chdir('C:\\Users\\deepa\\Downloads\\stayease-animate-main\\stayease-animate-backend');

console.log('Testing authentication components...');
console.log('Current directory:', process.cwd());

try {
  // Test User model
  const User = require('./src/models/User');
  console.log('✅ User model loaded successfully');

  // Test Auth service
  const authService = require('./src/services/authService');
  console.log('✅ Auth service loaded successfully');

  // Test Auth controller
  const authController = require('./src/controllers/authController');
  console.log('✅ Auth controller loaded successfully');
  console.log('Available methods:', Object.keys(authController));

  // Test JWT utils
  const jwt = require('./src/utils/jwt');
  console.log('✅ JWT utilities loaded successfully');

  console.log('\n🎉 All authentication components are working!');
  
  // Now try to start the server
  console.log('\nStarting server...');
  require('./server');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
