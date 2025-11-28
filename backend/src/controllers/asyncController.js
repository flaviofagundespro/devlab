import { JobProcessor } from '../services/jobProcessor.js';
import { validateScrapeRequest, asyncScrapeSchema } from '../utils/validation.js';
import { logger } from '../config/logger.js';

export class AsyncController {
  constructor() {
    this.jobProcessor = JobProcessor.getInstance();
  }

  async scrapeAsync(req, res, next) {
    try {
      // Validate request
      const { error, value } = asyncScrapeSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      // Extract job options
      const { webhook, priority, ...scrapingOptions } = value;
      
      // Validate scraping options
      const scrapingValidation = validateScrapeRequest(scrapingOptions);
      if (scrapingValidation.error) {
        return res.status(400).json({
          error: 'Scraping Validation Error',
          details: scrapingValidation.error.details.map(d => d.message)
        });
      }

      // Queue the job
      const job = await this.jobProcessor.queueScrapingJob(scrapingOptions, {
        webhook,
        priority
      });

      res.status(202).json({
        message: 'Job queued successfully',
        jobId: job.id,
        status: job.status,
        createdAt: job.createdAt,
        estimatedCompletion: this.estimateCompletion(job.priority),
        statusUrl: `/api/jobs/${job.id}`
      });

    } catch (error) {
      logger.error('Async scrape controller error:', error);
      next(error);
    }
  }

  async getJobStatus(req, res, next) {
    try {
      const { id } = req.params;
      
      const job = await this.jobProcessor.getJobStatus(id);
      
      if (!job) {
        return res.status(404).json({
          error: 'Job Not Found',
          message: `Job with ID ${id} was not found`
        });
      }

      res.json({
        jobId: job.id,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        failedAt: job.failedAt,
        result: job.result,
        error: job.error,
        retries: job.retries,
        maxRetries: job.maxRetries
      });

    } catch (error) {
      logger.error('Get job status error:', error);
      next(error);
    }
  }

  async getJobStats(req, res, next) {
    try {
      const stats = await this.jobProcessor.getJobStats();
      
      res.json({
        jobs: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get job stats error:', error);
      next(error);
    }
  }

  estimateCompletion(priority) {
    const baseTime = 30; // seconds
    const multiplier = {
      high: 0.5,
      normal: 1,
      low: 2
    };
    
    const estimatedSeconds = baseTime * (multiplier[priority] || 1);
    const completionTime = new Date(Date.now() + estimatedSeconds * 1000);
    
    return completionTime.toISOString();
  }
}

