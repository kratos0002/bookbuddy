import { Router } from 'express';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { User, Feedback, BookSuggestion } from '../models';
import { redisClient } from '../services/redis';
import { metricsClient } from '../services/metrics';
import { Response } from 'express';
import express from 'express';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken, requireAdmin);

// Get active users count (from Redis)
router.get('/metrics/active-users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activeUsers = await redisClient.get('active_users_count');
    res.json({ count: parseInt(activeUsers || '0') });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ error: 'Failed to fetch active users' });
  }
});

// Get system status
router.get('/system/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [dbStatus, redisStatus] = await Promise.all([
      checkDatabaseStatus(),
      checkRedisStatus()
    ]);

    res.json({
      api: 'healthy',
      database: dbStatus ? 'healthy' : 'unhealthy',
      redis: redisStatus ? 'healthy' : 'unhealthy'
    });
  } catch (error) {
    console.error('Error checking system status:', error);
    res.status(500).json({ error: 'Failed to check system status' });
  }
});

// Get recent book suggestions
router.get('/book-suggestions/recent', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const suggestions = await BookSuggestion.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [{
        model: User,
        attributes: ['email']
      }]
    });
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching book suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch recent suggestions' });
  }
});

// Get recent feedback
router.get('/feedback/recent', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const feedback = await Feedback.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      include: [{
        model: User,
        attributes: ['email']
      }]
    });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch recent feedback' });
  }
});

// Get server metrics
router.get('/metrics/server', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = await metricsClient.getServerMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching server metrics:', error);
    res.status(500).json({ error: 'Failed to fetch server metrics' });
  }
});

// Protected route for admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // In a real app, add authentication middleware to protect this route
    res.json({
      status: 'ok',
      message: 'Admin dashboard data',
      stats: {
        users: 0,
        books: 0,
        conversations: 0
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admin data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper functions
async function checkDatabaseStatus(): Promise<boolean> {
  try {
    await User.findOne();
    return true;
  } catch {
    return false;
  }
}

async function checkRedisStatus(): Promise<boolean> {
  try {
    await redisClient.ping();
    return true;
  } catch {
    return false;
  }
}

export default router; 