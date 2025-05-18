/**
 * Script to deploy exercise route changes to Heroku without a full Git push
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// App name
const HEROKU_APP = 'gymjournal-75451ef51cbf';

console.log(`${colors.magenta}=== Deploying Exercise Routes to Heroku ===\n${colors.reset}`);

try {
  // 1. Check if files exist
  const exerciseRoutesPath = path.join(__dirname, '..', 'dist', 'routes', 'exerciseroutes.js');
  const appPath = path.join(__dirname, '..', 'dist', 'app.js');
  
  if (!fs.existsSync(exerciseRoutesPath)) {
    throw new Error('Exercise routes file not found. Make sure to build the project first.');
  }
  
  if (!fs.existsSync(appPath)) {
    throw new Error('App.js file not found. Make sure to build the project first.');
  }
  
  console.log(`${colors.green}✓ Files validated successfully.${colors.reset}`);
  
  // 2. Deploy directly to Heroku using the Heroku CLI
  console.log(`${colors.yellow}Deploying files directly to Heroku...${colors.reset}`);
  
  // Copy the exercise routes file to Heroku
  console.log(`${colors.blue}Copying exercise routes...${colors.reset}`);
  execSync(`heroku run "mkdir -p dist/routes" -a ${HEROKU_APP}`);
  execSync(`heroku run "mkdir -p dist/config" -a ${HEROKU_APP}`);
  execSync(`heroku run "mkdir -p dist/controllers" -a ${HEROKU_APP}`);
  
  // Copy the files to a temp folder
  const tempDir = path.join(__dirname, 'temp_heroku_deploy');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Copy exerciseroutes.js
  fs.copyFileSync(
    exerciseRoutesPath,
    path.join(tempDir, 'exerciseroutes.js')
  );
  
  // Copy app.js 
  fs.copyFileSync(
    appPath,
    path.join(tempDir, 'app.js')
  );
  
  // Upload to Heroku using sftp or scp
  console.log(`${colors.yellow}Files prepared for upload. Since direct file transfer to Heroku dyno is not supported,\nwe need to deploy through Git.${colors.reset}`);
  console.log(`${colors.yellow}Please use 'git add .' and 'git commit' followed by 'git push heroku main' to deploy these changes.${colors.reset}`);
  
  console.log(`\n${colors.magenta}=== Preparation Complete ===\n${colors.reset}`);
  console.log(`${colors.cyan}Next steps:${colors.reset}`);
  console.log(`1. ${colors.cyan}Run 'git add .' to stage changes${colors.reset}`);
  console.log(`2. ${colors.cyan}Run 'git commit -m "Update exercise routes"' to commit${colors.reset}`);
  console.log(`3. ${colors.cyan}Run 'git push heroku main' to deploy to Heroku${colors.reset}`);
  
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
} 