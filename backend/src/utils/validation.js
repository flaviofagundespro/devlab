import Joi from 'joi';

// Selector schema
const selectorSchema = Joi.object({
  query: Joi.string().required(),
  attribute: Joi.string().optional(),
  multiple: Joi.boolean().default(false)
});

// Wait options schema
const waitForSchema = Joi.object({
  selector: Joi.string().optional(),
  timeout: Joi.number().min(100).max(30000).optional()
});

// Interaction schema for form strategy
const interactionSchema = Joi.object({
  type: Joi.string().valid('type', 'click', 'select', 'wait').required(),
  selector: Joi.string().when('type', {
    is: Joi.string().valid('type', 'click', 'select'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  value: Joi.string().when('type', {
    is: Joi.string().valid('type', 'select'),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  timeout: Joi.number().min(100).max(30000).when('type', {
    is: 'wait',
    then: Joi.optional(),
    otherwise: Joi.forbidden()
  })
});

// Screenshot options schema
const screenshotOptionsSchema = Joi.object({
  fullPage: Joi.boolean().default(false),
  type: Joi.string().valid('png', 'jpeg').default('png'),
  quality: Joi.number().min(1).max(100).default(90)
});

// Base scraping request schema
const baseScrapeSchema = Joi.object({
  strategy: Joi.string().valid('basic', 'javascript', 'form', 'screenshot').required(),
  url: Joi.string().uri().required(),
  waitFor: waitForSchema.optional()
});

// Strategy-specific schemas
const basicStrategySchema = baseScrapeSchema.keys({
  strategy: Joi.string().valid('basic').required(),
  selectors: Joi.object().pattern(Joi.string(), selectorSchema).required()
});

const javascriptStrategySchema = baseScrapeSchema.keys({
  strategy: Joi.string().valid('javascript').required(),
  script: Joi.string().required()
});

const formStrategySchema = baseScrapeSchema.keys({
  strategy: Joi.string().valid('form').required(),
  interactions: Joi.array().items(interactionSchema).required(),
  finalSelectors: Joi.object().pattern(Joi.string(), selectorSchema).required()
});

const screenshotStrategySchema = baseScrapeSchema.keys({
  strategy: Joi.string().valid('screenshot').required(),
  screenshotOptions: screenshotOptionsSchema.optional()
});

// Main validation function
export function validateScrapeRequest(data) {
  const { strategy } = data;
  
  let schema;
  switch (strategy) {
    case 'basic':
      schema = basicStrategySchema;
      break;
    case 'javascript':
      schema = javascriptStrategySchema;
      break;
    case 'form':
      schema = formStrategySchema;
      break;
    case 'screenshot':
      schema = screenshotStrategySchema;
      break;
    default:
      return {
        error: {
          details: [{ message: 'Invalid strategy type' }]
        }
      };
  }
  
  return schema.validate(data, { abortEarly: false });
}

// Webhook validation schema
export const webhookSchema = Joi.object({
  url: Joi.string().uri().required(),
  method: Joi.string().valid('POST', 'PUT', 'PATCH').default('POST'),
  headers: Joi.object().optional(),
  retries: Joi.number().min(0).max(5).default(3)
});

// Async scraping request schema
export const asyncScrapeSchema = baseScrapeSchema.keys({
  webhook: webhookSchema.optional(),
  priority: Joi.string().valid('low', 'normal', 'high').default('normal')
});

