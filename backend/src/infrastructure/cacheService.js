import Redis from 'ioredis';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

class CacheService {
  constructor() {
    this.redis = null;
    this.connected = false;
  }

  static getInstance() {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async connect() {
    if (this.connected) return;

    try {
      this.redis = new Redis(config.redis.url, {
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: true,
      });

      this.redis.on('connect', () => {
        logger.info('Redis connected');
        this.connected = true;
      });

      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.connected = false;
      });

      this.redis.on('close', () => {
        logger.warn('Redis connection closed');
        this.connected = false;
      });

      await this.redis.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      // Don't throw error - cache should be optional
      this.connected = false;
    }
  }

  async get(key) {
    if (!this.connected || !this.redis) {
      logger.debug('Cache miss - Redis not connected:', key);
      return null;
    }

    try {
      const value = await this.redis.get(key);
      if (value) {
        logger.debug('Cache hit:', key);
        return JSON.parse(value);
      }
      logger.debug('Cache miss:', key);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = config.redis.ttl) {
    if (!this.connected || !this.redis) {
      logger.debug('Cache set skipped - Redis not connected:', key);
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl, serialized);
      logger.debug('Cache set:', key, 'TTL:', ttl);
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.connected || !this.redis) {
      return false;
    }

    try {
      await this.redis.del(key);
      logger.debug('Cache deleted:', key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.connected || !this.redis) {
      return false;
    }

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  async flush() {
    if (!this.connected || !this.redis) {
      return false;
    }

    try {
      await this.redis.flushdb();
      logger.info('Cache flushed');
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  generateKey(prefix, ...parts) {
    return `${prefix}:${parts.join(':')}`;
  }

  async disconnect() {
    if (this.redis) {
      await this.redis.disconnect();
      this.connected = false;
      logger.info('Redis disconnected');
    }
  }

  getStats() {
    return {
      connected: this.connected,
      url: config.redis.url,
      ttl: config.redis.ttl,
    };
  }
}

export { CacheService };

