const request = require('supertest');
const app = require('../server');
const { connectTestDb, disconnectTestDb, clearDb } = require('./helpers/testDb');
const Service = require('../models/Service');

describe('Service APIs', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDb();

    await Service.insertMany([
      {
        name: 'Home Cleaning',
        description: 'Professional home cleaning',
        basePrice: 500,
        icon: '🧹',
        category: 'Cleaning'
      },
      {
        name: 'Plumbing',
        description: 'Plumbing services',
        basePrice: 700,
        icon: '🔧',
        category: 'Plumbing'
      },
      {
        name: 'Electrician',
        description: 'Electrical services',
        basePrice: 800,
        icon: '⚡',
        category: 'Electrician'
      }
    ]);
  });

  describe('GET /api/services', () => {
    it('should return all services', async () => {
      const res = await request(app)
        .get('/api/services');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.services.length).toBe(3);
    });

    it('should return services with required fields', async () => {
      const res = await request(app)
        .get('/api/services');

      expect(res.status).toBe(200);
      expect(res.body.services[0]).toHaveProperty('name');
      expect(res.body.services[0]).toHaveProperty('basePrice');
      expect(res.body.services[0]).toHaveProperty('icon');
      expect(res.body.services[0]).toHaveProperty('category');
    });

    it('should return empty array if no services', async () => {
      await Service.deleteMany({});

      const res = await request(app)
        .get('/api/services');

      expect(res.status).toBe(200);
      expect(res.body.services.length).toBe(0);
    });
  });
});
