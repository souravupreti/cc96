const request = require('supertest');
const app = require('../server');
const { connectTestDb, disconnectTestDb, clearDb } = require('./helpers/testDb');
const Customer = require('../models/Customer');
const OTP = require('../models/OTP');
const { hashPassword } = require('./helpers/testAuth');

describe('Auth APIs', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDb();
  });

  describe('POST /api/auth/customer/send-otp', () => {
    it('should send OTP with valid mobile', async () => {
      const res = await request(app)
        .post('/api/auth/customer/send-otp')
        .send({ mobile: '9999999999' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const otpRecord = await OTP.findOne({ mobile: '9999999999' });
      expect(otpRecord).toBeDefined();
      expect(otpRecord.otp).toBeDefined();
    });

    it('should fail with missing mobile', async () => {
      const res = await request(app)
        .post('/api/auth/customer/send-otp')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/customer/verify-otp', () => {
    it('should verify correct OTP', async () => {
      await OTP.create({
        mobile: '9999999999',
        otp: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      const res = await request(app)
        .post('/api/auth/customer/verify-otp')
        .send({ mobile: '9999999999', otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const otpRecord = await OTP.findOne({ mobile: '9999999999' });
      expect(otpRecord).toBeNull();
    });

    it('should reject wrong OTP', async () => {
      await OTP.create({
        mobile: '9999999999',
        otp: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      const res = await request(app)
        .post('/api/auth/customer/verify-otp')
        .send({ mobile: '9999999999', otp: '000000' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject expired OTP', async () => {
      await OTP.create({
        mobile: '9999999999',
        otp: '123456',
        expiresAt: new Date(Date.now() - 1000)
      });

      const res = await request(app)
        .post('/api/auth/customer/verify-otp')
        .send({ mobile: '9999999999', otp: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing mobile or OTP', async () => {
      const res = await request(app)
        .post('/api/auth/customer/verify-otp')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/customer/register', () => {
    it('should register customer successfully', async () => {
      const res = await request(app)
        .post('/api/auth/customer/register')
        .send({
          mobile: '9999999999',
          name: 'John Doe',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.customerId).toBeDefined();

      const customer = await Customer.findById(res.body.customerId);
      expect(customer.name).toBe('John Doe');
      expect(customer.mobile).toBe('9999999999');
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/customer/register')
        .send({ mobile: '9999999999' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if customer already exists', async () => {
      await Customer.create({
        mobile: '9999999999',
        name: 'John',
        passwordHash: await hashPassword('pass123'),
        isVerified: true
      });

      const res = await request(app)
        .post('/api/auth/customer/register')
        .send({
          mobile: '9999999999',
          name: 'Jane',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/customer/login', () => {
    beforeEach(async () => {
      await Customer.create({
        mobile: '9999999999',
        name: 'John Doe',
        passwordHash: await hashPassword('password123'),
        isVerified: true
      });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/customer/login')
        .send({ mobile: '9999999999', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/customer/login')
        .send({ mobile: '9999999999', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent mobile', async () => {
      const res = await request(app)
        .post('/api/auth/customer/login')
        .send({ mobile: '1111111111', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/customer/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/vendor/login', () => {
    beforeEach(async () => {
      const Vendor = require('../models/Vendor');
      await Vendor.create({
        name: 'Vendor',
        email: 'vendor@test.com',
        passwordHash: await hashPassword('vendor123'),
        serviceCategory: 'Cleaning'
      });
    });

    it('should login vendor with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/vendor/login')
        .send({ email: 'vendor@test.com', password: 'vendor123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.vendorId).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/vendor/login')
        .send({ email: 'vendor@test.com', password: 'wrongpass' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/vendor/login')
        .send({ email: 'notfound@test.com', password: 'vendor123' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/vendor/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
