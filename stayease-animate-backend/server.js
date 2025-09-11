require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log('🎉 ========================================');
  console.log('🚀 StayEase API Server Started Successfully!');
  console.log('🎉 ========================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📋 API Status: http://localhost:${PORT}/`);
  console.log('🎉 ========================================');
  console.log('💡 API is ready to accept requests!');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

module.exports = server;
