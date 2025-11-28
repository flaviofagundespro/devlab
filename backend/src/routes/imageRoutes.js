import { Router } from 'express';
import { generateImage, editImage, upscaleImage } from '../controllers/imageController.js';

const router = Router();

router.post('/generate', generateImage);
router.post('/edit', editImage);
router.post('/upscale', upscaleImage);

export { router as imageRoutes };


