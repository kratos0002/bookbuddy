import { Router } from 'express';

const router = Router();

/**
 * Health check endpoint for Render
 * @route GET /api/health
 * @returns {object} 200 - A success response with status
 */
router.get('/', (req, res) => {
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router; 