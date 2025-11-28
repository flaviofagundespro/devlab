import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIBR - Web Scraping API',
      version: '1.0.0',
      description: 'Professional web scraping API with browser pool management, caching, and async job processing',
      contact: {
        name: 'API Support',
        email: 'support@apibr.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        ScrapeRequest: {
          type: 'object',
          required: ['strategy', 'url'],
          properties: {
            strategy: {
              type: 'string',
              enum: ['basic', 'javascript', 'form', 'screenshot'],
              description: 'Scraping strategy to use',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'URL to scrape',
            },
            waitFor: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector to wait for',
                },
                timeout: {
                  type: 'integer',
                  minimum: 100,
                  maximum: 30000,
                  description: 'Timeout in milliseconds',
                },
              },
            },
          },
        },
        ScrapeResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              type: 'object',
              description: 'Scraped data',
            },
            metadata: {
              type: 'object',
              properties: {
                strategy: {
                  type: 'string',
                },
                url: {
                  type: 'string',
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                },
                executionTime: {
                  type: 'number',
                  description: 'Execution time in milliseconds',
                },
              },
            },
          },
        },
        AsyncScrapeRequest: {
          allOf: [
            { $ref: '#/components/schemas/ScrapeRequest' },
            {
              type: 'object',
              properties: {
                webhook: {
                  type: 'object',
                  properties: {
                    url: {
                      type: 'string',
                      format: 'uri',
                      description: 'Webhook URL to call when job completes',
                    },
                    method: {
                      type: 'string',
                      enum: ['POST', 'PUT', 'PATCH'],
                      default: 'POST',
                    },
                    headers: {
                      type: 'object',
                      description: 'Additional headers to send with webhook',
                    },
                  },
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'normal', 'high'],
                  default: 'normal',
                  description: 'Job priority',
                },
              },
            },
          ],
        },
        Job: {
          type: 'object',
          properties: {
            jobId: {
              type: 'string',
              format: 'uuid',
            },
            status: {
              type: 'string',
              enum: ['pending', 'running', 'completed', 'failed', 'retrying'],
            },
            progress: {
              type: 'integer',
              minimum: 0,
              maximum: 100,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            result: {
              type: 'object',
              description: 'Job result (only available when completed)',
            },
            error: {
              type: 'string',
              description: 'Error message (only available when failed)',
            },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);

