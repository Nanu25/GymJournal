/**
 * Simple script to create a training record directly in the database
 */
const { Client } = require('pg');
require('dotenv').config();

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const dbConfig = {
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

async function createTraining() {
  console.log('Database URL:', DATABASE_URL);
  const client = new Client(dbConfig);
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully');
    
    // Check users
    const userResult = await client.query('SELECT id, email FROM users LIMIT 5');
    console.log('Users in database:', userResult.rows);
    
    // Check trainings schema
    const schemaResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'trainings'
      ORDER BY ordinal_position
    `);
    
    console.log('Trainings table schema:');
    schemaResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : ''}`);
    });
    
    // Find a user or create a test user
    let userId;
    const userEmail = 'a@aa';
    const userCheckResult = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
    
    if (userCheckResult.rows.length > 0) {
      userId = userCheckResult.rows[0].id;
      console.log(`Found existing user with id: ${userId}`);
    } else {
      console.log('Creating test user...');
      const insertResult = await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        ['Test User', userEmail, 'password123']
      );
      userId = insertResult.rows[0].id;
      console.log(`Created new user with id: ${userId}`);
    }
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Check if a training for today already exists
    const trainingCheckResult = await client.query(
      'SELECT id FROM trainings WHERE "userId" = $1 AND date = $2',
      [userId, today]
    );
    
    if (trainingCheckResult.rows.length > 0) {
      console.log(`Training already exists for today, deleting it...`);
      await client.query('DELETE FROM trainings WHERE id = $1', [trainingCheckResult.rows[0].id]);
      console.log('Existing training deleted');
    }
    
    // Create a simple exercise object
    const exercises = {
      "Bench Press": 100
    };
    
    // Insert the training
    const insertTrainingResult = await client.query(
      'INSERT INTO trainings ("userId", date, exercises) VALUES ($1, $2, $3) RETURNING id',
      [userId, today, JSON.stringify(exercises)]
    );
    
    const trainingId = insertTrainingResult.rows[0].id;
    console.log(`Training created successfully with id: ${trainingId}`);
    
    // Check the created training
    const verifyResult = await client.query(
      'SELECT * FROM trainings WHERE id = $1',
      [trainingId]
    );
    
    console.log('Created training:', verifyResult.rows[0]);
    
  } catch (error) {
    console.error('ERROR:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

createTraining().catch(console.error); 