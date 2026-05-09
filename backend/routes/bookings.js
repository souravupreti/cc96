const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/customer/:id', authMiddleware, bookingController.getCustomerBookings);
router.get('/vendor/:id', authMiddleware, bookingController.getVendorBookings);
router.patch('/:id/accept', authMiddleware, bookingController.acceptBooking);
router.patch('/:id/deliver', authMiddleware, bookingController.deliverBooking);

module.exports = router;
