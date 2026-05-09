const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Vendor = require('../models/Vendor');
const Service = require('../models/Service');

const services = [
  { name: 'Home Cleaning', description: 'Professional home cleaning service', basePrice: 500, icon: '🧹', category: 'Cleaning' },
  { name: 'Plumbing', description: 'Expert plumbing services', basePrice: 700, icon: '🔧', category: 'Plumbing' },
  { name: 'Electrician', description: 'Licensed electrician services', basePrice: 800, icon: '⚡', category: 'Electrician' },
  { name: 'Painting', description: 'Professional painting services', basePrice: 1000, icon: '🎨', category: 'Painting' },
  { name: 'Pest Control', description: 'Pest control and management', basePrice: 600, icon: '🦟', category: 'Pest Control' }
];

async function seedOnStartup() {
  try {
    // Only seed if vendor doesn't exist yet
    const existingVendor = await Vendor.findOne({ email: 'vendor@test.com' });
    if (existingVendor) {
      console.log('[SEED] Data already exists, skipping seed');
      return;
    }

    const passwordHash = await bcrypt.hash('vendor123', 10);
    const vendor = await Vendor.create({
      name: 'Test Vendor',
      email: 'vendor@test.com',
      passwordHash,
      serviceCategory: 'Cleaning'
    });

    await Service.insertMany(services);

    console.log('[SEED] Vendor created:', vendor._id);
    console.log('[SEED] 5 services created');
    console.log('[SEED] Seed completed successfully');
  } catch (error) {
    console.error('[SEED] Error:', error.message);
  }
}

// Allow running directly with `node seed/seedData.js`
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');
    // Force re-seed when running directly
    await Vendor.deleteMany({});
    await Service.deleteMany({});
    await seedOnStartup();
    process.exit(0);
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = seedOnStartup;
