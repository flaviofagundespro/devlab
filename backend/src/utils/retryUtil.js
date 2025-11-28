import { logger } from '../config/logger.js';

export class RetryUtil {
  static async withExponentialBackoff(
    operation,
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2
  ) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          logger.error('Max retries exceeded', {
            attempts: attempt + 1,
            error: error.message
          });
          throw error;
        }
        
        const delay = Math.min(
          baseDelay * Math.pow(backoffFactor, attempt),
          maxDelay
        );
        
        logger.warn('Operation failed, retrying', {
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
          delay,
          error: error.message
        });
        
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  static async withLinearBackoff(
    operation,
    maxRetries = 3,
    delay = 1000
  ) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          logger.error('Max retries exceeded', {
            attempts: attempt + 1,
            error: error.message
          });
          throw error;
        }
        
        logger.warn('Operation failed, retrying', {
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
          delay,
          error: error.message
        });
        
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  static isRetryableError(error) {
    // Define which errors should trigger a retry
    const retryableErrors = [
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'TimeoutError',
      'ProtocolError'
    ];
    
    return retryableErrors.some(retryableError => 
      error.message.includes(retryableError) || 
      error.code === retryableError ||
      error.name === retryableError
    );
  }
  
  static async withRetryOnCondition(
    operation,
    shouldRetry,
    maxRetries = 3,
    delay = 1000
  ) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries || !shouldRetry(error)) {
          throw error;
        }
        
        logger.warn('Operation failed, retrying based on condition', {
          attempt: attempt + 1,
          maxRetries: maxRetries + 1,
          delay,
          error: error.message
        });
        
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
}

