import { logger } from '../config/logger.js';

// Base strategy interface
export class ScrapingStrategy {
  async execute(page, options) {
    throw new Error('execute method must be implemented');
  }
}

// Basic HTML scraping strategy
export class BasicHtmlStrategy extends ScrapingStrategy {
  async execute(page, options) {
    const { url, selectors, waitFor } = options;
    
    logger.info('Executing basic HTML scraping', { url, selectors });
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    if (waitFor) {
      if (waitFor.selector) {
        await page.waitForSelector(waitFor.selector, { timeout: waitFor.timeout || 5000 });
      } else if (waitFor.timeout) {
        await page.waitForTimeout(waitFor.timeout);
      }
    }
    
    const result = {};
    
    for (const [key, selector] of Object.entries(selectors)) {
      try {
        if (selector.multiple) {
          result[key] = await page.$$eval(selector.query, elements => 
            elements.map(el => selector.attribute ? el.getAttribute(selector.attribute) : el.textContent.trim())
          );
        } else {
          result[key] = await page.$eval(selector.query, el => 
            selector.attribute ? el.getAttribute(selector.attribute) : el.textContent.trim()
          );
        }
      } catch (error) {
        logger.warn(`Failed to extract ${key}:`, error.message);
        result[key] = null;
      }
    }
    
    return result;
  }
}

// JavaScript-heavy page strategy
export class JavaScriptStrategy extends ScrapingStrategy {
  async execute(page, options) {
    const { url, script, waitFor } = options;
    
    logger.info('Executing JavaScript scraping', { url });
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    if (waitFor) {
      if (waitFor.selector) {
        await page.waitForSelector(waitFor.selector, { timeout: waitFor.timeout || 10000 });
      } else if (waitFor.timeout) {
        await page.waitForTimeout(waitFor.timeout);
      }
    }
    
    // Execute custom JavaScript
    const result = await page.evaluate(script);
    
    return result;
  }
}

// Form interaction strategy
export class FormInteractionStrategy extends ScrapingStrategy {
  async execute(page, options) {
    const { url, interactions, finalSelectors } = options;
    
    logger.info('Executing form interaction scraping', { url });
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Execute interactions
    for (const interaction of interactions) {
      switch (interaction.type) {
        case 'type':
          await page.type(interaction.selector, interaction.value);
          break;
        case 'click':
          await page.click(interaction.selector);
          break;
        case 'select':
          await page.select(interaction.selector, interaction.value);
          break;
        case 'wait':
          if (interaction.selector) {
            await page.waitForSelector(interaction.selector, { timeout: interaction.timeout || 5000 });
          } else {
            await page.waitForTimeout(interaction.timeout || 1000);
          }
          break;
      }
    }
    
    // Extract final data
    const result = {};
    
    for (const [key, selector] of Object.entries(finalSelectors)) {
      try {
        if (selector.multiple) {
          result[key] = await page.$$eval(selector.query, elements => 
            elements.map(el => selector.attribute ? el.getAttribute(selector.attribute) : el.textContent.trim())
          );
        } else {
          result[key] = await page.$eval(selector.query, el => 
            selector.attribute ? el.getAttribute(selector.attribute) : el.textContent.trim()
          );
        }
      } catch (error) {
        logger.warn(`Failed to extract ${key}:`, error.message);
        result[key] = null;
      }
    }
    
    return result;
  }
}

// Screenshot strategy
export class ScreenshotStrategy extends ScrapingStrategy {
  async execute(page, options) {
    const { url, screenshotOptions = {} } = options;
    
    logger.info('Executing screenshot scraping', { url, screenshotOptions });
    
    try {
      // Navigate to URL
      logger.debug('Navigating to URL', { url });
      await page.goto(url, { waitUntil: 'networkidle2' });
      logger.debug('Navigation completed');
      
      // Wait for page to load if specified
      if (options.waitFor) {
        logger.debug('Waiting for page elements', { waitFor: options.waitFor });
        if (options.waitFor.selector) {
          await page.waitForSelector(options.waitFor.selector, { timeout: options.waitFor.timeout || 5000 });
        } else if (options.waitFor.timeout) {
          await page.waitForTimeout(options.waitFor.timeout);
        }
        logger.debug('Wait completed');
      }
      
      // Prepare screenshot options
      const screenshotConfig = {
        fullPage: screenshotOptions.fullPage || false,
        type: screenshotOptions.type || 'png',
        encoding: 'base64'
      };
      
      // Only add quality for JPEG
      if (screenshotConfig.type === 'jpeg' && screenshotOptions.quality) {
        screenshotConfig.quality = screenshotOptions.quality;
      }
      
      // Take screenshot
      logger.debug('Taking screenshot', { options: screenshotConfig });
      const screenshot = await page.screenshot(screenshotConfig);
      logger.debug('Screenshot taken successfully');
      
      return {
        screenshot,
        url,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error('Screenshot strategy failed', { 
        url, 
        error: error.message, 
        stack: error.stack 
      });
      throw error;
    }
  }
}

// Strategy factory
export class ScrapingStrategyFactory {
  static create(strategyType) {
    switch (strategyType) {
      case 'basic':
        return new BasicHtmlStrategy();
      case 'javascript':
        return new JavaScriptStrategy();
      case 'form':
        return new FormInteractionStrategy();
      case 'screenshot':
        return new ScreenshotStrategy();
      default:
        throw new Error(`Unknown strategy type: ${strategyType}`);
    }
  }
}

