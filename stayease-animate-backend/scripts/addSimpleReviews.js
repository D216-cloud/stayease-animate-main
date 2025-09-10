require('dotenv').config();
const mongoose = require('mongoose');

async function addSimpleReviews() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Import models
    const Review = require('../src/models/Review');
    const Property = require('../src/models/Property');
    const User = require('../src/models/User');

    console.log('Adding simple test reviews...');

    // Clear existing reviews first
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Get any existing users and properties
    const users = await User.find().limit(3);
    const properties = await Property.find().limit(2);

    console.log(`Found ${users.length} users and ${properties.length} properties`);

    if (users.length === 0 || properties.length === 0) {
      console.log('No users or properties found. Creating minimal test data...');
      
      // Create a simple test user if none exist
      if (users.length === 0) {
        const user = new User({
          first_name: 'Test',
          last_name: 'User',
          email: `test_user_${Date.now()}@example.com`,
          password: 'password123',
          role: 'customer'
        });
        await user.save();
        users.push(user);
      }

      // Create a simple test property if none exist
      if (properties.length === 0) {
        const owner = users[0];
        const property = new Property({
          name: 'Test Hotel',
          description: 'A test hotel',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          owner: owner._id,
          defaultRoom: {
            name: 'Standard Room',
            price: 100,
            capacity: 2
          },
          images: ['test.jpg'],
          amenities: ['WiFi'],
          totalReviews: 0,
          averageRating: 0
        });
        await property.save();
        properties.push(property);
      }
    }

    // Create test reviews with existing users and properties
    const testReviews = [
      {
        customer: users[0]._id,
        property: properties[0]._id,
        booking: new mongoose.Types.ObjectId(),
        rating: 5,
        review: 'Excellent stay! Really enjoyed my time here.',
        isVerified: true,
        helpful: 8
      },
      {
        customer: users[Math.min(1, users.length - 1)]._id,
        property: properties[0]._id,
        booking: new mongoose.Types.ObjectId(),
        rating: 4,
        review: 'Great place, will come back again.',
        isVerified: true,
        helpful: 5
      },
      {
        customer: users[Math.min(2, users.length - 1)]._id,
        property: properties[Math.min(1, properties.length - 1)]._id,
        booking: new mongoose.Types.ObjectId(),
        rating: 5,
        review: 'Amazing experience! Highly recommended.',
        isVerified: true,
        helpful: 12
      },
      {
        customer: new mongoose.Types.ObjectId(),
        property: properties[0]._id,
        booking: new mongoose.Types.ObjectId(),
        rating: 3,
        review: 'Decent stay, could be better.',
        isVerified: true,
        helpful: 2
      }
    ];

    const createdReviews = await Review.insertMany(testReviews);
    console.log(`Created ${createdReviews.length} test reviews`);

    // Update property stats for each property
    for (const property of properties) {
      const propReviews = await Review.find({ property: property._id, isVerified: true });
      const totalReviews = propReviews.length;
      const averageRating = totalReviews > 0 
        ? propReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      await Property.findByIdAndUpdate(property._id, {
        totalReviews,
        averageRating
      });

      console.log(`Updated ${property.name}: ${totalReviews} reviews, ${averageRating.toFixed(2)} average`);
    }
    
    // Show final stats
    const finalCount = await Review.countDocuments();
    const allReviews = await Review.find({}, 'rating');
    const overallAverage = allReviews.length > 0 
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length 
      : 0;

    console.log(`\n=== FINAL STATS ===`);
    console.log(`Total reviews: ${finalCount}`);
    console.log(`Overall average: ${overallAverage.toFixed(2)}`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSimpleReviews();
