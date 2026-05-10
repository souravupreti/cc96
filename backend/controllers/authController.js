const bcrypt = require('bcryptjs');
const axios = require('axios');
const Customer = require('../models/Customer');
const OTP = require('../models/OTP');
const generateOTP = require('../utils/otpGenerator');
const generateToken = require('../utils/tokenGenerator');

exports.sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, error: 'Mobile number required' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OTP.deleteMany({ mobile });
    await OTP.create({ mobile, otp, expiresAt });

    // Development Mode Fallback
    if (!process.env.FAST2SMS_KEY || process.env.FAST2SMS_KEY === 'your_api_key_here') {
      console.warn('Fast2SMS API key missing. Logging OTP to console for development.');
      console.log(`[OTP DEBUG] Mobile: ${mobile}, OTP: ${otp}`);
      return res.json({ success: true, message: 'OTP sent (Development Mode)' });
    }

    try {
      await axios.get('https://www.fast2sms.com/dev/bulkV2', {
        params: {
          authorization: process.env.FAST2SMS_KEY,
          message: `Your ServiceHub OTP is ${otp}. Valid for 5 minutes.`,
          language: 'english',
          route: 'q',
          numbers: mobile
        }
      });
      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Fast2SMS error:', err.response?.data || err.message);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, error: 'Mobile and OTP required' });
    }

    const otpRecord = await OTP.findOne({ mobile, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ success: false, error: 'OTP expired' });
    }

    await OTP.deleteOne({ _id: otpRecord._id });
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { mobile, name, password } = req.body;
    if (!mobile || !name || !password) {
      return res.status(400).json({ success: false, error: 'All fields required' });
    }

    const existing = await Customer.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Customer already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      mobile,
      name,
      passwordHash,
      isVerified: true
    });

    const token = generateToken({ customerId: customer._id, mobile, userType: 'customer' });
    res.status(201).json({ success: true, token, customerId: customer._id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ success: false, error: 'Mobile and password required' });
    }

    const customer = await Customer.findOne({ mobile });
    if (!customer) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await customer.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({ customerId: customer._id, mobile, userType: 'customer' });
    res.json({ success: true, token, customerId: customer._id });
  } catch (error) {
    next(error);
  }
};

exports.vendorLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const Vendor = require('../models/Vendor');
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await vendor.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({ vendorId: vendor._id, email, userType: 'vendor' });
    res.json({ success: true, token, vendorId: vendor._id });
  } catch (error) {
    next(error);
  }
};
