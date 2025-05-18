// diagnoseConnectionPool.js - Diagnose database connection pool issues
require('dotenv').config();

const { Client } = require('pg');

// Get connection parameters from DATABASE_URL (Heroku)
const getConnectionConfig = () => {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.substring(1),
        ssl: {
          rejectUnauthorized: false
        }
      };
    } catch (error) {
      console.error('ERROR parsing DATABASE_URL:', error);
      throw error;
    }
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'alexinfo',
    database: process.env.DB_NAME || 'fitness_journal'
  };
};

async function diagnoseConnectionPool() {
  console.log('Starting connection pool diagnostics...');
  const config = getConnectionConfig();
  console.log('Using connection config:', {
    ...config,
    password: '[REDACTED]',
  });

  // Create a client to run diagnostics
  const client = new Client(config);
  
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Successfully connected!');

    // Check active connections
    console.log('Checking active connections...');
    const connectionResult = await client.query(`
      SELECT count(*) as connection_count 
      FROM pg_stat_activity 
      WHERE datname = $1
    `, [config.database]);
    console.log(`Active connections: ${connectionResult.rows[0].connection_count}`);

    // Check connection limit
    console.log('Checking connection limits...');
    const limitsResult = await client.query('SHOW max_connections');
    console.log(`Max connections allowed: ${limitsResult.rows[0].max_connections}`);

    // Check for idle connections
    console.log('Checking for idle connections...');
    const idleResult = await client.query(`
      SELECT count(*) as idle_count 
      FROM pg_stat_activity 
      WHERE datname = $1 AND state = 'idle'
    `, [config.database]);
    console.log(`Idle connections: ${idleResult.rows[0].idle_count}`);

    // Check for long-running queries
    console.log('Checking for long-running queries...');
    const longRunningResult = await client.query(`
      SELECT pid, now() - query_start as duration, query
      FROM pg_stat_activity
      WHERE datname = $1 AND state = 'active' AND now() - query_start > '5 seconds'::interval
      ORDER BY duration DESC
    `, [config.database]);

    if (longRunningResult.rows.length > 0) {
      console.log('Long running queries:');
      longRunningResult.rows.forEach((row, i) => {
        console.log(`[${i+1}] Duration: ${row.duration}, PID: ${row.pid}`);
        console.log(`Query: ${row.query.substring(0, 100)}...`);
      });
    } else {
      console.log('No long-running queries found.');
    }

    // Check connection parameters
    console.log('Checking connection parameters...');
    const dbTypeResult = await client.query(`
      SELECT current_setting('db_type', true) as db_type
    `).catch(err => {
      console.log('Parameter db_type not found, this is expected if not defined:', err.message);
      return { rows: [{ db_type: null }] };
    });
    
    // Check for pending transactions
    console.log('Checking for waiting/pending transactions...');
    const waitingResult = await client.query(`
      SELECT count(*) as waiting_count 
      FROM pg_stat_activity 
      WHERE datname = $1 AND wait_event_type IS NOT NULL
    `, [config.database]);
    console.log(`Waiting transactions: ${waitingResult.rows[0].waiting_count}`);

    console.log('Database diagnostics completed successfully.');
  } catch (error) {
    console.error('Error during diagnostics:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the diagnostics
diagnoseConnectionPool(); 