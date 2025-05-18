require('dotenv').config();
const { Client } = require('pg');

async function optimizeDatabase() {
  console.log('Starting database optimization...');
  
  // Parse the DATABASE_URL from Heroku
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable not found.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Heroku
    }
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    // Add indexes to improve query performance
    console.log('Adding indexes to training table...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_training_userId ON training ("userId");
      CREATE INDEX IF NOT EXISTS idx_training_date ON training ("date");
      CREATE INDEX IF NOT EXISTS idx_training_userId_date ON training ("userId", "date");
    `);

    console.log('Adding indexes to training_exercise table...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_training_exercise_trainingId ON training_exercise ("trainingId");
      CREATE INDEX IF NOT EXISTS idx_training_exercise_exerciseId ON training_exercise ("exerciseId");
    `);

    console.log('Adding indexes to exercise table...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_exercise_name ON exercise ("name");
      CREATE INDEX IF NOT EXISTS idx_exercise_muscleGroup ON exercise ("muscleGroup");
    `);

    // Create cache table if not exists
    console.log('Creating query cache table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS query_cache (
        id varchar PRIMARY KEY,
        query jsonb NOT NULL,
        result jsonb NOT NULL,
        time timestamptz NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_query_cache_time ON query_cache (time);
    `);

    // Analyze tables to update statistics for query planner
    console.log('Analyzing tables for query optimization...');
    await client.query('ANALYZE;');

    console.log('Database optimization completed successfully!');
  } catch (error) {
    console.error('Error optimizing database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

optimizeDatabase(); 