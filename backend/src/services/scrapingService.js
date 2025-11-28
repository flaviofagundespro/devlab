import { BrowserPool } from '../infrastructure/browserPool.js';
import { ScrapingStrategyFactory } from '../domain/scrapingStrategies.js';
import { logger } from '../config/logger.js';
import { config } from '../config/index.js';

export class ScrapingService {
  constructor() {
    this.browserPool = BrowserPool.getInstance();
  }

  async scrape(options) {
    const { strategy: strategyType, ...strategyOptions } = options;
    
    logger.info('Starting scraping operation', { 
      strategy: strategyType, 
      url: strategyOptions.url 
    });

    let browser = null;
    let page = null;
    
    try {
      // Get browser from pool
      browser = await this.browserPool.getBrowser();
      
      // Create new page
      page = await this.browserPool.createPage(browser);
      
      // Set proxy if configured
      if (config.proxy.list.length > 0 && config.proxy.rotation) {
        const proxy = this.getRandomProxy();
        await page.authenticate({
          username: proxy.username || '',
          password: proxy.password || ''
        });
      }
      
      // Get strategy and execute
      const strategy = ScrapingStrategyFactory.create(strategyType);
      const result = await strategy.execute(page, strategyOptions);
      
      logger.info('Scraping operation completed successfully', { 
        strategy: strategyType, 
        url: strategyOptions.url 
      });
      
      return {
        success: true,
        data: result,
        metadata: {
          strategy: strategyType,
          url: strategyOptions.url,
          timestamp: new Date().toISOString(),
          executionTime: Date.now() - Date.now() // Will be calculated properly in controller
        }
      };
      
    } catch (error) {
      logger.error('Scraping operation failed', { 
        strategy: strategyType, 
        url: strategyOptions.url, 
        error: error.message 
      });
      
      throw error;
    } finally {
      // Clean up resources
      if (page) {
        await this.browserPool.closePage(page);
      }
      if (browser) {
        await this.browserPool.releaseBrowser(browser);
      }
    }
  }

  getRandomProxy() {
    if (config.proxy.list.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * config.proxy.list.length);
    const proxyString = config.proxy.list[randomIndex];
    
    // Parse proxy string (format: http://username:password@host:port)
    const url = new URL(proxyString);
    return {
      host: url.hostname,
      port: url.port,
      username: url.username,
      password: url.password
    };
  }

  async getPoolStats() {
    return this.browserPool.getStats();
  }
}

