const { Client } = require('pg');
const bcrypt = require('bcryptjs');

// Database connection string from Heroku
const connectionString = "postgres://uf1brpka0eau0p:pc896d05624a7e5fd5711602f23f4aef28c5190c6e5b0885d5c7afdc2dd90709b@ec2-52-208-44-46.eu-west-1.compute.amazonaws.com:5432/d7r7pqdvfg5l7t";

async function addSimpleUser() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // User details
    const name = 'a';
    const email = 'a@a';
    const password = 'a';
    const isAdmin = true;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the user
    const result = await client.query(
      'INSERT INTO users (name, email, password, "isAdmin") VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, isAdmin]
    );
    
    console.log('\n✅ User added successfully:');
    console.log(`ID: ${result.rows[0].id}`);
    console.log(`Name: ${result.rows[0].name}`);
    console.log(`Email: ${result.rows[0].email}`);
    console.log(`Admin: ${result.rows[0].isAdmin ? 'Yes' : 'No'}`);
    
    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addSimpleUser(); 