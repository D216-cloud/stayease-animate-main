const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

// Helper to upload base64 or temp file path to Cloudinary
const uploadToCloudinary = async (file, folder = 'properties') => {
  if (!isCloudinaryConfigured) {
    // Fallback for development without Cloudinary: store data URL directly
    return { secure_url: typeof file === 'string' ? file : '', public_id: '' };
  }
  // file can be base64 string (data URL) or file path
  return cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
};

// POST /api/properties
// Create property (hotel owner only)
const createProperty = async (req, res) => {
  const ownerId = req.user.userId; // from auth middleware

  const {
    name,
    type,
    description = '',
    address,
    city,
    country,
    zipCode = '',
    phone,
    email,
    website = '',
    rooms,
    price,
    amenities = [],
    // images can be array of base64 data URLs
    images = [],
  // default room information (optional)
  defaultRoom = undefined,
  } = req.body;

  if (!name || !type || !address || !city || !country || !phone || !email || rooms == null || price == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Limit and sanitize images array (max 10)
  const imageInputs = Array.isArray(images) ? images.slice(0, 10) : [];

  const uploadedImages = [];
  for (const img of imageInputs) {
    // Skip empty values
    if (!img) continue;
    const uploaded = await uploadToCloudinary(img, `properties/${ownerId}`);
    uploadedImages.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
  }

  const property = await Property.create({
    owner: ownerId,
    name,
    type,
    description,
    address,
    city,
    country,
    zipCode,
    phone,
    email,
    website,
    rooms,
    price,
    amenities,
  images: uploadedImages.slice(0, 10),
  ...(defaultRoom ? { defaultRoom } : {}),
  });

  return res.status(201).json({ success: true, data: property });
};

// GET /api/properties/mine
const getMyProperties = async (req, res) => {
  const ownerId = req.user.userId;
  const properties = await Property.find({ owner: ownerId }).sort({ createdAt: -1 });
  return res.json({ success: true, data: properties });
};

module.exports = {
  createProperty,
  getMyProperties,
};

// GET /api/properties/:id
// Get a single property owned by the authenticated hotel owner
const getPropertyById = async (req, res) => {
  const ownerId = req.user.userId;
  const { id } = req.params;

  const property = await Property.findOne({ _id: id, owner: ownerId });
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  return res.json({ success: true, data: property });
};

// PUT /api/properties/:id
// Update a property (hotel owner only)
const updateProperty = async (req, res) => {
  const ownerId = req.user.userId;
  const { id } = req.params;

  const property = await Property.findOne({ _id: id, owner: ownerId });
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const allowedFields = [
    'name', 'type', 'description', 'address', 'city', 'country', 'zipCode',
  'phone', 'email', 'website', 'rooms', 'price', 'amenities', 'isActive', 'defaultRoom'
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      property[field] = req.body[field];
    }
  }

  // Optional: handle new images upload if provided as base64 array
  if (Array.isArray(req.body.newImages) && req.body.newImages.length) {
    const remainingSlots = Math.max(0, 10 - (property.images?.length || 0));
    const toProcess = req.body.newImages.slice(0, remainingSlots);
    const uploadedImages = [];
    for (const img of toProcess) {
      if (!img) continue;
      const uploaded = await uploadToCloudinary(img, `properties/${ownerId}`);
      uploadedImages.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
    }
    property.images = [...(property.images || []), ...uploadedImages];
  }

  // Optional: remove images by public_id
  if (Array.isArray(req.body.removeImagePublicIds) && req.body.removeImagePublicIds.length) {
    const toRemove = new Set(req.body.removeImagePublicIds);
    // Delete from cloudinary (best-effort)
    for (const publicId of toRemove) {
      try { await cloudinary.uploader.destroy(publicId); } catch (e) { /* noop */ }
    }
    property.images = property.images.filter(img => !toRemove.has(img.public_id));
  }

  // Ensure max 10 images after updates
  if (Array.isArray(property.images) && property.images.length > 10) {
    property.images = property.images.slice(0, 10);
  }

  await property.save();
  return res.json({ success: true, data: property });
};

// DELETE /api/properties/:id
// Delete a property (hotel owner only)
const deleteProperty = async (req, res) => {
  const ownerId = req.user.userId;
  const { id } = req.params;

  const property = await Property.findOne({ _id: id, owner: ownerId });
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  // Best-effort delete images from Cloudinary
  if (isCloudinaryConfigured) {
    for (const img of property.images || []) {
      if (!img.public_id) continue;
      try { await cloudinary.uploader.destroy(img.public_id); } catch (e) { /* noop */ }
    }
  }

  await Property.deleteOne({ _id: id });
  return res.json({ success: true, message: 'Property deleted' });
};

module.exports.getPropertyById = getPropertyById;
module.exports.updateProperty = updateProperty;
module.exports.deleteProperty = deleteProperty;
