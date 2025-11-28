import { Router } from 'express';
import axios from 'axios';

const router = Router();
const PYTHON_INSTAGRAM_URL = process.env.PYTHON_INSTAGRAM_URL || 'http://localhost:5002';

router.post('/download', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: 'Missing URL',
                message: 'Please provide a valid Instagram URL in the request body'
            });
        }

        console.log(`Forwarding download request to Python service: ${PYTHON_INSTAGRAM_URL}`);

        const response = await axios.post(`${PYTHON_INSTAGRAM_URL}/download`, { url });

        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('Instagram download error:', error.message);

        // Tratamento de erro detalhado
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Service Unavailable',
                message: 'Instagram download service is not running. Please start instagram_server.py'
            });
        }

        const status = error.response?.status || 500;
        const details = error.response?.data?.detail || error.message;

        res.status(status).json({
            error: 'Download failed',
            details: details
        });
    }
});

export { router as instagramRoutes };
