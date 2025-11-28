import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimit.window,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });
    
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
    });
  },
});

