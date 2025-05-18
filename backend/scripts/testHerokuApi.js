const fetch = require('node-fetch');

// Replace with your actual JWT token (get this by logging in through the frontend)
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0NzU2MDk4OCwiZXhwIjoxNzQ3NjQ3Mzg4fQ.D7TB9Mtq0nQBs8c2MZYC45KODK79oKSLrjPWF3FNZKI';

// Test against Heroku
const API_URL = 'https://gymjournal-75451ef51cbf.herokuapp.com/api';

// Test a single endpoint with timeout to prevent hanging
async function testEndpoint(endpoint) {
  console.log(`Testing ${endpoint}...`);
  
  try {
    // Create an AbortController to implement timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const status = response.status;
    console.log(`Status: ${status}`);
    
    if (status === 200 || status === 201) {
      const data = await response.json();
      console.log(`Success! Response first 100 chars: ${JSON.stringify(data).substring(0, 100)}...`);
      return true;
    } else {
      const text = await response.text();
      console.log(`Error: ${text.substring(0, 200)}...`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request timed out after 10 seconds');
    } else {
      console.error(`Error: ${error.message}`);
    }
    return false;
  }
}

async function main() {
  console.log('Testing Heroku API endpoints with 10-second timeout');
  
  // Test a few important endpoints one at a time
  const endpoints = [
    '/status',
    '/exercises',
    '/user'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n------------------------------`);
    const success = await testEndpoint(endpoint);
    console.log(`${endpoint}: ${success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`------------------------------\n`);
    
    // Wait 1 second between requests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main().catch(console.error); 