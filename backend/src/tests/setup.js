import { jest } from '@jest/globals';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.BROWSER_POOL_SIZE = '1';
process.env.BROWSER_HEADLESS = 'true';
process.env.LOG_LEVEL = 'error';
process.env.REDIS_URL = 'redis://localhost:6379';

// Increase timeout for browser operations
jest.setTimeout(30000);

