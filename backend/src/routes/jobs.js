import { Router } from 'express';
import { AsyncController } from '../controllers/asyncController.js';

const router = Router();
const asyncController = new AsyncController();

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job status
 *     description: Get the status and details of a specific job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res, next) => {
  asyncController.getJobStatus(req, res, next);
});

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get job statistics
 *     description: Get overall job queue statistics
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Job statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pending:
 *                       type: integer
 *                     running:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     retrying:
 *                       type: integer
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res, next) => {
  asyncController.getJobStats(req, res, next);
});

export { router as jobRoutes };

