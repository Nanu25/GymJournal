const { Client } = require('pg');

async function checkDatabaseTables() {
  const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    
    // List all tables in the public schema
    const tableResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables in database:');
    tableResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // If there are tables, check first table structure
    if (tableResult.rows.length > 0) {
      const firstTable = tableResult.rows[0].table_name;
      console.log(`\nExamining structure of table: ${firstTable}`);
      
      const columnResult = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [firstTable]);
      
      console.log('Columns:');
      columnResult.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });
    }
    
    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDatabaseTables(); 