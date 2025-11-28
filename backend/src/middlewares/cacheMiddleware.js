import crypto from 'crypto';
import { CacheService } from '../infrastructure/cacheService.js';
import { logger } from '../config/logger.js';

export const cacheMiddleware = (ttl) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheService = CacheService.getInstance();
    
    // Generate cache key based on URL and query parameters
    const cacheKey = generateCacheKey(req);
    
    try {
      // Try to get from cache
      const cachedResult = await cacheService.get(cacheKey);
      
      if (cachedResult) {
        logger.debug('Serving from cache:', cacheKey);
        return res.json({
          ...cachedResult,
          cached: true,
          cacheKey
        });
      }

      // Store original res.json method
      const originalJson = res.json;
      
      // Override res.json to cache the response
      res.json = function(data) {
        // Cache the response
        cacheService.set(cacheKey, data, ttl).catch(error => {
          logger.error('Failed to cache response:', error);
        });
        
        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

function generateCacheKey(req) {
  const url = req.originalUrl || req.url;
  const method = req.method;
  const body = req.body ? JSON.stringify(req.body) : '';
  
  const hash = crypto
    .createHash('md5')
    .update(`${method}:${url}:${body}`)
    .digest('hex');
    
  return `cache:${hash}`;
}

