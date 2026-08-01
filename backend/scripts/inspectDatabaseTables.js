/**
 * Script to inspect database table structure
 */
const { Client } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

async function inspectDatabaseTables() {
  const client = new Client(dbConfig);
  
  try {
    console.log(`${colors.magenta}=== Database Table Inspector ===\n${colors.reset}`);
    
    console.log(`${colors.blue}Connecting to database...${colors.reset}`);
    await client.connect();
    console.log(`${colors.green}Connected to database${colors.reset}`);
    
    // List all tables
    console.log(`\n${colors.blue}Fetching table list...${colors.reset}`);
    const tableListQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    const tableResult = await client.query(tableListQuery);
    console.log(`${colors.cyan}Found ${tableResult.rows.length} tables:${colors.reset}`);
    
    for (const row of tableResult.rows) {
      const tableName = row.table_name;
      console.log(`\n${colors.yellow}TABLE: ${tableName}${colors.reset}`);
      
      // Get column information for this table
      const columnQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `;
      
      const columnResult = await client.query(columnQuery, [tableName]);
      
      console.log(`${colors.cyan}Columns:${colors.reset}`);
      columnResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ''}${col.column_default ? ` (default: ${col.column_default})` : ''}`);
      });
      
      // Check for foreign keys
      const fkQuery = `
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1;
      `;
      
      const fkResult = await client.query(fkQuery, [tableName]);
      
      if (fkResult.rows.length > 0) {
        console.log(`${colors.cyan}Foreign Keys:${colors.reset}`);
        fkResult.rows.forEach(fk => {
          console.log(`  - ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      }
      
      // Get a sample row if table has data
      const sampleQuery = `
        SELECT * FROM "${tableName}" LIMIT 1
      `;
      
      try {
        const sampleResult = await client.query(sampleQuery);
        if (sampleResult.rows.length > 0) {
          console.log(`${colors.cyan}Sample Row:${colors.reset}`);
          console.log(JSON.stringify(sampleResult.rows[0], null, 2));
        } else {
          console.log(`${colors.yellow}No data in this table${colors.reset}`);
        }
      } catch (error) {
        console.error(`${colors.red}Error fetching sample: ${error.message}${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.magenta}=== Inspection Complete ===\n${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  } finally {
    await client.end();
    console.log(`${colors.blue}Database connection closed${colors.reset}`);
  }
}

inspectDatabaseTables().catch(console.error); 