const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting frontend build and copy process...');

// Define paths
const frontendDir = path.join(__dirname, 'my-app');
const frontendDistDir = path.join(frontendDir, 'dist');
const backendPublicDir = path.join(__dirname, 'backend', 'public');

// Create backend/public directory if it doesn't exist
if (!fs.existsSync(backendPublicDir)) {
    fs.mkdirSync(backendPublicDir, { recursive: true });
    console.log('Created backend public directory at:', backendPublicDir);
}

// Build the frontend
try {
    console.log('Building frontend...');
    process.chdir(frontendDir);
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Frontend build completed successfully.');
} catch (error) {
    console.error('Error building frontend:', error);
    process.exit(1);
}

// Copy frontend files to backend/public
try {
    console.log('Copying frontend files to backend/public...');
    
    // Get list of files in the frontend dist directory
    const files = fs.readdirSync(frontendDistDir);
    
    // Copy each file/directory to the backend public directory
    files.forEach(file => {
        const srcPath = path.join(frontendDistDir, file);
        const destPath = path.join(backendPublicDir, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            // If it's a directory, copy recursively
            copyDir(srcPath, destPath);
        } else {
            // If it's a file, copy directly
            fs.copyFileSync(srcPath, destPath);
        }
        
        console.log(`Copied: ${file}`);
    });
    
    console.log('All frontend files copied successfully.');
} catch (error) {
    console.error('Error copying frontend files:', error);
    process.exit(1);
}

// Helper function to copy directories recursively
function copyDir(src, dest) {
    // Create destination directory
    fs.mkdirSync(dest, { recursive: true });
    
    // Get all files in source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    // Copy each entry
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            // Recursively copy subdirectories
            copyDir(srcPath, destPath);
        } else {
            // Copy files
            fs.copyFileSync(srcPath, destPath);
        }
    }
} 