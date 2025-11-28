import { MetricsService } from '../services/metricsService.js';
import { BrowserPool } from '../infrastructure/browserPool.js';
import { JobProcessor } from '../services/jobProcessor.js';
import { logger } from '../config/logger.js';

export class MetricsController {
  constructor() {
    this.metricsService = MetricsService.getInstance();
    this.browserPool = BrowserPool.getInstance();
    this.jobProcessor = JobProcessor.getInstance();
    
    // Update metrics periodically
    this.startMetricsUpdater();
  }

  async getPrometheusMetrics(req, res, next) {
    try {
      // Update current metrics before serving
      await this.updateCurrentMetrics();
      
      const metrics = await this.metricsService.getMetrics();
      
      res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.send(metrics);
    } catch (error) {
      logger.error('Error getting Prometheus metrics:', error);
      next(error);
    }
  }

  async getJsonMetrics(req, res, next) {
    try {
      // Update current metrics before serving
      await this.updateCurrentMetrics();
      
      const metrics = await this.metricsService.getMetricsAsJson();
      
      res.json({
        metrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting JSON metrics:', error);
      next(error);
    }
  }

  async updateCurrentMetrics() {
    try {
      // Update browser pool metrics
      const browserStats = this.browserPool.getStats();
      this.metricsService.updateBrowserPoolMetrics(browserStats);

      // Update job metrics
      const jobStats = await this.jobProcessor.getJobStats();
      this.metricsService.updateJobMetrics(jobStats);
    } catch (error) {
      logger.error('Error updating current metrics:', error);
    }
  }

  startMetricsUpdater() {
    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateCurrentMetrics().catch(error => {
        logger.error('Error in metrics updater:', error);
      });
    }, 30000);
  }
}

