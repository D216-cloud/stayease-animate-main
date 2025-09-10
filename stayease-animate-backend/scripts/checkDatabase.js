require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayease');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Check database contents
const checkDatabase = async () => {
  try {
    console.log('\n🔍 Checking database contents...');

    const User = require('../src/models/User');
    const Property = require('../src/models/Property');
    const Review = require('../src/models/Review');
    const Booking = require('../src/models/Booking');

    const users = await User.find({});
    const properties = await Property.find({});
    const reviews = await Review.find({});
    const bookings = await Booking.find({});

    console.log(`👥 Users: ${users.length}`);
    console.log(`🏨 Properties: ${properties.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);

    if (users.length > 0) {
      console.log('\n📋 Sample Users:');
      users.slice(0, 3).forEach(user => {
        console.log(`  - ${user.first_name} ${user.last_name} (${user.role}) - ${user.email}`);
      });
    }

    if (properties.length > 0) {
      console.log('\n🏨 Sample Properties:');
      properties.slice(0, 3).forEach(prop => {
        console.log(`  - ${prop.name} (${prop.city}, ${prop.country}) - Owner: ${prop.owner}`);
      });
    }

    if (reviews.length > 0) {
      console.log('\n⭐ Sample Reviews:');
      reviews.slice(0, 3).forEach(review => {
        console.log(`  - Rating: ${review.rating}/5 - "${review.review.substring(0, 50)}..."`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
};

// Run the check
const run = async () => {
  await connectDB();
  await checkDatabase();
  await mongoose.connection.close();
  console.log('\n✅ Database check complete.');
};

run().catch(console.error);
