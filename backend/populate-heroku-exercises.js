// This script runs the populateExercisesFromMuscleGroupMapping script with a Heroku DATABASE_URL
const { execSync } = require('child_process');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('==== Populate Exercises to Heroku Database ====');
console.log('This script will add exercises from muscleGroupMappingData.json to your Heroku database');

rl.question('Enter your Heroku DATABASE_URL: ', (databaseUrl) => {
  if (!databaseUrl || !databaseUrl.startsWith('postgres://')) {
    console.error('Error: Invalid DATABASE_URL. It should start with postgres://');
    rl.close();
    return;
  }

  console.log('\nRunning populate script with the provided DATABASE_URL...');
  
  try {
    // Use proper environment variables approach instead of command-line prefix
    // This works on both Windows and Unix systems
    execSync(`node dist/scripts/populateExercisesFromMuscleGroupMapping.js`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        NODE_ENV: 'production'
      }
    });
    
    console.log('\nExercises successfully populated to your Heroku database!');
  } catch (error) {
    console.error('\nError running the populate script:', error.message);
  }
  
  rl.close();
}); 