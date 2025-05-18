require('dotenv').config();
const { Client } = require('pg');
const https = require('https');

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  // Use the DATABASE_URL value copied from Heroku config
  const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";
  
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Heroku
    }
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query to verify data access
    const result = await client.query('SELECT NOW()');
    console.log(`Database time: ${result.rows[0].now}`);

    // Check if users table exists and has data
    try {
      const usersResult = await client.query('SELECT COUNT(*) FROM "user"');
      console.log(`Number of users in database: ${usersResult.rows[0].count}`);
    } catch (err) {
      console.error('Error querying users table:', err.message);
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Test server functionality
function testServerFunctionality() {
  console.log('\nTesting if your Heroku app is responsive...');
  
  // Your Heroku app URL
  const url = 'https://gymjournal-75451ef51cbf.herokuapp.com/api/status';
  
  https.get(url, (res) => {
    const { statusCode } = res;
    let rawData = '';
    
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        console.log(`Status code: ${statusCode}`);
        if (statusCode === 200) {
          const parsedData = JSON.parse(rawData);
          console.log('✅ Server is responsive');
          console.log('Response:', parsedData);
        } else {
          console.log('❌ Server returned non-200 status code:', statusCode);
          console.log('Response:', rawData);
        }
      } catch (e) {
        console.error('❌ Error parsing response:', e.message);
      }
    });
  }).on('error', (e) => {
    console.error('❌ Server request failed:', e.message);
  });
}

// Run the tests
async function runTests() {
  console.log('============ CONNECTION TESTS ============');
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    testServerFunctionality();
  } else {
    console.log('Skipping server test due to database connection failure');
  }
}

runTests(); 