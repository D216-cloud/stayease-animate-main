// Quick test script to add reviews and check API
const axios = require('axios');

async function testReviewsAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test the health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('Health check:', healthResponse.data);
    
    // Try to call the owner ratings endpoint (might fail without auth)
    try {
      const ratingsResponse = await axios.get('http://localhost:5000/api/bookings/owner/ratings');
      console.log('Owner ratings (no auth):', ratingsResponse.data);
    } catch (authError) {
      console.log('Owner ratings requires auth (expected):', authError.response?.status);
    }
    
  } catch (error) {
    console.error('API test error:', error.message);
  }
}

testReviewsAPI();
