const mongoose = require('mongoose');
const Booking = require('./src/models/Booking');
const Property = require('./src/models/Property');
const User = require('./src/models/User');

async function seedReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/stayease', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find existing users, properties, and bookings
    const customers = await User.find({ role: 'customer' });
    const properties = await Property.find({});
    const bookings = await Booking.find({});

    if (customers.length === 0 || properties.length === 0) {
      console.log('No customers or properties found. Please create some first.');
      return;
    }

    // Sample reviews data
    const sampleReviews = [
      {
        customer: customers[0]?._id,
        property: properties[0]?._id,
        rating: 5,
        review: "Amazing experience! The staff was incredibly helpful and the room was spotless. Highly recommend!",
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        customer: customers[0]?._id,
        property: properties[0]?._id,
        rating: 4,
        review: "Beautiful location with stunning views. Breakfast was excellent and the service was great!",
        reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      },
      {
        customer: customers[1]?._id || customers[0]?._id,
        property: properties[1]?._id || properties[0]?._id,
        rating: 5,
        review: "Perfect stay! Everything was exactly as described. Will definitely book again.",
        reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        customer: customers[1]?._id || customers[0]?._id,
        property: properties[1]?._id || properties[0]?._id,
        rating: 4,
        review: "Great value for money. Clean rooms and friendly staff. Minor issues with WiFi but overall excellent.",
        reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        customer: customers[2]?._id || customers[0]?._id,
        property: properties[2]?._id || properties[0]?._id,
        rating: 5,
        review: "Outstanding hospitality! The attention to detail was remarkable. Best hotel experience ever!",
        reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      }
    ];

    // Insert sample reviews
    for (const reviewData of sampleReviews) {
      // Check if booking exists for this customer and property
      let booking = await Booking.findOne({
        customer: reviewData.customer,
        property: reviewData.property,
        status: 'completed'
      });

      if (!booking) {
        // Create a sample booking if none exists
        booking = await Booking.create({
          customer: reviewData.customer,
          property: reviewData.property,
          checkIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          checkOut: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          guests: 2,
          nights: 2,
          pricePerNight: 150,
          taxesAndFees: 25,
          totalAmount: 325,
          status: 'completed',
        });
      }

      // Update booking with review
      await Booking.findByIdAndUpdate(booking._id, {
        rating: reviewData.rating,
        review: reviewData.review,
        reviewedAt: reviewData.reviewedAt,
      });

      console.log(`Added review for booking ${booking._id}`);
    }

    console.log('Sample reviews seeded successfully!');
    console.log(`Added ${sampleReviews.length} sample reviews`);

  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedReviews();