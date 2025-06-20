const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeSqlFile() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'create_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');

    try {
      // Start a transaction
      await client.query('BEGIN');
      console.log('Started transaction');

      // Split the SQL file into individual statements
      const statements = sql.split(';').filter(stmt => stmt.trim());

      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing statement:', statement.trim().substring(0, 50) + '...');
          await client.query(statement);
        }
      }

      // Commit the transaction
      await client.query('COMMIT');
      console.log('Transaction committed successfully');
    } catch (err) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      console.error('Error executing SQL:', err);
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

executeSqlFile().catch(console.error); 