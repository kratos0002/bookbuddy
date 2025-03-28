import express from 'express';
import { db } from '../db';

const router = express.Router();

// Basic health check
router.get('/', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    // Check database connection
    const dbCheck = await checkDatabase();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck
      }
    });
  } catch (error) {
    console.error('Detailed health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Helper function to check database connection
async function checkDatabase() {
  try {
    const result = await db`SELECT 1 as result`;
    return { status: 'ok', result };
  } catch (error) {
    console.error('Database health check error:', error);
    return { 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default router; 