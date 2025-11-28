import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

export const apiKeyAuth = (req, res, next) => {
  // Skip authentication if no API keys are configured
  if (!config.apiKeys || config.apiKeys.length === 0) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    logger.warn('API request without API key', {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required',
    });
  }

  if (!config.apiKeys.includes(apiKey)) {
    logger.warn('API request with invalid API key', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      apiKey: apiKey.substring(0, 8) + '...',
    });
    
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
    });
  }

  // Add API key to request for logging
  req.apiKey = apiKey;
  next();
};

