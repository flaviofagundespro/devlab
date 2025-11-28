import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger.js';
import { CacheService } from '../infrastructure/cacheService.js';

export class JobManager {
  constructor() {
    this.jobs = new Map();
    this.cacheService = CacheService.getInstance();
  }

  static getInstance() {
    if (!JobManager.instance) {
      JobManager.instance = new JobManager();
    }
    return JobManager.instance;
  }

  async createJob(type, payload, options = {}) {
    const jobId = uuidv4();
    const job = {
      id: jobId,
      type,
      payload,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      result: null,
      error: null,
      webhook: options.webhook || null,
      priority: options.priority || 'normal',
      retries: 0,
      maxRetries: options.maxRetries || 3,
    };

    // Store in memory
    this.jobs.set(jobId, job);
    
    // Store in cache for persistence
    await this.cacheService.set(`job:${jobId}`, job, 86400); // 24 hours TTL
    
    logger.info('Job created', { jobId, type, priority: job.priority });
    
    return job;
  }

  async getJob(jobId) {
    // Try memory first
    let job = this.jobs.get(jobId);
    
    if (!job) {
      // Try cache
      job = await this.cacheService.get(`job:${jobId}`);
      if (job) {
        this.jobs.set(jobId, job);
      }
    }
    
    return job;
  }

  async updateJob(jobId, updates) {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    Object.assign(job, updates, {
      updatedAt: new Date().toISOString()
    });

    this.jobs.set(jobId, job);
    await this.cacheService.set(`job:${jobId}`, job, 86400);
    
    logger.debug('Job updated', { jobId, status: job.status, progress: job.progress });
    
    return job;
  }

  async completeJob(jobId, result) {
    const job = await this.updateJob(jobId, {
      status: 'completed',
      progress: 100,
      result,
      completedAt: new Date().toISOString()
    });

    // Send webhook if configured
    if (job.webhook) {
      await this.sendWebhook(job);
    }

    return job;
  }

  async failJob(jobId, error) {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.retries++;
    
    if (job.retries < job.maxRetries) {
      // Retry the job
      await this.updateJob(jobId, {
        status: 'retrying',
        error: error.message,
        retries: job.retries
      });
      
      logger.warn('Job failed, retrying', { 
        jobId, 
        retries: job.retries, 
        maxRetries: job.maxRetries,
        error: error.message 
      });
      
      return job;
    } else {
      // Mark as failed
      const failedJob = await this.updateJob(jobId, {
        status: 'failed',
        error: error.message,
        failedAt: new Date().toISOString()
      });

      // Send webhook if configured
      if (failedJob.webhook) {
        await this.sendWebhook(failedJob);
      }

      return failedJob;
    }
  }

  async sendWebhook(job) {
    if (!job.webhook) return;

    try {
      const axios = (await import('axios')).default;
      
      const payload = {
        jobId: job.id,
        status: job.status,
        result: job.result,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt || job.failedAt,
        progress: job.progress
      };

      await axios({
        method: job.webhook.method || 'POST',
        url: job.webhook.url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          ...job.webhook.headers
        },
        timeout: 10000
      });

      logger.info('Webhook sent successfully', { jobId: job.id, webhookUrl: job.webhook.url });
    } catch (error) {
      logger.error('Failed to send webhook', { 
        jobId: job.id, 
        webhookUrl: job.webhook.url, 
        error: error.message 
      });
    }
  }

  async getAllJobs(status = null, limit = 100) {
    const jobs = Array.from(this.jobs.values());
    
    let filteredJobs = jobs;
    if (status) {
      filteredJobs = jobs.filter(job => job.status === status);
    }
    
    return filteredJobs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  async getJobStats() {
    const jobs = Array.from(this.jobs.values());
    
    const stats = {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      running: jobs.filter(j => j.status === 'running').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      retrying: jobs.filter(j => j.status === 'retrying').length,
    };
    
    return stats;
  }

  async cleanupOldJobs(maxAge = 86400000) { // 24 hours in ms
    const now = Date.now();
    const jobsToDelete = [];
    
    for (const [jobId, job] of this.jobs.entries()) {
      const jobAge = now - new Date(job.createdAt).getTime();
      if (jobAge > maxAge && ['completed', 'failed'].includes(job.status)) {
        jobsToDelete.push(jobId);
      }
    }
    
    for (const jobId of jobsToDelete) {
      this.jobs.delete(jobId);
      await this.cacheService.del(`job:${jobId}`);
    }
    
    if (jobsToDelete.length > 0) {
      logger.info('Cleaned up old jobs', { count: jobsToDelete.length });
    }
    
    return jobsToDelete.length;
  }
}

