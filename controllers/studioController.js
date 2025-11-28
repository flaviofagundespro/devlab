import { logger } from "../config/logger.js";
import { triggerN8nWorkflow } from "../services/n8n_integration.js";

export const createProject = async (req, res, next) => {
  try {
    // Lógica para criar projeto
    res.status(200).json({ message: "Project created." });
  } catch (error) {
    logger.error("Error creating project:", error);
    next(error);
  }
};

export const generateContent = async (req, res, next) => {
  try {
    // Lógica para gerar conteúdo
    const { contentType, data } = req.body;
    // Exemplo de como você pode chamar a integração N8n
    await triggerN8nWorkflow("APIBR Studio", { contentType, data });
    res.status(200).json({ message: "Content generation initiated and N8n workflow triggered." });
  } catch (error) {
    logger.error("Error generating content:", error);
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    // Lógica para obter projetos
    res.status(200).json({ projects: [] });
  } catch (error) {
    logger.error("Error getting projects:", error);
    next(error);
  }
};


