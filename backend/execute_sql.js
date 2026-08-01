const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeSql() {
  // Get the database URL from the environment
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable not found');
    process.exit(1);
  }

  const sslConfig = databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED === 'true' };

  console.log('Connecting to database...');
  const client = new Client({
    connectionString: databaseUrl,
    ssl: sslConfig
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing SQL commands...');
    await client.query(sql);
    console.log('SQL commands executed successfully');

  } catch (error) {
    console.error('Error during SQL execution:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the execution
executeSql(); 