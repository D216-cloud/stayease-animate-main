require('dotenv').config();
const mongoose = require('mongoose');

async function addTestReviews() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Import models
    const Review = require('../src/models/Review');
    const Property = require('../src/models/Property');
    const User = require('../src/models/User');

    // Create some test data if none exists
    const reviewCount = await Review.countDocuments();
    console.log(`Current review count: ${reviewCount}`);

    if (reviewCount === 0) {
      console.log('No reviews found, creating test reviews...');
      
      // Create test reviews with fake ObjectIds
      const testReviews = [
        {
          customer: new mongoose.Types.ObjectId(),
          property: new mongoose.Types.ObjectId(),
          booking: new mongoose.Types.ObjectId(),
          rating: 5,
          review: 'Excellent stay! The hotel exceeded all my expectations. Clean rooms, friendly staff, and great location.',
          isVerified: true,
          helpful: 8,
          reported: false
        },
        {
          customer: new mongoose.Types.ObjectId(),
          property: new mongoose.Types.ObjectId(),
          booking: new mongoose.Types.ObjectId(),
          rating: 4,
          review: 'Great experience overall. Minor issues with room service but everything else was perfect.',
          isVerified: true,
          helpful: 5,
          reported: false
        },
        {
          customer: new mongoose.Types.ObjectId(),
          property: new mongoose.Types.ObjectId(),
          booking: new mongoose.Types.ObjectId(),
          rating: 5,
          review: 'Amazing hotel! Will definitely come back. The breakfast was fantastic and the view was breathtaking.',
          isVerified: true,
          helpful: 12,
          reported: false
        },
        {
          customer: new mongoose.Types.ObjectId(),
          property: new mongoose.Types.ObjectId(),
          booking: new mongoose.Types.ObjectId(),
          rating: 3,
          review: 'Decent stay but could be better. Room was clean but facilities need updating.',
          isVerified: true,
          helpful: 2,
          reported: false
        }
      ];

      await Review.insertMany(testReviews);
      console.log(`Created ${testReviews.length} test reviews`);
    }

    // Show final count and average
    const finalCount = await Review.countDocuments();
    const allReviews = await Review.find({}, 'rating');
    const average = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;

    console.log(`Total reviews in database: ${finalCount}`);
    console.log(`Average rating: ${average.toFixed(2)}`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestReviews();
