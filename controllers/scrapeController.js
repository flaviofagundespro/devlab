import { ScrapingService } from '../services/scrapingService.js';
import { validateScrapeRequest } from '../utils/validation.js';
import { logger } from '../config/logger.js';

export class ScrapeController {
  constructor() {
    this.scrapingService = new ScrapingService();
  }

  async scrape(req, res, next) {
    const startTime = Date.now();
    
    try {
      // Validate request
      const { error, value } = validateScrapeRequest(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      // Execute scraping
      const result = await this.scrapingService.scrape(value);
      
      // Add execution time
      result.metadata.executionTime = Date.now() - startTime;
      
      res.json(result);
      
    } catch (error) {
      logger.error('Scrape controller error:', error);
      next(error);
    }
  }

  async getPoolStats(req, res, next) {
    try {
      const stats = await this.scrapingService.getPoolStats();
      res.json({
        browserPool: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Pool stats error:', error);
      next(error);
    }
  }
}

