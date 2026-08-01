const fetch = require('node-fetch');

// Replace with your actual JWT token (get this by logging in through the frontend)
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NzU2MDk4OCwiZXhwIjoxNzQ3NjQ3Mzg4fQ.D7TB9Mtq0nQBs8c2MZYC45KODK79oKSLrjPWF3FNZKI';

// Use localhost for testing
const API_URL = 'http://localhost:3000/api';
// If you want to test against Heroku, use:
// const API_URL = 'https://gymjournal-75451ef51cbf.herokuapp.com/api';

// Helper function for making API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  console.time(`${method} ${endpoint}`);
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    const status = response.status;
    console.log(`${method} ${endpoint}: ${status}`);
    
    if (status === 200 || status === 201) {
      const data = await response.json();
      console.log(`Response data sample:`, JSON.stringify(data).substring(0, 100) + '...');
    } else {
      console.log(`Error response:`, await response.text());
    }
  } catch (error) {
    console.error(`Failed to ${method} ${endpoint}:`, error.message);
  }
  console.timeEnd(`${method} ${endpoint}`);
  console.log('-----------------------------------');
}

async function testEndpoints() {
  console.log('Starting API endpoint tests...');
  
  // Test public endpoint first
  await makeRequest('/status');
  
  // Test authenticated endpoints
  await makeRequest('/user');
  await makeRequest('/exercises');
  await makeRequest('/trainings?sortDirection=asc&page=1&limit=5');
  await makeRequest('/trainings/muscle-group-distribution');
  await makeRequest('/trainings/total-weight');
  await makeRequest('/trainings/exercises');
  
  console.log('Completed API endpoint tests');
}

testEndpoints().catch(console.error); 