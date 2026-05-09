const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  mobile: String,
  otp: String,
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } }
});

module.exports = mongoose.model('OTP', OTPSchema);
