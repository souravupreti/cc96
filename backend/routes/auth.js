const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/customer/send-otp', authController.sendOtp);
router.post('/customer/verify-otp', authController.verifyOtp);
router.post('/customer/register', authController.register);
router.post('/customer/login', authController.login);
router.post('/vendor/login', authController.vendorLogin);

module.exports = router;
