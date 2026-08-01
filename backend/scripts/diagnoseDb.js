const { Client } = require('pg');

// Database connection string from Heroku
const connectionString = process.env.DATABASE_URL || "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";

async function diagnoseDatabase() {
  console.log('🔍 Starting database diagnostics...');
  console.log(`Connection string: ${connectionString.replace(/:[^:]*@/, ':***@')}`);
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    // Add timeout options
    connectionTimeoutMillis: 10000, // 10 seconds
    query_timeout: 10000, // 10 seconds for queries
    statement_timeout: 10000 // 10 seconds for statements
  });
  
  try {
    console.log('➡️ Attempting to connect to database...');
    console.time('Connection time');
    await client.connect();
    console.timeEnd('Connection time');
    console.log('✅ Successfully connected to database!');
    
    // Test basic schema
    console.log('\n➡️ Checking database schema...');
    console.time('Schema check');
    const tablesResult = await client.query(`
      SELECT table_name, 
             (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count,
             (SELECT count(*) FROM pg_indexes WHERE tablename = t.table_name) as index_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.timeEnd('Schema check');
    
    console.log('📋 Tables found:', tablesResult.rows.length);
    tablesResult.rows.forEach(table => {
      console.log(`   - ${table.table_name} (${table.column_count} columns, ${table.index_count} indexes)`);
    });
    
    // Run some performance tests
    console.log('\n➡️ Running performance tests...');
    
    // Test 1: Count records in each table
    console.log('\n📊 Record counts:');
    for (const table of tablesResult.rows) {
      try {
        console.time(`Count ${table.table_name}`);
        const countResult = await client.query(`SELECT COUNT(*) FROM "${table.table_name}"`);
        console.timeEnd(`Count ${table.table_name}`);
        console.log(`   - ${table.table_name}: ${countResult.rows[0].count} records`);
      } catch (err) {
        console.error(`   ❌ Error counting ${table.table_name}:`, err.message);
      }
    }
    
    // Test 2: Check query performance for common operations
    console.log('\n📊 Query performance tests:');
    
    // Test Users query
    try {
      console.time('Users query');
      const usersResult = await client.query('SELECT * FROM users LIMIT 5');
      console.timeEnd('Users query');
      console.log(`   - Users query: ${usersResult.rows.length} rows returned`);
    } catch (err) {
      console.error('   ❌ Error in Users query:', err.message);
    }
    
    // Test Exercises query
    try {
      console.time('Exercises query');
      const exercisesResult = await client.query('SELECT * FROM exercises LIMIT 5');
      console.timeEnd('Exercises query');
      console.log(`   - Exercises query: ${exercisesResult.rows.length} rows returned`);
    } catch (err) {
      console.error('   ❌ Error in Exercises query:', err.message);
    }
    
    // Test Trainings complex query
    try {
      console.time('Complex query');
      const complexResult = await client.query(`
        SELECT t.id, t.date, COUNT(te.id) as exercise_count, SUM(te.weight) as total_weight
        FROM trainings t
        LEFT JOIN training_exercises te ON t.id = te."trainingId"
        GROUP BY t.id, t.date
        ORDER BY t.date DESC
        LIMIT 5
      `);
      console.timeEnd('Complex query');
      console.log(`   - Complex query: ${complexResult.rows.length} rows returned`);
    } catch (err) {
      console.error('   ❌ Error in Complex query:', err.message);
    }
    
    // Test database connection pool
    console.log('\n➡️ Testing connection pool...');
    
    // Open multiple concurrent connections
    const numConnections = 5;
    console.time('Connection pool test');
    
    try {
      const promises = [];
      for (let i = 0; i < numConnections; i++) {
        promises.push(client.query('SELECT 1'));
      }
      await Promise.all(promises);
      console.timeEnd('Connection pool test');
      console.log(`✅ Successfully ran ${numConnections} concurrent queries`);
    } catch (err) {
      console.error('❌ Error in connection pool test:', err.message);
    }
    
    await client.end();
    console.log('\n✅ Database diagnostics completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
      
      // Provide specific advice for common error codes
      const errorAdvice = {
        'ENOTFOUND': 'Host not found. Check if the database server is reachable.',
        'ECONNREFUSED': 'Connection refused. The database server is not accepting connections.',
        '28P01': 'Invalid password for database user.',
        '3D000': 'Database does not exist.',
        '28000': 'Invalid authorization specification.',
        '57P03': 'The database system is starting up or shutting down.',
        '08006': 'Connection terminated unexpectedly.',
        '08001': 'Unable to establish a connection.',
        '08004': 'Connection rejected.',
        '53300': 'Too many connections.',
        '53400': 'Configuration limit exceeded.'
      };
      
      if (errorAdvice[error.code]) {
        console.error(`💡 Advice: ${errorAdvice[error.code]}`);
      }
    }
    
    try {
      await client.end();
    } catch (closeError) {
      // Ignore errors during connection close
    }
  }
}

diagnoseDatabase().catch(console.error); 