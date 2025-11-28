import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { BrowserPool } from '../infrastructure/browserPool.js';

describe('API Basic Tests', () => {
  beforeAll(async () => {
    // Initialize browser pool for tests
    await BrowserPool.getInstance().initialize();
  });

  afterAll(async () => {
    // Cleanup browser pool after tests
    await BrowserPool.getInstance().destroy();
  });

  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('API Info', () => {
    test('GET /api should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Documentation', () => {
    test('GET /api/docs/spec should return Swagger spec', async () => {
      const response = await request(app)
        .get('/api/docs/spec')
        .expect(200);

      expect(response.body).toHaveProperty('openapi');
      expect(response.body).toHaveProperty('info');
      expect(response.body).toHaveProperty('paths');
    });
  });

  describe('Metrics', () => {
    test('GET /api/metrics should return Prometheus metrics', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(response.text).toContain('apibr_');
      expect(response.headers['content-type']).toContain('text/plain');
    });

    test('GET /api/metrics/json should return JSON metrics', async () => {
      const response = await request(app)
        .get('/api/metrics/json')
        .expect(200);

      expect(response.body).toHaveProperty('metrics');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Browser Pool Stats', () => {
    test('GET /api/scrape/stats should return browser pool stats', async () => {
      const response = await request(app)
        .get('/api/scrape/stats')
        .expect(200);

      expect(response.body).toHaveProperty('browserPool');
      expect(response.body.browserPool).toHaveProperty('total');
      expect(response.body.browserPool).toHaveProperty('available');
      expect(response.body.browserPool).toHaveProperty('busy');
    });
  });

  describe('Job Stats', () => {
    test('GET /api/jobs should return job statistics', async () => {
      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(response.body).toHaveProperty('jobs');
      expect(response.body.jobs).toHaveProperty('total');
      expect(response.body.jobs).toHaveProperty('pending');
      expect(response.body.jobs).toHaveProperty('running');
    });
  });
});

