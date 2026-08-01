/**
 * Script to view all exercises in the database
 */
require('dotenv').config();
const { Client } = require('pg');

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

async function main() {
  console.log(`${colors.magenta}=== Exercises in Database ===\n${colors.reset}`);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:alexinfo@localhost:5432/fitness_journal',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
  });

  try {
    await client.connect();
    console.log(`${colors.green}Connected to database${colors.reset}`);
    
    // Get all exercises
    const result = await client.query(`
      SELECT id, name, "muscleGroup"
      FROM exercise 
      ORDER BY "muscleGroup", name
    `);
    
    if (result.rows.length === 0) {
      console.log(`${colors.yellow}No exercises found in the database.${colors.reset}`);
      return;
    }
    
    console.log(`${colors.green}Found ${result.rows.length} exercises:${colors.reset}\n`);
    
    // Group exercises by muscle group
    const grouped = result.rows.reduce((acc, exercise) => {
      const muscleGroup = exercise.muscleGroup;
      if (!acc[muscleGroup]) {
        acc[muscleGroup] = [];
      }
      acc[muscleGroup].push(exercise);
      return acc;
    }, {});
    
    // Print exercises by group
    Object.entries(grouped).forEach(([muscleGroup, exercises]) => {
      console.log(`${colors.blue}${muscleGroup} (${exercises.length} exercises):${colors.reset}`);
      exercises.forEach(exercise => {
        console.log(`  - ${colors.cyan}${exercise.name}${colors.reset} (ID: ${exercise.id})`);
      });
      console.log();
    });
    
  } catch (err) {
    console.error(`${colors.red}Error:${colors.reset}`, err);
  } finally {
    await client.end();
    console.log(`${colors.magenta}=== End of Report ===\n${colors.reset}`);
  }
}

main().catch(console.error); 