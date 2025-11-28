import { logger } from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Default error
  let error = {
    message: 'Internal Server Error',
    status: 500,
  };

  // Validation errors
  if (err.isJoi) {
    error.message = err.details[0].message;
    error.status = 400;
  }

  // Custom application errors
  if (err.status) {
    error.status = err.status;
    error.message = err.message;
  }

  res.status(error.status).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

