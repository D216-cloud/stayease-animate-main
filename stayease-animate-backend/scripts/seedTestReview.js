require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('../src/models/Review');
const Property = require('../src/models/Property');
const User = require('../src/models/User');

async function seedTestReview() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find an existing user and property to create a realistic review
    const user = await User.findOne({ role: 'customer' });
    const property = await Property.findOne();

    if (!user || !property) {
      console.log('No customer user or property found. Creating test review with sample data...');
      
      // Create a test review with fake ObjectIds if no real data exists
      const testReview = new Review({
        customer: new mongoose.Types.ObjectId(),
        property: new mongoose.Types.ObjectId(),
        booking: new mongoose.Types.ObjectId(),
        rating: 5,
        review: 'Amazing stay! The hotel was clean, staff was friendly, and the location was perfect.',
        isVerified: true,
        helpful: 3,
        reported: false
      });

      await testReview.save();
      console.log('Created test review:', testReview._id);
    } else {
      // Create review with real user and property
      const existingReview = await Review.findOne({ customer: user._id, property: property._id });
      
      if (!existingReview) {
        const testReview = new Review({
          customer: user._id,
          property: property._id,
          booking: new mongoose.Types.ObjectId(), // fake booking for now
          rating: 4,
          review: 'Great experience! Would definitely recommend this place to others.',
          isVerified: true,
          helpful: 2,
          reported: false
        });

        await testReview.save();
        console.log('Created test review with real user/property:', testReview._id);

        // Update property stats
        const allReviews = await Review.find({ property: property._id, isVerified: true });
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0 
          ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
          : 0;

        await Property.findByIdAndUpdate(property._id, {
          averageRating,
          totalReviews
        });
        
        console.log(`Updated property ${property.name} - Average: ${averageRating}, Total: ${totalReviews}`);
      } else {
        console.log('Review already exists for this user/property combination');
      }
    }

    // Show current review count
    const reviewCount = await Review.countDocuments();
    console.log(`Total reviews in database: ${reviewCount}`);

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedTestReview();
