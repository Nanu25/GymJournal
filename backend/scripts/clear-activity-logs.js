const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/fitness_journal',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function clearActivityLogs() {
    const client = await pool.connect();
    try {
        console.log('Starting to clear activity logs...');
        
        // Begin transaction
        await client.query('BEGIN');
        
        // Delete all records from activity_logs table
        const result = await client.query('DELETE FROM activity_logs');
        
        // Commit transaction
        await client.query('COMMIT');
        
        console.log(`Successfully deleted ${result.rowCount} activity log records`);
    } catch (error) {
        // Rollback transaction in case of error
        await client.query('ROLLBACK');
        console.error('Error clearing activity logs:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Execute the function
clearActivityLogs()
    .then(() => {
        console.log('Activity logs cleared successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed to clear activity logs:', error);
        process.exit(1);
    }); 