// Simple API test to verify reviews are working
const axios = require('axios');

async function testReviewsAPI() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('=== Testing Review System APIs ===\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Health:', health.data);
    
    // Test reviews endpoint (might need auth)
    console.log('\n2. Testing owner ratings (without auth)...');
    try {
      const ratings = await axios.get(`${baseURL}/bookings/owner/ratings`);
      console.log('✅ Owner ratings:', ratings.data);
    } catch (authError) {
      console.log('⚠️  Owner ratings requires authentication (expected)');
      console.log('   Status:', authError.response?.status);
      console.log('   Message:', authError.response?.data?.message);
    }
    
    // Test owner reviews endpoint
    console.log('\n3. Testing owner reviews (without auth)...');
    try {
      const reviews = await axios.get(`${baseURL}/bookings/owner/reviews`);
      console.log('✅ Owner reviews:', reviews.data);
    } catch (authError) {
      console.log('⚠️  Owner reviews requires authentication (expected)');
      console.log('   Status:', authError.response?.status);
    }
    
    // Test direct Review count in database
    console.log('\n4. Direct database check...');
    require('dotenv').config();
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    
    const Review = require('../src/models/Review');
    const reviewCount = await Review.countDocuments();
    const avgRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    console.log(`✅ Reviews in DB: ${reviewCount}`);
    if (avgRating.length > 0) {
      console.log(`✅ Average rating: ${avgRating[0].avg.toFixed(2)}`);
    }
    
    await mongoose.disconnect();
    console.log('\n=== All tests completed ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  testReviewsAPI();
}

module.exports = testReviewsAPI;
