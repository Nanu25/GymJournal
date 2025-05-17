// Simple script to create the UUID extension
const { Client } = require('pg');

async function createUUIDExtension() {
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

    // Create UUID extension if it doesn't exist
    console.log('Creating UUID extension...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    console.log('UUID extension created successfully');

    // Verify the extension was created
    const result = await client.query(`
      SELECT * FROM pg_extension WHERE extname = 'uuid-ossp'
    `);
    
    if (result.rows.length > 0) {
      console.log('Verification: UUID extension exists in the database');
    } else {
      console.log('Verification failed: UUID extension does not exist');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the function
createUUIDExtension(); 