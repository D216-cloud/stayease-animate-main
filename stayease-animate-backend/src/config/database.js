const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Ensure Review model collection and indexes exist so it shows up immediately
    try {
      // Require the model to make sure it's registered with mongoose
      const Review = require('../models/Review');

      // Initialize model indexes (safe to call even if indexes already exist)
      await Review.init();

      // Create collection if it doesn't already exist (no-op if exists)
      const db = conn.connection.db;
      const collections = await db.listCollections({ name: 'reviews' }).toArray();
      if (collections.length === 0) {
        await db.createCollection('reviews');
        console.log('Created `reviews` collection');
      }
    } catch (initErr) {
      console.warn('Warning: could not auto-init Review collection/indexes -', initErr.message);
    }
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
