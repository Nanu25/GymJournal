const { Client } = require('pg');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Database connection string from Heroku
const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";

// Connect to the database
async function connectToDb() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to Heroku PostgreSQL database');
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
}

// List all tables in the database
async function listTables(client) {
  try {
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📋 Available tables:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
    return [];
  }
}

// View table structure
async function viewTableStructure(client, tableName) {
  try {
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    console.log(`\n📊 Structure of table '${tableName}':`);
    console.log('-----------------------------------');
    console.log('| Column Name | Data Type | Nullable |');
    console.log('-----------------------------------');
    result.rows.forEach(col => {
      console.log(`| ${col.column_name.padEnd(12)} | ${col.data_type.padEnd(9)} | ${col.is_nullable.padEnd(8)} |`);
    });
    console.log('-----------------------------------');
  } catch (error) {
    console.error(`❌ Error viewing structure of table '${tableName}':`, error.message);
  }
}

// View table data
async function viewTableData(client, tableName, limit = 10) {
  try {
    const result = await client.query(`
      SELECT * FROM "${tableName}"
      LIMIT $1
    `, [limit]);
    
    if (result.rows.length === 0) {
      console.log(`\n⚠️ No data found in table '${tableName}'`);
      return;
    }
    
    console.log(`\n📋 Data in table '${tableName}' (showing up to ${limit} rows):`);
    console.table(result.rows);
    
    console.log(`\nTotal rows returned: ${result.rows.length}`);
  } catch (error) {
    console.error(`❌ Error viewing data in table '${tableName}':`, error.message);
  }
}

// Main function
async function main() {
  const client = await connectToDb();
  
  try {
    while (true) {
      console.log('\n🔍 DATABASE EXPLORER 🔍');
      console.log('1. List all tables');
      console.log('2. View table structure');
      console.log('3. View table data');
      console.log('4. Exit');
      
      const answer = await new Promise(resolve => {
        rl.question('\nChoose an option (1-4): ', resolve);
      });
      
      if (answer === '1') {
        await listTables(client);
      } 
      else if (answer === '2') {
        const tables = await listTables(client);
        if (tables.length === 0) continue;
        
        const tableIndex = await new Promise(resolve => {
          rl.question('\nEnter table number to view structure: ', resolve);
        });
        
        const index = parseInt(tableIndex) - 1;
        if (index >= 0 && index < tables.length) {
          await viewTableStructure(client, tables[index]);
        } else {
          console.log('❌ Invalid table number');
        }
      } 
      else if (answer === '3') {
        const tables = await listTables(client);
        if (tables.length === 0) continue;
        
        const tableIndex = await new Promise(resolve => {
          rl.question('\nEnter table number to view data: ', resolve);
        });
        
        const limitAnswer = await new Promise(resolve => {
          rl.question('How many rows to show? (default: 10): ', resolve);
        });
        
        const limit = limitAnswer ? parseInt(limitAnswer) : 10;
        
        const index = parseInt(tableIndex) - 1;
        if (index >= 0 && index < tables.length) {
          await viewTableData(client, tables[index], limit);
        } else {
          console.log('❌ Invalid table number');
        }
      } 
      else if (answer === '4') {
        console.log('Goodbye! 👋');
        break;
      } 
      else {
        console.log('❌ Invalid option, please try again');
      }
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  } finally {
    await client.end();
    rl.close();
  }
}

main(); 