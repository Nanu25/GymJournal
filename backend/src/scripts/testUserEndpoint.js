// Test script for user endpoint
require('dotenv').config();

const fetch = require('node-fetch');

// Config
const API_URL = process.env.API_URL || 'https://gymjournal-75451ef51cbf.herokuapp.com';
const TEST_EMAIL = 'a@aa'; // User's correct test credentials
const TEST_PASSWORD = 'a';  // User's correct test password

console.log(`Using API URL: ${API_URL}`);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

async function loginUser() {
  console.log(`${colors.blue}[TEST] Attempting to login with ${TEST_EMAIL}${colors.reset}`);
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log(`${colors.red}[ERROR] Login failed: ${data.error || response.statusText}${colors.reset}`);
      return null;
    }
    
    console.log(`${colors.green}[SUCCESS] Login successful${colors.reset}`);
    return data.data.token;
  } catch (error) {
    console.log(`${colors.red}[ERROR] Login request failed: ${error.message}${colors.reset}`);
    return null;
  }
}

async function testUserEndpoint(token) {
  console.log(`${colors.blue}[TEST] Testing /api/user endpoint${colors.reset}`);
  
  try {
    console.log(`${colors.blue}[DEBUG] Using token: ${token.substring(0, 20)}...${colors.reset}`);
    console.time('User API Response Time');
    
    // Create AbortController to handle timeouts manually
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout
    
    console.log(`${colors.blue}[DEBUG] Sending request to ${API_URL}/api/user${colors.reset}`);
    const response = await fetch(`${API_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    console.timeEnd('User API Response Time');
    
    console.log(`${colors.blue}[DEBUG] Response status: ${response.status}${colors.reset}`);
    
    // Check if the request timed out (30s is Heroku's timeout)
    if (!response) {
      console.log(`${colors.red}[ERROR] Request timed out${colors.reset}`);
      return null;
    }
    
    // First get the raw text to check if it's valid JSON
    const responseText = await response.text();
    console.log(`${colors.blue}[DEBUG] Response text preview: ${responseText.substring(0, 100)}...${colors.reset}`);
    
    // Try to parse the JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.log(`${colors.red}[ERROR] Failed to parse JSON response: ${jsonError.message}${colors.reset}`);
      return null;
    }
    
    if (!response.ok) {
      console.log(`${colors.red}[ERROR] User endpoint failed: ${data.message || response.statusText}${colors.reset}`);
      return null;
    }
    
    console.log(`${colors.green}[SUCCESS] User endpoint response:${colors.reset}`);
    console.log(JSON.stringify(data, null, 2));
    
    // Validate username exists
    if (data.name) {
      console.log(`${colors.green}[SUCCESS] Username found: ${data.name}${colors.reset}`);
    } else {
      console.log(`${colors.red}[ERROR] Username not found in response${colors.reset}`);
    }
    
    return data;
  } catch (error) {
    // Check if this was an abort error (timeout)
    if (error.name === 'AbortError') {
      console.log(`${colors.red}[ERROR] User endpoint request timed out after 35 seconds${colors.reset}`);
    } else {
      console.log(`${colors.red}[ERROR] User endpoint request failed: ${error.message}${colors.reset}`);
    }
    return null;
  }
}

async function runTests() {
  console.log(`${colors.magenta}=== Starting User Endpoint Test ===\n${colors.reset}`);
  
  // Step 1: Login to get token
  const token = await loginUser();
  if (!token) {
    console.log(`${colors.red}[FAIL] Test failed at login step${colors.reset}`);
    return;
  }
  
  // Step 2: Test user endpoint
  const userData = await testUserEndpoint(token);
  if (!userData) {
    console.log(`${colors.red}[FAIL] User endpoint test failed${colors.reset}`);
  } else {
    console.log(`${colors.green}[PASS] User endpoint test passed${colors.reset}`);
  }
  
  console.log(`\n${colors.magenta}=== User Endpoint Test Complete ===\n${colors.reset}`);
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
}); 