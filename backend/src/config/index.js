import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Browser Pool Configuration
  browserPool: {
    size: parseInt(process.env.BROWSER_POOL_SIZE) || 5,
    headless: process.env.BROWSER_HEADLESS !== 'false',
    timeout: parseInt(process.env.BROWSER_TIMEOUT) || 30000,
  },
  
  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },
  
  // Proxy Configuration
  proxy: {
    list: process.env.PROXY_LIST ? process.env.PROXY_LIST.split(',') : [],
    rotation: process.env.PROXY_ROTATION === 'true',
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  
  // Webhook Configuration
  webhook: {
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT) || 10000,
    retries: parseInt(process.env.WEBHOOK_RETRIES) || 3,
  },
  
  // Security
  apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
  
  // Python Server Configuration
  pythonServerUrl: process.env.PYTHON_SERVER_URL || 'http://localhost:5001',
};

