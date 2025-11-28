import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './config/logger.js';
import { BrowserPool } from './infrastructure/browserPool.js';
import { CacheService } from './infrastructure/cacheService.js';
import { JobProcessor } from './services/jobProcessor.js';
import { gracefulShutdown } from './utils/gracefulShutdown.js';

let server;

async function startServer() {
  try {
    // Initialize cache service
    const cacheService = CacheService.getInstance();
    await cacheService.connect();
    
    // Initialize browser pool
    await BrowserPool.getInstance().initialize();
    
    // Start job processor
    const jobProcessor = JobProcessor.getInstance();
    jobProcessor.start();
    
    // Start the server
    server = app.listen(config.port, '0.0.0.0', () => {
      logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
    });

    // Setup graceful shutdown
    gracefulShutdown(server);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

