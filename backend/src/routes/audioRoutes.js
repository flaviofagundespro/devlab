import { Router } from 'express';
import { generateSpeech, cloneVoice, getVoices } from '../controllers/audioController.js';

const router = Router();

router.post('/generate-speech', generateSpeech);
router.post('/clone-voice', cloneVoice);
router.get('/voices', getVoices);

export { router as audioRoutes };


