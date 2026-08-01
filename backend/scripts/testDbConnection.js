const { Client } = require('pg');

// Database connection string from Heroku
const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";

async function testDatabase() {
  console.time('Total execution');
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.time('Connection');
    await client.connect();
    console.timeEnd('Connection');
    console.log('✅ Connected to database');
    
    // Test queries
    console.time('Users query');
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    console.timeEnd('Users query');
    console.log(`Users count: ${usersResult.rows[0].count}`);
    
    console.time('Exercises query');
    const exercisesResult = await client.query('SELECT COUNT(*) FROM exercises');
    console.timeEnd('Exercises query');
    console.log(`Exercises count: ${exercisesResult.rows[0].count}`);
    
    console.time('Trainings query');
    const trainingsResult = await client.query('SELECT COUNT(*) FROM trainings');
    console.timeEnd('Trainings query');
    console.log(`Trainings count: ${trainingsResult.rows[0].count}`);
    
    // Test a more complex query that might be slow
    console.time('Complex query');
    const complexResult = await client.query(`
      SELECT t.id, t.date, COUNT(te.id) as exercise_count, SUM(te.weight) as total_weight
      FROM trainings t
      LEFT JOIN training_exercises te ON t.id = te."trainingId"
      GROUP BY t.id, t.date
      ORDER BY t.date DESC
      LIMIT 10
    `);
    console.timeEnd('Complex query');
    console.log(`Complex query returned ${complexResult.rows.length} rows`);
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.timeEnd('Total execution');
  }
}

testDatabase(); 