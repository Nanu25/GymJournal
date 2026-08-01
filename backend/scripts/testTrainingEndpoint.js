/**
 * Script to directly test the training creation endpoint
 */
const fetch = require('node-fetch');
const readline = require('readline');

// API URL (change as needed)
const API_URL = process.env.API_URL || 'https://gymjournal-75451ef51cbf.herokuapp.com';

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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function testTrainingEndpoint() {
  console.log(`${colors.magenta}=== Testing Training Creation API Endpoint ===\n${colors.reset}`);
  console.log(`${colors.blue}Target API: ${API_URL}/api/trainings${colors.reset}`);
  
  try {
    // Get the token
    const token = await prompt(`${colors.yellow}Enter your auth token: ${colors.reset}`);
    if (!token || token.trim() === '') {
      throw new Error('Token is required to test this endpoint');
    }
    
    // Create a simple training entry
    const trainingEntry = {
      date: new Date().toISOString().split('T')[0], // Today's date
      exercises: {
        "Bench Press": 100,
        "Squat": 150,
        "Deadlift": 200
      }
    };
    
    console.log(`\n${colors.cyan}Sending training data:${colors.reset}`);
    console.log(JSON.stringify(trainingEntry, null, 2));
    
    const response = await fetch(`${API_URL}/api/trainings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(trainingEntry)
    });
    
    console.log(`\n${colors.blue}Response status: ${response.status} ${response.statusText}${colors.reset}`);
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log(`\n${colors.green}Training successfully created:${colors.reset}`);
      console.log(JSON.stringify(responseData, null, 2));
    } else {
      console.log(`\n${colors.red}Error creating training:${colors.reset}`);
      console.log(JSON.stringify(responseData, null, 2));
    }
    
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  } finally {
    rl.close();
    console.log(`\n${colors.magenta}=== Test Complete ===\n${colors.reset}`);
  }
}

testTrainingEndpoint().catch(console.error); 