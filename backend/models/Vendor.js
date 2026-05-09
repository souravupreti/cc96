const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VendorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: String,
  serviceCategory: String,
  createdAt: { type: Date, default: Date.now }
});

VendorSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('Vendor', VendorSchema);
