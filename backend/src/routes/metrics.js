import { Router } from 'express';
import { MetricsController } from '../controllers/metricsController.js';

const router = Router();
const metricsController = new MetricsController();

// Prometheus metrics endpoint
router.get('/', (req, res, next) => {
  metricsController.getPrometheusMetrics(req, res, next);
});

// JSON metrics endpoint
router.get('/json', (req, res, next) => {
  metricsController.getJsonMetrics(req, res, next);
});

export { router as metricsRoutes };

