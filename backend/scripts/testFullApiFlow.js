// Test script to check the full API flow with retry logic
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility to create a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// API retry wrapper with exponential backoff
async function fetchWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      if (retries > 0) {
        console.log(`${colors.yellow}Retry attempt ${retries}/${maxRetries}...${colors.reset}`);
        // Exponential backoff
        await delay(1000 * Math.pow(2, retries - 1));
      }
      
      const response = await fetch(url, options);
      console.log(`${colors.blue}Status: ${response.status}${colors.reset}`);
      
      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        console.log(`${colors.red}Error response: ${errorText}${colors.reset}`);
        
        // Don't retry auth errors
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Authentication error: ${response.status}`);
        }
      }
    } catch (error) {
      console.log(`${colors.red}Error on attempt ${retries + 1}: ${error.message}${colors.reset}`);
      
      if (retries === maxRetries - 1) {
        throw error;
      }
    }
    
    retries++;
  }
  
  throw new Error(`Failed after ${maxRetries} attempts`);
}

async function loginAndGetToken() {
  console.log(`${colors.blue}Trying to login with ${TEST_EMAIL}...${colors.reset}`);
  
  try {
    const data = await fetchWithRetry(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      })
    });
    
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
    
    const data = await fetchWithRetry(`${API_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log(`${colors.green}User data successfully retrieved:${colors.reset}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(`${colors.red}Error testing user endpoint: ${error.message}${colors.reset}`);
    return null;
  }
}

async function main() {
  console.log(`${colors.magenta}=== Full API Flow Test ===\n${colors.reset}`);
  console.log(`${colors.yellow}Testing against: ${API_URL}${colors.reset}`);
  
  try {
    // Step 1: Login
    console.log(`\n${colors.cyan}=== Step 1: Login ===\n${colors.reset}`);
    const token = await loginAndGetToken();
    if (!token) {
      console.log(`${colors.red}Failed to get token, aborting tests.${colors.reset}`);
      return;
    }
    
    // Step 2: Get User Data
    console.log(`\n${colors.cyan}=== Step 2: Get User Data ===\n${colors.reset}`);
    const userData = await testUserEndpoint(token);
    if (!userData) {
      console.log(`${colors.red}Failed to get user data.${colors.reset}`);
    }
    
    console.log(`\n${colors.magenta}=== Test Complete ===\n${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Test failed:${colors.reset}`, error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
  process.exit(1);
}); 