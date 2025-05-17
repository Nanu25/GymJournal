// Simple script to initialize the database on Heroku
const { Client } = require('pg');

async function initializeDatabase() {
  // Get the database URL from the environment
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable not found');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // Required for Heroku PostgreSQL
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create the users table
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "weight" FLOAT,
        "height" FLOAT,
        "gender" VARCHAR(50),
        "age" INTEGER,
        "timesPerWeek" INTEGER,
        "timePerSession" INTEGER,
        "repRange" VARCHAR(50),
        "isAdmin" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    // Create the trainings table
    console.log('Creating trainings table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "trainings" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "users"(id) ON DELETE CASCADE,
        "date" DATE NOT NULL,
        "exercises" JSONB NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Trainings table created');

    // Create the exercises table
    console.log('Creating exercises table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "exercises" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "muscleGroup" VARCHAR(255),
        "description" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Exercises table created');

    // Create the training_exercises table
    console.log('Creating training_exercises table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "training_exercises" (
        "id" SERIAL PRIMARY KEY,
        "trainingId" INTEGER REFERENCES "trainings"(id) ON DELETE CASCADE,
        "exerciseId" INTEGER REFERENCES "exercises"(id) ON DELETE CASCADE,
        "weight" FLOAT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Training_exercises table created');

    // Create the activity_logs table
    console.log('Creating activity_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "activity_logs" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES "users"(id) ON DELETE CASCADE,
        "action" VARCHAR(50) NOT NULL,
        "entityType" VARCHAR(50) NOT NULL,
        "entityId" VARCHAR(255),
        "details" JSONB,
        "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Activity_logs table created');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the initialization
initializeDatabase(); 