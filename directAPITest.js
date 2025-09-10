// Direct test of review endpoints
const API_BASE = 'http://localhost:5000/api';

// Test function to directly call the API
async function testReviewAPIs() {
  console.log('Testing Review APIs directly...');
  
  try {
    // Test health check first
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    console.log('Health check:', healthData);
    
    // Test owner ratings without auth (should fail)
    try {
      const ratingsRes = await fetch(`${API_BASE}/bookings/owner/ratings`);
      const ratingsData = await ratingsRes.json();
      console.log('Owner ratings (no auth):', ratingsData);
    } catch (e) {
      console.log('Owner ratings needs auth (expected)');
    }
    
    // Test if we can see all reviews (if any public endpoint exists)
    
  } catch (error) {
    console.error('API test error:', error);
  }
}

// Run the test
testReviewAPIs();
