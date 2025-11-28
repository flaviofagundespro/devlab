import { logger } from "../config/logger.js";

export const triggerN8nWorkflow = async (workflowName, data) => {
  try {
    logger.info(`Triggering N8n workflow: ${workflowName} with data: ${JSON.stringify(data)}`);
    // Lógica para chamar o webhook do N8n ou API
    return { success: true, message: `Workflow ${workflowName} triggered.` };
  } catch (error) {
    logger.error(`Error triggering N8n workflow ${workflowName}:`, error);
    return { success: false, message: `Failed to trigger workflow ${workflowName}.` };
  }
};


