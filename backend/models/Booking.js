const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  vendorId: mongoose.Schema.Types.ObjectId,
  serviceId: mongoose.Schema.Types.ObjectId,
  date: String,
  time: String,
  address: String,
  status: { type: String, enum: ['Pending', 'Accepted', 'Delivered', 'Declined', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
