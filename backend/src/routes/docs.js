import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger.js';

const router = Router();

// Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'APIBR API Documentation',
}));

// JSON spec endpoint
router.get('/spec', (req, res) => {
  res.json(swaggerSpec);
});

export { router as docsRoutes };

