import { MetricsService } from '../services/metricsService.js';

export const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const metricsService = MetricsService.getInstance();

  // Store original end method
  const originalEnd = res.end;

  // Override end method to capture metrics
  res.end = function(...args) {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.path;
    
    // Record HTTP request metrics
    metricsService.recordHttpRequest(
      req.method,
      route,
      res.statusCode,
      duration
    );

    // Call original end method
    originalEnd.apply(this, args);
  };

  next();
};

