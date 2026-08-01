const { Client } = require('pg');

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Start a transaction
    await client.query('BEGIN');

    // Create users table
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
    console.log('Created users table');

    // Create trainings table
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
    console.log('Created trainings table');

    // Create exercises table
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
    console.log('Created exercises table');

    // Create training_exercises table
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
    console.log('Created training_exercises table');

    // Create activity_logs table
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
    console.log('Created activity_logs table');

    // Commit the transaction
    await client.query('COMMIT');
    console.log('All tables created successfully');

  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the script
createTables()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 