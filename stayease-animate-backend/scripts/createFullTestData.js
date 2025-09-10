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
    const Booking = require('../src/models/Booking');

    console.log('Adding test data...');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Create test users, properties, and bookings
    const testCustomer = new User({
      first_name: 'John',
      last_name: 'Customer',
      email: 'customer@test.com',
      password: 'password123',
      role: 'customer'
    });
    await testCustomer.save();

    const testOwner = new User({
      first_name: 'Hotel',
      last_name: 'Owner', 
      email: 'owner@test.com',
      password: 'password123',
      role: 'hotel_owner'
    });
    await testOwner.save();

    const testProperty = new Property({
      name: 'Test Hotel',
      description: 'A great test hotel',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      owner: testOwner._id,
      defaultRoom: {
        name: 'Standard Room',
        price: 100,
        capacity: 2
      },
      images: ['test.jpg'],
      amenities: ['WiFi', 'Pool'],
      totalReviews: 0,
      averageRating: 0
    });
    await testProperty.save();

    const testBooking = new Booking({
      customer: testCustomer._id,
      property: testProperty._id,
      checkIn: new Date('2024-01-01'),
      checkOut: new Date('2024-01-03'),
      guests: 2,
      totalAmount: 200,
      status: 'completed',
      room: {
        name: 'Standard Room',
        price: 100
      }
    });
    await testBooking.save();

    // Create test reviews
    const testReviews = [
      {
        customer: testCustomer._id,
        property: testProperty._id,
        booking: testBooking._id,
        rating: 5,
        review: 'Excellent stay! The hotel exceeded all my expectations. Clean rooms, friendly staff, and great location.',
        isVerified: true,
        helpful: 8,
        reported: false
      },
      {
        customer: testCustomer._id,
        property: testProperty._id,
        booking: new mongoose.Types.ObjectId(), // Different booking
        rating: 4,
        review: 'Great experience overall. Minor issues with room service but everything else was perfect.',
        isVerified: true,
        helpful: 5,
        reported: false
      },
      {
        customer: new mongoose.Types.ObjectId(), // Different customer
        property: testProperty._id,
        booking: new mongoose.Types.ObjectId(),
        rating: 5,
        review: 'Amazing hotel! Will definitely come back. The breakfast was fantastic and the view was breathtaking.',
        isVerified: true,
        helpful: 12,
        reported: false
      },
      {
        customer: new mongoose.Types.ObjectId(),
        property: testProperty._id,
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

    // Update property stats
    const allReviews = await Review.find({ property: testProperty._id, isVerified: true });
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    await Property.findByIdAndUpdate(testProperty._id, {
      totalReviews,
      averageRating
    });

    console.log(`Updated property: ${totalReviews} reviews, ${averageRating.toFixed(2)} average rating`);
    
    // Show final stats
    const finalCount = await Review.countDocuments();
    const allFinalReviews = await Review.find({}, 'rating');
    const overallAverage = allFinalReviews.length > 0 
      ? allFinalReviews.reduce((sum, r) => sum + r.rating, 0) / allFinalReviews.length 
      : 0;

    console.log(`Total reviews in database: ${finalCount}`);
    console.log(`Overall average rating: ${overallAverage.toFixed(2)}`);
    console.log(`Test owner ID: ${testOwner._id}`);
    console.log(`Test customer ID: ${testCustomer._id}`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestReviews();
