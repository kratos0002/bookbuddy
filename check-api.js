import axios from 'axios';

async function checkAPI() {
  try {
    console.log('Checking API endpoint...');
    const response = await axios.get('https://bookbuddy-qpi.onrender.com/api/books');
    console.log('Status:', response.status);
    console.log('Data is array:', Array.isArray(response.data));
    console.log('Data sample:', JSON.stringify(response.data).substring(0, 200));
    console.log('Headers:', response.headers);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkAPI(); 