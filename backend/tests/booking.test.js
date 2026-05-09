const request = require('supertest');
const app = require('../server');
const { connectTestDb, disconnectTestDb, clearDb } = require('./helpers/testDb');
const { generateTestToken, hashPassword } = require('./helpers/testAuth');
const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Service = require('../models/Service');

describe('Booking APIs', () => {
  let customerToken, vendorToken, customerId, vendorId, serviceId;

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDb();

    const customer = await Customer.create({
      name: 'Customer',
      mobile: '9999999999',
      passwordHash: await hashPassword('pass123'),
      isVerified: true
    });
    customerId = customer._id;
    customerToken = generateTestToken({ customerId, mobile: '9999999999', userType: 'customer' });

    const vendor = await Vendor.create({
      name: 'Vendor',
      email: 'vendor@test.com',
      passwordHash: await hashPassword('vendor123'),
      serviceCategory: 'Cleaning'
    });
    vendorId = vendor._id;
    vendorToken = generateTestToken({ vendorId, email: 'vendor@test.com', userType: 'vendor' });

    const service = await Service.create({
      name: 'Home Cleaning',
      description: 'Cleaning service',
      basePrice: 500,
      icon: '🧹',
      category: 'Cleaning'
    });
    serviceId = service._id;
  });

  describe('POST /api/bookings', () => {
    it('should create booking for authenticated customer', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          serviceId,
          date: '2026-06-01',
          time: '10:00',
          address: '123 Main St'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.booking.status).toBe('Pending');
      expect(res.body.booking.customerId.toString()).toBe(customerId.toString());
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({
          serviceId,
          date: '2026-06-01',
          time: '10:00',
          address: '123 Main St'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ serviceId });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/customer/:id', () => {
    beforeEach(async () => {
      await Booking.create({
        customerId,
        vendorId,
        serviceId,
        date: '2026-06-01',
        time: '10:00',
        address: '123 Main St',
        status: 'Pending'
      });
    });

    it('should return customer bookings', async () => {
      const res = await request(app)
        .get(`/api/bookings/customer/${customerId}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.bookings.length).toBe(1);
      expect(res.body.bookings[0].status).toBe('Pending');
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get(`/api/bookings/customer/${customerId}`);

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/bookings/vendor/:id', () => {
    beforeEach(async () => {
      await Booking.create({
        customerId,
        vendorId,
        serviceId,
        date: '2026-06-01',
        time: '10:00',
        address: '123 Main St',
        status: 'Pending'
      });
    });

    it('should return vendor bookings', async () => {
      const res = await request(app)
        .get(`/api/bookings/vendor/${vendorId}`)
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.bookings.length).toBe(1);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get(`/api/bookings/vendor/${vendorId}`);

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/bookings/:id/accept', () => {
    let bookingId;

    beforeEach(async () => {
      const booking = await Booking.create({
        customerId,
        vendorId,
        serviceId,
        date: '2026-06-01',
        time: '10:00',
        address: '123 Main St',
        status: 'Pending'
      });
      bookingId = booking._id;
    });

    it('should accept booking as vendor', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/accept`)
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.booking.status).toBe('Accepted');
    });

    it('should fail if customer tries to accept', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/accept`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/accept`);

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/bookings/:id/deliver', () => {
    let bookingId;

    beforeEach(async () => {
      const booking = await Booking.create({
        customerId,
        vendorId,
        serviceId,
        date: '2026-06-01',
        time: '10:00',
        address: '123 Main St',
        status: 'Accepted'
      });
      bookingId = booking._id;
    });

    it('should deliver booking as vendor', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/deliver`)
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.booking.status).toBe('Delivered');
    });

    it('should fail if not in Accepted status', async () => {
      const booking = await Booking.create({
        customerId,
        vendorId,
        serviceId,
        date: '2026-06-01',
        time: '10:00',
        address: '123 Main St',
        status: 'Pending'
      });

      const res = await request(app)
        .patch(`/api/bookings/${booking._id}/deliver`)
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if customer tries to deliver', async () => {
      const res = await request(app)
        .patch(`/api/bookings/${bookingId}/deliver`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });
});
