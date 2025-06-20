const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function executeHerokuCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

async function executeSql() {
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'create_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());

    // Execute each statement using Heroku CLI
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing statement:', statement.trim().substring(0, 50) + '...');
        const command = `heroku pg:psql --command "${statement.replace(/"/g, '\\"')}"`;
        await executeHerokuCommand(command);
      }
    }

    console.log('All SQL statements executed successfully');
  } catch (error) {
    console.error('Error executing SQL:', error);
    process.exit(1);
  }
}

executeSql().catch(console.error); 