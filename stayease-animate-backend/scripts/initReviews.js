require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment. Please set it in .env or the environment before running this script.');
  process.exit(1);
}

async function run() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // Require the Review model so Mongoose registers it
    const Review = require('../src/models/Review');

    // Ensure indexes are created
    try {
      await Review.init();
      console.log('Review model indexes initialized');
    } catch (idxErr) {
      console.warn('Could not init Review indexes:', idxErr.message);
    }

    // Ensure collection exists
    try {
      const db = mongoose.connection.db;
      const name = 'reviews';
      const cols = await db.listCollections({ name }).toArray();
      if (cols.length === 0) {
        await db.createCollection(name);
        console.log('Created collection:', name);
      } else {
        console.log('Collection already exists:', name);
      }
    } catch (colErr) {
      console.warn('Could not ensure collection exists:', colErr.message);
    }

    await mongoose.disconnect();
    console.log('Done. Disconnected.');
  } catch (err) {
    console.error('Error connecting or initializing Review collection:', err.message || err);
    process.exit(1);
  }
}

run();
