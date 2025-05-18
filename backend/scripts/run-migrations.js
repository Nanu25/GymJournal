require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting database migration process...');

try {
    // Run TypeORM migration
    console.log('Executing TypeORM migrations...');
    const typeormCmd = 'npx typeorm-ts-node-commonjs migration:run -d src/config/database.ts';
    
    execSync(typeormCmd, { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
    });
    
    console.log('Database migration completed successfully!');
} catch (error) {
    console.error('Error running migrations:', error.message);
    process.exit(1);
} 