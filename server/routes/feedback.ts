import express from 'express';

const router = express.Router();

// Get all feedback
router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ 
      error: 'Failed to get feedback',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { message, rating } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      error: 'Failed to submit feedback',
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router; 