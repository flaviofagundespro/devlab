import { JobManager } from './jobManager.js';
import { ScrapingService } from './scrapingService.js';
import { logger } from '../config/logger.js';

export class JobProcessor {
  constructor() {
    this.jobManager = JobManager.getInstance();
    this.scrapingService = new ScrapingService();
    this.isProcessing = false;
    this.processingInterval = null;
  }

  static getInstance() {
    if (!JobProcessor.instance) {
      JobProcessor.instance = new JobProcessor();
    }
    return JobProcessor.instance;
  }

  start(intervalMs = 1000) {
    if (this.isProcessing) {
      logger.warn('Job processor is already running');
      return;
    }

    this.isProcessing = true;
    this.processingInterval = setInterval(() => {
      this.processJobs().catch(error => {
        logger.error('Error in job processing loop:', error);
      });
    }, intervalMs);

    logger.info('Job processor started', { intervalMs });
  }

  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    logger.info('Job processor stopped');
  }

  async processJobs() {
    try {
      const pendingJobs = await this.jobManager.getAllJobs('pending', 10);
      const retryingJobs = await this.jobManager.getAllJobs('retrying', 5);
      
      const jobsToProcess = [...pendingJobs, ...retryingJobs]
        .sort((a, b) => {
          // Priority order: high > normal > low
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

      for (const job of jobsToProcess.slice(0, 5)) { // Process max 5 jobs at once
        await this.processJob(job);
      }
    } catch (error) {
      logger.error('Error processing jobs:', error);
    }
  }

  async processJob(job) {
    try {
      logger.info('Processing job', { jobId: job.id, type: job.type });
      
      // Update job status to running
      await this.jobManager.updateJob(job.id, {
        status: 'running',
        progress: 10,
        startedAt: new Date().toISOString()
      });

      let result;
      
      switch (job.type) {
        case 'scraping':
          result = await this.processScraping(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      // Complete the job
      await this.jobManager.completeJob(job.id, result);
      
      logger.info('Job completed successfully', { jobId: job.id });
      
    } catch (error) {
      logger.error('Job processing failed', { jobId: job.id, error: error.message });
      await this.jobManager.failJob(job.id, error);
    }
  }

  async processScraping(job) {
    const { payload } = job;
    
    // Update progress
    await this.jobManager.updateJob(job.id, { progress: 30 });
    
    // Execute scraping
    const result = await this.scrapingService.scrape(payload);
    
    // Update progress
    await this.jobManager.updateJob(job.id, { progress: 90 });
    
    return result;
  }

  async queueScrapingJob(scrapingOptions, jobOptions = {}) {
    const job = await this.jobManager.createJob('scraping', scrapingOptions, jobOptions);
    
    logger.info('Scraping job queued', { 
      jobId: job.id, 
      url: scrapingOptions.url,
      strategy: scrapingOptions.strategy 
    });
    
    return job;
  }

  async getJobStatus(jobId) {
    return await this.jobManager.getJob(jobId);
  }

  async getJobStats() {
    return await this.jobManager.getJobStats();
  }
}

