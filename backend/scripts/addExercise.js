/**
 * Script to add a new exercise to the database
 * Usage: node addExercise.js "Exercise Name" "Muscle Group"
 * Example: node addExercise.js "Barbell Curl" "Arms"
 */
require('dotenv').config();
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

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

// Get command line arguments
const exerciseName = process.argv[2];
const muscleGroup = process.argv[3];

if (!exerciseName || !muscleGroup) {
  console.error(`${colors.red}Error: Missing required arguments.${colors.reset}`);
  console.log(`${colors.blue}Usage: node addExercise.js "Exercise Name" "Muscle Group"${colors.reset}`);
  console.log(`${colors.blue}Example: node addExercise.js "Barbell Curl" "Arms"${colors.reset}`);
  process.exit(1);
}

async function main() {
  console.log(`${colors.magenta}=== Adding New Exercise to Database ===\n${colors.reset}`);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:alexinfo@localhost:5432/fitness_journal',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
  });

  try {
    await client.connect();
    console.log(`${colors.green}Connected to database${colors.reset}`);
    
    // Check if exercise already exists
    const checkResult = await client.query(`
      SELECT id FROM exercise 
      WHERE name = $1 AND "muscleGroup" = $2
    `, [exerciseName, muscleGroup]);
    
    if (checkResult.rows.length > 0) {
      console.log(`${colors.yellow}Exercise "${exerciseName}" already exists in the "${muscleGroup}" muscle group.${colors.reset}`);
      return;
    }
    
    // Generate a UUID for the new exercise
    const id = uuidv4();
    
    // Insert the new exercise
    await client.query(`
      INSERT INTO exercise (id, name, "muscleGroup")
      VALUES ($1, $2, $3)
    `, [id, exerciseName, muscleGroup]);
    
    console.log(`${colors.green}Successfully added exercise:${colors.reset}`);
    console.log(`  - ${colors.cyan}Name:${colors.reset} ${exerciseName}`);
    console.log(`  - ${colors.cyan}Muscle Group:${colors.reset} ${muscleGroup}`);
    console.log(`  - ${colors.cyan}ID:${colors.reset} ${id}`);
    
  } catch (err) {
    console.error(`${colors.red}Error:${colors.reset}`, err);
  } finally {
    await client.end();
    console.log(`\n${colors.magenta}=== Operation Complete ===\n${colors.reset}`);
  }
}

main().catch(console.error); 