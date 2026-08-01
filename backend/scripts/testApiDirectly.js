// Test script to directly check the Heroku API endpoint
require('dotenv').config();
const fetch = require('node-fetch');

// Configuration - change as needed
const API_URL = 'https://gymjournal-75451ef51cbf.herokuapp.com';
const TEST_EMAIL = 'a@aa';
const TEST_PASSWORD = 'a';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

async function loginAndGetToken() {
  console.log(`${colors.blue}Trying to login with ${TEST_EMAIL}...${colors.reset}`);
  
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
    
    if (!response.ok) {
      console.log(`${colors.red}Login failed with status ${response.status}${colors.reset}`);
      const errorText = await response.text();
      console.log(`${colors.red}Error response: ${errorText}${colors.reset}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`${colors.green}Login successful!${colors.reset}`);
    return data.data.token;
  } catch (error) {
    console.log(`${colors.red}Error during login: ${error.message}${colors.reset}`);
    return null;
  }
}

async function testUserEndpoint(token) {
  console.log(`${colors.blue}Testing /api/user endpoint...${colors.reset}`);
  
  try {
    console.log(`${colors.blue}Using token: ${token.substring(0, 20)}...${colors.reset}`);
    
    // Test 1: Absolute URL with fetch
    console.log(`${colors.magenta}Test 1: Using absolute URL with fetch${colors.reset}`);
    const response1 = await fetch(`${API_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`${colors.blue}Status: ${response1.status}${colors.reset}`);
    const data1 = await response1.text();
    console.log(`${colors.blue}Response data: ${data1}${colors.reset}`);
    
    // Test 2: Directly hit the mock data endpoint
    console.log(`\n${colors.magenta}Test 2: Using absolute URL with node-fetch and extra headers${colors.reset}`);
    const response2 = await fetch(`${API_URL}/api/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'node-fetch/test'
      }
    });
    
    console.log(`${colors.blue}Status: ${response2.status}${colors.reset}`);
    const data2 = await response2.text();
    console.log(`${colors.blue}Response data: ${data2}${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}Error testing user endpoint: ${error.message}${colors.reset}`);
  }
}

async function main() {
  console.log(`${colors.magenta}=== API Endpoint Test ===\n${colors.reset}`);
  console.log(`${colors.yellow}Testing against: ${API_URL}${colors.reset}`);
  
  const token = await loginAndGetToken();
  if (!token) {
    console.log(`${colors.red}Failed to get token, aborting tests.${colors.reset}`);
    return;
  }
  
  await testUserEndpoint(token);
  
  console.log(`\n${colors.magenta}=== Test Complete ===\n${colors.reset}`);
}

main().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
}); 