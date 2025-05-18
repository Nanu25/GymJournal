const { Client } = require('pg');
const readline = require('readline');
const bcrypt = require('bcryptjs');

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

// View users table
async function viewUsers(client) {
  try {
    const result = await client.query('SELECT * FROM users');
    
    if (result.rows.length === 0) {
      console.log('\n⚠️ No users found in the database');
      return [];
    }
    
    console.log('\n👥 Users in the database:');
    result.rows.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`);
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Admin: ${user.isAdmin ? 'Yes' : 'No'}`);
      console.log(`Created: ${user.createdAt}`);
    });
    
    return result.rows;
  } catch (error) {
    console.error('❌ Error viewing users:', error.message);
    return [];
  }
}

// Add a new user
async function addUser(client) {
  try {
    // Get user info
    const name = await promptInput('Enter name: ');
    const email = await promptInput('Enter email: ');
    const password = await promptInput('Enter password: ');
    const isAdmin = (await promptInput('Make user admin? (y/n): ')).toLowerCase() === 'y';
    
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
    
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error adding user:', error.message);
    return null;
  }
}

// Reset user password
async function resetPassword(client) {
  try {
    const users = await viewUsers(client);
    if (users.length === 0) return;
    
    const userIndex = await promptInput('\nEnter user number to reset password: ');
    const index = parseInt(userIndex) - 1;
    
    if (index < 0 || index >= users.length) {
      console.log('❌ Invalid user number');
      return;
    }
    
    const userId = users[index].id;
    const newPassword = await promptInput('Enter new password: ');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await client.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );
    
    console.log(`\n✅ Password reset successfully for user: ${users[index].email}`);
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  }
}

// Helper function to prompt for input
function promptInput(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

// Main function
async function main() {
  const client = await connectToDb();
  
  try {
    while (true) {
      console.log('\n👤 USER MANAGEMENT 👤');
      console.log('1. View all users');
      console.log('2. Add a new user');
      console.log('3. Reset user password');
      console.log('4. Exit');
      
      const answer = await promptInput('\nChoose an option (1-4): ');
      
      if (answer === '1') {
        await viewUsers(client);
      } 
      else if (answer === '2') {
        await addUser(client);
      } 
      else if (answer === '3') {
        await resetPassword(client);
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