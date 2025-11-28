import promClient from 'prom-client';
import { logger } from '../config/logger.js';

class MetricsService {
  constructor() {
    // Create a Registry to register the metrics
    this.register = new promClient.Registry();
    
    // Add default metrics
    promClient.collectDefaultMetrics({
      register: this.register,
      prefix: 'apibr_',
    });

    // Custom metrics
    this.httpRequestsTotal = new promClient.Counter({
      name: 'apibr_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestDuration = new promClient.Histogram({
      name: 'apibr_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
      registers: [this.register],
    });

    this.scrapingJobsTotal = new promClient.Counter({
      name: 'apibr_scraping_jobs_total',
      help: 'Total number of scraping jobs',
      labelNames: ['strategy', 'status'],
      registers: [this.register],
    });

    this.scrapingJobDuration = new promClient.Histogram({
      name: 'apibr_scraping_job_duration_seconds',
      help: 'Duration of scraping jobs in seconds',
      labelNames: ['strategy', 'status'],
      buckets: [1, 5, 10, 30, 60, 120, 300],
      registers: [this.register],
    });

    this.browserPoolSize = new promClient.Gauge({
      name: 'apibr_browser_pool_size',
      help: 'Current browser pool size',
      labelNames: ['status'],
      registers: [this.register],
    });

    this.cacheOperations = new promClient.Counter({
      name: 'apibr_cache_operations_total',
      help: 'Total number of cache operations',
      labelNames: ['operation', 'result'],
      registers: [this.register],
    });

    this.activeJobs = new promClient.Gauge({
      name: 'apibr_active_jobs',
      help: 'Number of active jobs by status',
      labelNames: ['status'],
      registers: [this.register],
    });

    this.webhookRequests = new promClient.Counter({
      name: 'apibr_webhook_requests_total',
      help: 'Total number of webhook requests',
      labelNames: ['status'],
      registers: [this.register],
    });
  }

  static getInstance() {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  // HTTP request metrics
  recordHttpRequest(method, route, statusCode, duration) {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode,
    });

    this.httpRequestDuration.observe(
      {
        method,
        route,
        status_code: statusCode,
      },
      duration
    );
  }

  // Scraping job metrics
  recordScrapingJob(strategy, status, duration) {
    this.scrapingJobsTotal.inc({
      strategy,
      status,
    });

    if (duration !== undefined) {
      this.scrapingJobDuration.observe(
        {
          strategy,
          status,
        },
        duration
      );
    }
  }

  // Browser pool metrics
  updateBrowserPoolMetrics(stats) {
    this.browserPoolSize.set({ status: 'total' }, stats.total);
    this.browserPoolSize.set({ status: 'available' }, stats.available);
    this.browserPoolSize.set({ status: 'busy' }, stats.busy);
  }

  // Cache metrics
  recordCacheOperation(operation, result) {
    this.cacheOperations.inc({
      operation,
      result,
    });
  }

  // Job metrics
  updateJobMetrics(stats) {
    this.activeJobs.set({ status: 'pending' }, stats.pending);
    this.activeJobs.set({ status: 'running' }, stats.running);
    this.activeJobs.set({ status: 'completed' }, stats.completed);
    this.activeJobs.set({ status: 'failed' }, stats.failed);
    this.activeJobs.set({ status: 'retrying' }, stats.retrying);
  }

  // Webhook metrics
  recordWebhookRequest(status) {
    this.webhookRequests.inc({ status });
  }

  // Get metrics in Prometheus format
  async getMetrics() {
    try {
      return await this.register.metrics();
    } catch (error) {
      logger.error('Error getting metrics:', error);
      throw error;
    }
  }

  // Get metrics as JSON
  async getMetricsAsJson() {
    try {
      const metrics = await this.register.getMetricsAsJSON();
      return metrics;
    } catch (error) {
      logger.error('Error getting metrics as JSON:', error);
      throw error;
    }
  }

  // Reset all metrics (useful for testing)
  reset() {
    this.register.resetMetrics();
  }
}

export { MetricsService };

