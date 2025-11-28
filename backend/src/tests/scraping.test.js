import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app.js';
import { BrowserPool } from '../infrastructure/browserPool.js';

describe('Scraping Tests', () => {
  beforeAll(async () => {
    await BrowserPool.getInstance().initialize();
  });

  afterAll(async () => {
    await BrowserPool.getInstance().destroy();
  });

  describe('Synchronous Scraping', () => {
    test('POST /api/scrape with basic strategy should work', async () => {
      const scrapeRequest = {
        strategy: 'basic',
        url: 'https://httpbin.org/html',
        selectors: {
          title: {
            query: 'h1'
          }
        }
      };

      const response = await request(app)
        .post('/api/scrape')
        .send(scrapeRequest)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.metadata).toHaveProperty('strategy', 'basic');
      expect(response.body.metadata).toHaveProperty('executionTime');
    }, 30000);

    test('POST /api/scrape with screenshot strategy should work', async () => {
      const scrapeRequest = {
        strategy: 'screenshot',
        url: 'https://httpbin.org/html',
        screenshotOptions: {
          type: 'png',
          fullPage: false
        }
      };

      const response = await request(app)
        .post('/api/scrape')
        .send(scrapeRequest)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('screenshot');
      expect(response.body.data).toHaveProperty('url');
    }, 30000);

    test('POST /api/scrape with invalid strategy should return 400', async () => {
      const scrapeRequest = {
        strategy: 'invalid',
        url: 'https://httpbin.org/html'
      };

      const response = await request(app)
        .post('/api/scrape')
        .send(scrapeRequest)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/scrape with missing URL should return 400', async () => {
      const scrapeRequest = {
        strategy: 'basic',
        selectors: {
          title: { query: 'h1' }
        }
      };

      const response = await request(app)
        .post('/api/scrape')
        .send(scrapeRequest)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Asynchronous Scraping', () => {
    test('POST /api/scrape/async should queue job', async () => {
      const scrapeRequest = {
        strategy: 'basic',
        url: 'https://httpbin.org/html',
        selectors: {
          title: {
            query: 'h1'
          }
        },
        priority: 'normal'
      };

      const response = await request(app)
        .post('/api/scrape/async')
        .send(scrapeRequest)
        .expect(202);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('jobId');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.body).toHaveProperty('statusUrl');

      // Test job status endpoint
      const jobId = response.body.jobId;
      const statusResponse = await request(app)
        .get(`/api/jobs/${jobId}`)
        .expect(200);

      expect(statusResponse.body).toHaveProperty('jobId', jobId);
      expect(statusResponse.body).toHaveProperty('status');
    });

    test('GET /api/jobs/invalid-id should return 404', async () => {
      await request(app)
        .get('/api/jobs/invalid-job-id')
        .expect(404);
    });
  });
});

