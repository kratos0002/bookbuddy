import axios from 'axios';

const API_URL = 'https://bookbuddy-qpi.onrender.com';

// Potential API paths to test
const pathsToTest = [
  '/',                    // Root path
  '/api',                 // API root
  '/api/health',          // Health endpoint with /api prefix
  '/health',              // Health endpoint without prefix
  '/api/books',           // Books endpoint with /api prefix
  '/books',               // Books endpoint without prefix
  '/api/characters',      // Characters endpoint with /api prefix
  '/characters'           // Characters endpoint without prefix
];

async function probeEndpoints() {
  console.log(`Probing endpoints on ${API_URL}...\n`);
  
  for (const path of pathsToTest) {
    try {
      const response = await axios.get(`${API_URL}${path}`, {
        timeout: 5000,
        validateStatus: () => true // Don't throw on any status code
      });
      
      console.log(`${path}: ${response.status} ${response.statusText}`);
      
      // If we got JSON data, show a preview
      if (response.headers['content-type']?.includes('application/json')) {
        console.log('  Response:', JSON.stringify(response.data).substring(0, 100) + '...');
      } else {
        console.log('  Content-Type:', response.headers['content-type'] || 'not specified');
      }
    } catch (error) {
      console.log(`${path}: ERROR - ${error.message}`);
    }
    console.log('---');
  }
}

probeEndpoints(); 