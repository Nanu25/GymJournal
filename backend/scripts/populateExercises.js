const { Client } = require('pg');

// Database connection string from Heroku
const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";

// List of common exercises grouped by muscle group
const exercisesByMuscleGroup = {
  'Chest': [
    'Bench Press',
    'Incline Bench Press',
    'Decline Bench Press',
    'Dumbbell Flyes',
    'Push-ups',
    'Cable Crossovers',
    'Pec Deck Machine'
  ],
  'Back': [
    'Pull-ups',
    'Lat Pulldowns',
    'Bent Over Rows',
    'T-Bar Rows',
    'Seated Cable Rows',
    'Deadlifts',
    'Back Extensions'
  ],
  'Legs': [
    'Squats',
    'Leg Press',
    'Lunges',
    'Leg Extensions',
    'Leg Curls',
    'Calf Raises',
    'Romanian Deadlifts'
  ],
  'Shoulders': [
    'Overhead Press',
    'Lateral Raises',
    'Front Raises',
    'Reverse Flyes',
    'Face Pulls',
    'Shrugs',
    'Arnold Press'
  ],
  'Arms': [
    'Bicep Curls',
    'Tricep Extensions',
    'Hammer Curls',
    'Skull Crushers',
    'Preacher Curls',
    'Cable Pushdowns',
    'Dips'
  ],
  'Core': [
    'Crunches',
    'Planks',
    'Russian Twists',
    'Leg Raises',
    'Ab Wheel Rollout',
    'Mountain Climbers',
    'Hanging Leg Raises'
  ]
};

async function populateExercises() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Clear existing exercises
    const clearResult = await client.query('DELETE FROM exercises');
    console.log(`Cleared ${clearResult.rowCount} existing exercises`);
    
    // Prepare all exercises data
    const exercises = [];
    Object.keys(exercisesByMuscleGroup).forEach(muscleGroup => {
      exercisesByMuscleGroup[muscleGroup].forEach(name => {
        exercises.push({
          name,
          muscleGroup
        });
      });
    });
    
    console.log(`\nInserting ${exercises.length} exercises...`);
    
    // Insert exercises
    let insertedCount = 0;
    for (const exercise of exercises) {
      await client.query(
        'INSERT INTO exercises (name, "muscleGroup") VALUES ($1, $2)',
        [exercise.name, exercise.muscleGroup]
      );
      insertedCount++;
    }
    
    console.log(`\n✅ Successfully inserted ${insertedCount} exercises into the database`);
    
    // Fetch and display all exercises for verification
    const result = await client.query('SELECT * FROM exercises ORDER BY "muscleGroup", name');
    
    console.log('\n📋 Exercises by muscle group:');
    let currentMuscleGroup = '';
    
    result.rows.forEach(exercise => {
      if (exercise.muscleGroup !== currentMuscleGroup) {
        currentMuscleGroup = exercise.muscleGroup;
        console.log(`\n📌 ${currentMuscleGroup}:`);
      }
      console.log(`   - ${exercise.name} (ID: ${exercise.id})`);
    });
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

populateExercises(); 