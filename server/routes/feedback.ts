import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Path to the feedback storage file
const FEEDBACK_FILE_PATH = path.join(__dirname, '../data/feedback.json');

// Make sure the feedback file exists
const initFeedbackStorage = () => {
  try {
    if (!fs.existsSync(path.dirname(FEEDBACK_FILE_PATH))) {
      fs.mkdirSync(path.dirname(FEEDBACK_FILE_PATH), { recursive: true });
    }
    
    if (!fs.existsSync(FEEDBACK_FILE_PATH)) {
      fs.writeFileSync(FEEDBACK_FILE_PATH, JSON.stringify({
        bugs: [],
        features: [],
        feedback: []
      }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing feedback storage:', error);
  }
};

// Initialize storage on startup
initFeedbackStorage();

// Save feedback to the storage file
const saveFeedback = (type: string, data: any) => {
  try {
    const feedbackData = JSON.parse(fs.readFileSync(FEEDBACK_FILE_PATH, 'utf8'));
    
    const key = type === 'bug' ? 'bugs' : 
                type === 'feature' ? 'features' : 'feedback';
    
    feedbackData[key].push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...data
    });
    
    fs.writeFileSync(FEEDBACK_FILE_PATH, JSON.stringify(feedbackData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving feedback:', error);
    return false;
  }
};

// POST endpoint to submit feedback
router.post('/', async (req, res) => {
  try {
    const { type, responses } = req.body;
    
    if (!type || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Invalid feedback data' });
    }
    
    // Validate the type
    if (!['bug', 'feature', 'feedback'].includes(type)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }
    
    // Format the data differently based on type
    let formattedData: any = { responses };
    
    // Add IP and user agent for tracking (optional)
    formattedData.meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    
    const success = saveFeedback(type, formattedData);
    
    if (success) {
      return res.status(201).json({ message: 'Feedback received. Thank you!' });
    } else {
      return res.status(500).json({ error: 'Failed to save feedback' });
    }
  } catch (error) {
    console.error('Error handling feedback submission:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve all feedback (protected, admin only)
router.get('/', async (req, res) => {
  try {
    // In a real app, add authentication middleware to protect this route
    // This is a placeholder for demonstration
    const isAdmin = req.query.admin_key === 'your_secure_admin_key';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    const feedbackData = JSON.parse(fs.readFileSync(FEEDBACK_FILE_PATH, 'utf8'));
    return res.json(feedbackData);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 