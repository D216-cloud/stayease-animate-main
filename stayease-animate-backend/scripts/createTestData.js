require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Property = require('../src/models/Property');
const Booking = require('../src/models/Booking');
const Review = require('../src/models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayease');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample review data
const sampleReviews = [
  {
    customerName: 'John Doe',
    propertyName: 'Grand Hotel',
    rating: 5,
    review: 'Amazing experience! The staff was incredibly helpful and the room was spotless. The location is perfect and the breakfast was excellent. Highly recommend!',
    daysAgo: 2
  },
  {
    customerName: 'Sarah Wilson',
    propertyName: 'Ocean View Resort',
    rating: 4,
    review: 'Beautiful location with stunning ocean views. The staff was friendly and accommodating. Breakfast was excellent with fresh local ingredients.',
    daysAgo: 7
  },
  {
    customerName: 'Mike Johnson',
    propertyName: 'Mountain Lodge',
    rating: 5,
    review: 'Perfect getaway spot! The lodge was cozy and clean, with breathtaking mountain views. The hot springs were a wonderful bonus.',
    daysAgo: 14
  },
  {
    customerName: 'Emma Davis',
    propertyName: 'City Center Hotel',
    rating: 3,
    review: 'Decent hotel in a good location. Room was clean but a bit small. Staff was helpful but the WiFi was unreliable.',
    daysAgo: 21
  },
  {
    customerName: 'Alex Chen',
    propertyName: 'Luxury Suites',
    rating: 5,
    review: 'Exceptional service and amenities! The suite was spacious and beautifully decorated. The spa services were outstanding.',
    daysAgo: 28
  },
  {
    customerName: 'Lisa Brown',
    propertyName: 'Grand Hotel',
    rating: 4,
    review: 'Great value for money. Clean rooms, comfortable beds, and friendly staff. The pool area was well-maintained.',
    daysAgo: 35
  },
  {
    customerName: 'David Miller',
    propertyName: 'Ocean View Resort',
    rating: 2,
    review: 'Disappointing experience. The room was not as advertised and there were maintenance issues. Customer service was slow to respond.',
    daysAgo: 42
  },
  {
    customerName: 'Anna Garcia',
    propertyName: 'Mountain Lodge',
    rating: 5,
    review: 'Absolutely loved our stay! The lodge exceeded our expectations. The hiking trails nearby were fantastic.',
    daysAgo: 49
  }
];

const createTestData = async () => {
  try {
    console.log('Creating test data for reviews...');

    // Find existing hotel owners and customers
    const hotelOwners = await User.find({ role: 'hotel_owner' });
    const customers = await User.find({ role: 'customer' });

    if (hotelOwners.length === 0) {
      console.log('No hotel owners found. Please create hotel owners first.');
      return;
    }

    if (customers.length === 0) {
      console.log('No customers found. Please create customers first.');
      return;
    }

    // Get properties owned by hotel owners
    const properties = await Property.find({ owner: { $in: hotelOwners.map(owner => owner._id) } });

    if (properties.length === 0) {
      console.log('No properties found. Please create properties first.');
      return;
    }

    console.log(`Found ${customers.length} customers, ${hotelOwners.length} owners, ${properties.length} properties`);

    // Create reviews
    const createdReviews = [];

    for (const reviewData of sampleReviews) {
      // Find or create customer
      let customer = customers.find(c => `${c.first_name} ${c.last_name}` === reviewData.customerName);
      if (!customer) {
        // Create a new customer if not found
        const [firstName, ...lastNameParts] = reviewData.customerName.split(' ');
        const lastName = lastNameParts.join(' ');
        customer = new User({
          first_name: firstName,
          last_name: lastName,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          password: 'password123',
          role: 'customer'
        });
        await customer.save();
        console.log(`Created customer: ${reviewData.customerName}`);
      }

      // Find property
      const property = properties.find(p => p.name === reviewData.propertyName) || properties[0];

      // Create booking first (required for review)
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() - reviewData.daysAgo - 3);

      const checkOutDate = new Date();
      checkOutDate.setDate(checkOutDate.getDate() - reviewData.daysAgo);

      const booking = new Booking({
        customer: customer._id,
        property: property._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: 2,
        nights: 3,
        pricePerNight: property.price,
        taxesAndFees: 25,
        totalAmount: property.price * 3 + 25,
        status: 'completed',
        rating: reviewData.rating,
        review: reviewData.review,
        reviewedAt: new Date(Date.now() - reviewData.daysAgo * 24 * 60 * 60 * 1000)
      });

      await booking.save();

      // Create review record
      const review = new Review({
        customer: customer._id,
        property: property._id,
        booking: booking._id,
        rating: reviewData.rating,
        review: reviewData.review,
        isVerified: true
      });

      await review.save();
      createdReviews.push(review);

      console.log(`Created review: ${reviewData.customerName} - ${reviewData.rating} stars for ${property.name}`);
    }

    // Update property ratings
    for (const property of properties) {
      const propertyReviews = await Review.find({ property: property._id });
      if (propertyReviews.length > 0) {
        const averageRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0) / propertyReviews.length;
        const totalReviews = propertyReviews.length;

        await Property.findByIdAndUpdate(property._id, {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews
        });

        console.log(`Updated ${property.name}: ${totalReviews} reviews, avg rating ${averageRating.toFixed(1)}`);
      }
    }

    console.log(`\n✅ Successfully created ${createdReviews.length} test reviews!`);
    console.log('You can now view reviews in the Hotel Owner Dashboard.');

  } catch (error) {
    console.error('Error creating test data:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createTestData();
  await mongoose.connection.close();
  console.log('Database connection closed.');
};

run().catch(console.error);
