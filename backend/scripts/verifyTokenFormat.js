/**
 * Script to verify JWT token format and userId type
 */
const jwt = require('jsonwebtoken');
const readline = require('readline');

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

async function verifyToken() {
  console.log(`${colors.magenta}=== JWT Token Verification Tool ===\n${colors.reset}`);
  
  try {
    // Get the token
    const token = await prompt(`${colors.yellow}Enter JWT token to verify: ${colors.reset}`);
    if (!token || token.trim() === '') {
      throw new Error('Token is required');
    }
    
    try {
      // Decode the token without verification to see its structure
      const decoded = jwt.decode(token);
      console.log(`\n${colors.cyan}Token contents:${colors.reset}`);
      console.log(JSON.stringify(decoded, null, 2));
      
      if (decoded && typeof decoded === 'object') {
        console.log(`\n${colors.blue}User ID info:${colors.reset}`);
        console.log(`- Value: ${decoded.userId}`);
        console.log(`- Type: ${typeof decoded.userId}`);
        
        console.log(`\n${colors.blue}After String conversion:${colors.reset}`);
        console.log(`- Value: ${String(decoded.userId)}`);
        console.log(`- Type: ${typeof String(decoded.userId)}`);
      }
    } catch (error) {
      console.error(`${colors.red}Error decoding token:${colors.reset}`, error.message);
    }
    
  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error.message);
  } finally {
    rl.close();
    console.log(`\n${colors.magenta}=== Verification Complete ===\n${colors.reset}`);
  }
}

verifyToken().catch(console.error); 