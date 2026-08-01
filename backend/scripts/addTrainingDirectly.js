/**
 * Script to directly add a training record to the database
 */
const { Client } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function addTraining() {
  const client = new Client(dbConfig);
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');
    
    // 1. Find or create a user
    console.log('Finding user...');
    const userEmail = 'a@aa';
    let userId;
    
    const userResult = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
      console.log(`Found existing user with ID: ${userId}`);
    } else {
      console.log('User not found, creating new user...');
      const insertUserResult = await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        ['Test User', userEmail, 'password123']
      );
      userId = insertUserResult.rows[0].id;
      console.log(`Created new user with ID: ${userId}`);
    }
    
    // 2. Add a training record
    console.log('Adding training record...');
    const today = new Date().toISOString().split('T')[0];
    
    // Check if training already exists for today
    const trainingCheckResult = await client.query(
      'SELECT id FROM trainings WHERE "userId" = $1 AND date = $2',
      [userId, today]
    );
    
    if (trainingCheckResult.rows.length > 0) {
      console.log(`Training already exists for user ${userId} on date ${today}`);
      console.log('Deleting existing training...');
      await client.query(
        'DELETE FROM trainings WHERE "userId" = $1 AND date = $2',
        [userId, today]
      );
      console.log('Existing training deleted');
    }
    
    // Create a simple training with Bench Press as the exercise
    const exercises = {
      "Bench Press": 100
    };
    
    const insertTrainingResult = await client.query(
      'INSERT INTO trainings ("userId", date, exercises) VALUES ($1, $2, $3) RETURNING id',
      [userId, today, JSON.stringify(exercises)]
    );
    
    const trainingId = insertTrainingResult.rows[0].id;
    console.log(`Training created successfully with ID: ${trainingId}`);
    
    console.log('Operation completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

addTraining().catch(console.error); 