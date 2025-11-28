import { Router } from 'express';
import { createProject, generateContent, getProjects } from '../controllers/studioController.js';

const router = Router();

router.post('/create-project', createProject);
router.post('/generate-content', generateContent);
router.get('/projects', getProjects);

export { router as studioRoutes };


