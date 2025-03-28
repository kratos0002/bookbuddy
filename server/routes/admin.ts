import express from 'express';

const router = express.Router();

// Simple admin dashboard - no auth requirement for now
router.get('/dashboard', async (req, res) => {
  try {
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

export default router; 