import { Router } from 'express';
import os from 'os';

const router = Router();

// Middleware to check admin access
const checkAdminAccess = (req: any, res: any, next: any) => {
  // TODO: Implement proper authentication
  // For now, we'll use a simple admin token check
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Apply admin check middleware to all routes
router.use(checkAdminAccess);

// Get active users count
router.get('/metrics/active-users', async (req, res) => {
  try {
    // TODO: Implement real active users tracking
    // For now, return a mock count
    res.json({ count: Math.floor(Math.random() * 100) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active users' });
  }
});

// Get system status
router.get('/system/status', async (req, res) => {
  try {
    // Check API status
    const apiStatus = 'healthy'; // You can implement real health checks

    // Check database status
    const dbStatus = 'healthy'; // Implement real DB health check

    // Check OpenAI status
    let openaiStatus = 'healthy';
    try {
      // TODO: Implement OpenAI health check
      // For now, assume it's healthy
    } catch (error) {
      openaiStatus = 'down';
    }

    res.json({
      api: apiStatus,
      database: dbStatus,
      openai: openaiStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system status' });
  }
});

// Get recent book suggestions
router.get('/book-suggestions/recent', async (req, res) => {
  try {
    // TODO: Implement database query
    // For now, return mock data
    const mockSuggestions = [
      { title: 'The Great Gatsby', votes: 15, submittedAt: new Date() },
      { title: 'To Kill a Mockingbird', votes: 12, submittedAt: new Date() },
      { title: 'Pride and Prejudice', votes: 10, submittedAt: new Date() }
    ];
    res.json(mockSuggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent suggestions' });
  }
});

// Get recent feedback
router.get('/feedback/recent', async (req, res) => {
  try {
    // TODO: Implement database query
    // For now, return mock data
    const mockFeedback = [
      { message: 'Great experience!', type: 'positive', createdAt: new Date() },
      { message: 'Could be faster', type: 'improvement', createdAt: new Date() },
      { message: 'Love the interface', type: 'positive', createdAt: new Date() }
    ];
    res.json(mockFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent feedback' });
  }
});

// Get server metrics
router.get('/metrics/server', async (req, res) => {
  try {
    // Get real CPU usage
    const cpuUsage = os.loadavg()[0] * 100 / os.cpus().length;
    
    // Get memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
    
    // TODO: Implement real request tracking
    // For now, return a mock number
    const requestsPerMinute = Math.floor(Math.random() * 1000);

    res.json({
      cpu: Math.round(cpuUsage),
      memory: Math.round(memoryUsage),
      requests: requestsPerMinute
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch server metrics' });
  }
});

export default router; 