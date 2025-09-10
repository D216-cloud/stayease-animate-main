require('dotenv').config();
const mongoose = require('mongoose');

async function seedOwnerData() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    const Review = require('../src/models/Review');
    const Property = require('../src/models/Property');
    const User = require('../src/models/User');

    console.log('=== Creating Hotel Owner & Reviews ===');

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    // Find or create a hotel owner
    let owner = await User.findOne({ role: 'hotel_owner' });
    if (!owner) {
      owner = new User({
        first_name: 'Hotel',
        last_name: 'Owner',
        email: 'hotelowner@test.com',
        password: 'password123',
        role: 'hotel_owner'
      });
      await owner.save();
      console.log('Created hotel owner');
    } else {
      console.log('Found existing hotel owner:', owner.first_name, owner.last_name);
    }

    // Find or create properties for this owner
    let properties = await Property.find({ owner: owner._id });
    if (properties.length === 0) {
      const newProperty = new Property({
        name: 'Grand Owner Hotel',
        description: 'A luxury hotel owned by our test owner',
        address: '123 Owner St',
        city: 'Owner City',
        country: 'Test Country',
        owner: owner._id,
        defaultRoom: {
          name: 'Deluxe Room',
          price: 150,
          capacity: 2
        },
        images: ['hotel1.jpg'],
        amenities: ['WiFi', 'Pool', 'Spa'],
        totalReviews: 0,
        averageRating: 0
      });
      await newProperty.save();
      properties.push(newProperty);
      console.log('Created property for owner');
    } else {
      console.log(`Found ${properties.length} properties for owner`);
    }

    // Create customers for reviews
    const customers = [];
    for (let i = 1; i <= 3; i++) {
      let customer = await User.findOne({ email: `customer${i}@test.com` });
      if (!customer) {
        customer = new User({
          first_name: `Customer${i}`,
          last_name: 'Test',
          email: `customer${i}@test.com`,
          password: 'password123',
          role: 'customer'
        });
        await customer.save();
      }
      customers.push(customer);
    }

    // Create reviews for each property
    const allReviews = [];
    for (const property of properties) {
      const propertyReviews = [
        {
          customer: customers[0]._id,
          property: property._id,
          booking: new mongoose.Types.ObjectId(),
          rating: 5,
          review: 'Excellent hotel! Amazing service and beautiful rooms.',
          isVerified: true,
          helpful: 10
        },
        {
          customer: customers[1]._id,
          property: property._id,
          booking: new mongoose.Types.ObjectId(),
          rating: 4,
          review: 'Great stay! Clean rooms and friendly staff.',
          isVerified: true,
          helpful: 7
        },
        {
          customer: customers[2]._id,
          property: property._id,
          booking: new mongoose.Types.ObjectId(),
          rating: 5,
          review: 'Perfect location and wonderful amenities. Will definitely come back!',
          isVerified: true,
          helpful: 12
        },
        {
          customer: new mongoose.Types.ObjectId(),
          property: property._id,
          booking: new mongoose.Types.ObjectId(),
          rating: 4,
          review: 'Good value for money. Room was comfortable.',
          isVerified: true,
          helpful: 5
        }
      ];
      allReviews.push(...propertyReviews);
    }

    // Insert all reviews
    const createdReviews = await Review.insertMany(allReviews);
    console.log(`Created ${createdReviews.length} reviews`);

    // Update property statistics
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

    // Show final stats for the owner
    console.log('\n=== OWNER STATS ===');
    console.log(`Owner ID: ${owner._id}`);
    console.log(`Owner Email: ${owner.email}`);
    console.log(`Properties: ${properties.length}`);
    
    const ownerReviews = await Review.find({ property: { $in: properties.map(p => p._id) } });
    const totalOwnerReviews = ownerReviews.length;
    const avgOwnerRating = totalOwnerReviews > 0 
      ? ownerReviews.reduce((sum, r) => sum + r.rating, 0) / totalOwnerReviews 
      : 0;
    
    console.log(`Total Reviews: ${totalOwnerReviews}`);
    console.log(`Average Rating: ${avgOwnerRating.toFixed(2)}`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedOwnerData();
