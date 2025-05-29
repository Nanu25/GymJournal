const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function createTables() {
  console.log('Starting database table creation...');
  console.log('Current directory:', process.cwd());
  console.log('Script directory:', __dirname);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000, // 30 seconds
    idleTimeoutMillis: 30000
  });

  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'create_tables.sql');
    console.log('Reading SQL file from:', sqlFile);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('SQL file read successfully');

    // Connect to the database
    console.log('Attempting to connect to database...');
    const client = await pool.connect();
    console.log('Connected to database successfully');

    try {
      // Start a transaction
      await client.query('BEGIN');
      console.log('Started transaction');

      // Split the SQL file into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim());
      console.log(`Found ${statements.length} SQL statements to execute`);

      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          console.log(`Executing statement ${i + 1}/${statements.length}:`, statement.trim().substring(0, 50) + '...');
          await client.query(statement);
          console.log(`Statement ${i + 1} executed successfully`);
        }
      }

      // Commit the transaction
      await client.query('COMMIT');
      console.log('Transaction committed successfully');
    } catch (err) {
      // Rollback in case of error
      console.error('Error during transaction:', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
      console.log('Database client released');
    }
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
    console.log('Database pool closed');
  }
}

console.log('Script started');
createTables()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 