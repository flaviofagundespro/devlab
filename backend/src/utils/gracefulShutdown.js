import { logger } from '../config/logger.js';
import { BrowserPool } from '../infrastructure/browserPool.js';
import { CacheService } from '../infrastructure/cacheService.js';
import { JobProcessor } from '../services/jobProcessor.js';

export function gracefulShutdown(server) {
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Stop accepting new connections
    server.close(async () => {
      logger.info('HTTP server closed');
      
      try {
        // Stop job processor
        JobProcessor.getInstance().stop();
        
        // Close browser pool
        await BrowserPool.getInstance().destroy();
        
        // Disconnect cache service
        await CacheService.getInstance().disconnect();
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
    
    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 30000);
  };
  
  // Listen for termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    shutdown('uncaughtException');
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
}

