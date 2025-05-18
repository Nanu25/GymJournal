/**
 * Script to directly test the exercises endpoint
 */
const fetch = require('node-fetch');

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

async function testExercisesEndpoint() {
  console.log(`${colors.magenta}=== Testing Exercises API Endpoint ===\n${colors.reset}`);
  console.log(`${colors.blue}Fetching from: ${API_URL}/api/exercises${colors.reset}`);
  
  try {
    const response = await fetch(`${API_URL}/api/exercises`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log(`${colors.blue}Response status: ${response.status} ${response.statusText}${colors.reset}`);
    
    if (!response.ok) {
      throw new Error(`Failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`\n${colors.green}Response received:${colors.reset}`);
    console.log(`${colors.cyan}Data source:${colors.reset} ${data.source}`);
    console.log(`${colors.cyan}Total exercises:${colors.reset} ${data.count}`);
    console.log(`${colors.cyan}Categories:${colors.reset} ${data.categories}`);
    
    console.log(`\n${colors.green}Exercise categories:${colors.reset}`);
    if (data.data && Array.isArray(data.data)) {
      data.data.forEach(category => {
        console.log(`${colors.yellow}${category.category}${colors.reset} (${category.exercises.length} exercises)`);
        category.exercises.forEach(exercise => {
          console.log(`  - ${exercise}`);
        });
      });
    } else {
      console.log(`${colors.red}Invalid data format returned${colors.reset}`);
    }
    
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  }
  
  console.log(`\n${colors.magenta}=== Test Complete ===\n${colors.reset}`);
}

testExercisesEndpoint().catch(console.error); 