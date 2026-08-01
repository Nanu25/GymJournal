/**
 * Script to view all trainings in the database with their exercises
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

async function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

async function main() {
  console.log(`${colors.magenta}=== Trainings in Database ===\n${colors.reset}`);
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:alexinfo@localhost:5432/fitness_journal',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
  });

  try {
    await client.connect();
    console.log(`${colors.green}Connected to database${colors.reset}`);
    
    // Get trainings with user information
    const trainingsResult = await client.query(`
      SELECT t.id, t.date, u.name as user_name, u.email as user_email 
      FROM training t
      LEFT JOIN "user" u ON t."userId" = u.id
      ORDER BY t.date DESC
      LIMIT 20
    `);
    
    if (trainingsResult.rows.length === 0) {
      console.log(`${colors.yellow}No trainings found in the database.${colors.reset}`);
      return;
    }
    
    console.log(`${colors.green}Found ${trainingsResult.rows.length} most recent trainings:${colors.reset}\n`);
    
    // For each training, get the exercises
    for (const training of trainingsResult.rows) {
      const formattedDate = await formatDate(training.date);
      console.log(`${colors.blue}Training on ${formattedDate} (ID: ${training.id})${colors.reset}`);
      console.log(`  User: ${training.user_name || 'Unknown'} (${training.user_email || 'No email'})`);
      
      // Get exercises for this training
      const exercisesResult = await client.query(`
        SELECT te.weight, e.name, e."muscleGroup" 
        FROM training_exercise te
        JOIN exercise e ON te."exerciseId" = e.id
        WHERE te."trainingId" = $1
        ORDER BY e."muscleGroup", e.name
      `, [training.id]);
      
      if (exercisesResult.rows.length === 0) {
        console.log(`  ${colors.yellow}No exercises found for this training.${colors.reset}`);
      } else {
        console.log(`  ${colors.cyan}Exercises (${exercisesResult.rows.length}):${colors.reset}`);
        
        // Group exercises by muscle group
        const grouped = exercisesResult.rows.reduce((acc, ex) => {
          const muscleGroup = ex.muscleGroup;
          if (!acc[muscleGroup]) {
            acc[muscleGroup] = [];
          }
          acc[muscleGroup].push(ex);
          return acc;
        }, {});
        
        // Print exercises by group
        Object.entries(grouped).forEach(([muscleGroup, exercises]) => {
          console.log(`    ${colors.cyan}${muscleGroup}:${colors.reset}`);
          exercises.forEach(ex => {
            console.log(`      - ${ex.name}: ${colors.green}${ex.weight}kg${colors.reset}`);
          });
        });
      }
      
      console.log();
    }
    
  } catch (err) {
    console.error(`${colors.red}Error:${colors.reset}`, err);
  } finally {
    await client.end();
    console.log(`${colors.magenta}=== End of Report ===\n${colors.reset}`);
  }
}

main().catch(console.error); 