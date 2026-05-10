const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Vendor = require('../models/Vendor');

exports.createBooking = async (req, res, next) => {
  try {
    const { serviceId, date, time, address } = req.body;
    if (!serviceId || !date || !time || !address) {
      return res.status(400).json({ success: false, error: 'All fields required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const vendor = await Vendor.findOne({ serviceCategory: service.category });
    if (!vendor) {
      return res.status(404).json({ success: false, error: 'No vendor available' });
    }

    const booking = await Booking.create({
      customerId: req.user.customerId,
      vendorId: vendor._id,
      serviceId,
      date,
      time,
      address,
      status: 'Pending'
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerBookings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ customerId: id }).populate(['serviceId', 'vendorId']);
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.getVendorBookings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ vendorId: id }).populate(['serviceId', 'customerId']);
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.acceptBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (!req.user.vendorId || booking.vendorId.toString() !== req.user.vendorId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    booking.status = 'Accepted';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.deliverBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (!req.user.vendorId || booking.vendorId.toString() !== req.user.vendorId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    if (booking.status !== 'Accepted') {
      return res.status(400).json({ success: false, error: 'Booking must be accepted first' });
    }

    booking.status = 'Delivered';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.declineBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (!req.user.vendorId || booking.vendorId.toString() !== req.user.vendorId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    booking.status = 'Declined';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (!req.user.customerId || booking.customerId.toString() !== req.user.customerId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    booking.status = 'Cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};
