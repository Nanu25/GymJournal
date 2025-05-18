const { Client } = require('pg');

// Database connection string from Heroku
const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";

async function viewExercises() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Fetch all exercises
    const exercisesResult = await client.query('SELECT * FROM exercises');
    
    if (exercisesResult.rows.length === 0) {
      console.log('\n⚠️ No exercises found in the database');
    } else {
      console.log(`\n📋 Found ${exercisesResult.rows.length} exercises:`);
      
      exercisesResult.rows.forEach((exercise, index) => {
        console.log(`\n${index + 1}. ${exercise.name}`);
        console.log(`   ID: ${exercise.id}`);
        console.log(`   Muscle Group: ${exercise.muscleGroup}`);
      });
    }
    
    // Fetch exercise relationships with trainings
    console.log('\n📊 Exercise usage in trainings:');
    
    const trainingExercisesResult = await client.query(`
      SELECT e.name, COUNT(te.id) as usage_count
      FROM exercises e
      LEFT JOIN training_exercises te ON e.id = te.exerciseId
      GROUP BY e.id, e.name
      ORDER BY usage_count DESC
    `);
    
    trainingExercisesResult.rows.forEach(row => {
      console.log(`- ${row.name}: Used in ${row.usage_count} training(s)`);
    });
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

viewExercises(); 