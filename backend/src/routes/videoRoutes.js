import { Router } from 'express';
import { createAvatar, animateVideo, getVideoStatus } from '../controllers/videoController.js';

const router = Router();

router.post('/create-avatar', createAvatar);
router.post('/animate', animateVideo);
router.get('/status/:job_id', getVideoStatus);

export { router as videoRoutes };


