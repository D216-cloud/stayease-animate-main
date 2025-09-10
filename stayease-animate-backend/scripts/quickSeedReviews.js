require('dotenv').config();
const mongoose = require('mongoose');

async function quickSeedReviews() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);

    const Review = require('../src/models/Review');
    const Property = require('../src/models/Property');
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Get any existing property
    const properties = await Property.find().limit(2);
    console.log(`Found ${properties.length} properties`);

    if (properties.length === 0) {
      console.log('No properties found, creating one...');
      const newProperty = new Property({
        name: 'Sample Hotel',
        description: 'A test hotel',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        owner: new mongoose.Types.ObjectId(),
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
      await newProperty.save();
      properties.push(newProperty);
    }

    // Create 5 sample reviews
    const sampleReviews = [];
    for (let i = 0; i < 5; i++) {
      sampleReviews.push({
        customer: new mongoose.Types.ObjectId(),
        property: properties[0]._id,
        booking: new mongoose.Types.ObjectId(),
        rating: [5, 4, 5, 3, 4][i],
        review: [
          'Excellent hotel! Perfect location and service.',
          'Great stay, clean rooms and friendly staff.',
          'Amazing experience, will definitely come back!',
          'Good hotel, but could improve the breakfast.',
          'Nice place, comfortable beds and good amenities.'
        ][i],
        isVerified: true,
        helpful: [8, 5, 12, 2, 6][i]
      });
    }

    await Review.insertMany(sampleReviews);
    console.log(`Created ${sampleReviews.length} sample reviews`);

    // Update property stats
    const reviews = await Review.find({ property: properties[0]._id });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    await Property.findByIdAndUpdate(properties[0]._id, {
      totalReviews,
      averageRating
    });

    console.log(`\n✅ FINAL STATS:`);
    console.log(`Total reviews: ${totalReviews}`);
    console.log(`Average rating: ${averageRating.toFixed(2)}`);
    console.log(`Property: ${properties[0].name}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickSeedReviews();
