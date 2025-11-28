import { Router } from 'express';
import { ScrapeController } from '../controllers/scrapeController.js';
import { AsyncController } from '../controllers/asyncController.js';

const router = Router();
const scrapeController = new ScrapeController();
const asyncController = new AsyncController();

/**
 * @swagger
 * /api/scrape:
 *   post:
 *     summary: Synchronous web scraping
 *     description: Perform web scraping synchronously and return results immediately
 *     tags: [Scraping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScrapeRequest'
 *           examples:
 *             basic:
 *               summary: Basic HTML scraping
 *               value:
 *                 strategy: "basic"
 *                 url: "https://example.com"
 *                 selectors:
 *                   title:
 *                     query: "h1"
 *                   links:
 *                     query: "a"
 *                     attribute: "href"
 *                     multiple: true
 *             screenshot:
 *               summary: Screenshot capture
 *               value:
 *                 strategy: "screenshot"
 *                 url: "https://example.com"
 *                 screenshotOptions:
 *                   fullPage: true
 *                   type: "png"
 *     responses:
 *       200:
 *         description: Scraping completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapeResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res, next) => {
  scrapeController.scrape(req, res, next);
});

/**
 * @swagger
 * /api/scrape/async:
 *   post:
 *     summary: Asynchronous web scraping
 *     description: Queue a web scraping job for asynchronous processing
 *     tags: [Scraping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsyncScrapeRequest'
 *           example:
 *             strategy: "basic"
 *             url: "https://example.com"
 *             selectors:
 *               title:
 *                 query: "h1"
 *             webhook:
 *               url: "https://your-app.com/webhook"
 *               method: "POST"
 *             priority: "normal"
 *     responses:
 *       202:
 *         description: Job queued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                 statusUrl:
 *                   type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/async', (req, res, next) => {
  asyncController.scrapeAsync(req, res, next);
});

/**
 * @swagger
 * /api/scrape/stats:
 *   get:
 *     summary: Get browser pool statistics
 *     description: Get current browser pool status and statistics
 *     tags: [Scraping]
 *     responses:
 *       200:
 *         description: Browser pool statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 browserPool:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     available:
 *                       type: integer
 *                     busy:
 *                       type: integer
 *                     initialized:
 *                       type: boolean
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/stats', (req, res, next) => {
  scrapeController.getPoolStats(req, res, next);
});

export { router as scrapeRoutes };

