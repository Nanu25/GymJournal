import fs from 'fs';
import path from 'path';

const ensureUploadsDir = () => {
    console.log('[SCRIPT] Ensuring uploads directory exists...');
    
    // Get the absolute path to the uploads directory
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    console.log('[SCRIPT] Uploads directory path:', uploadsDir);
    
    try {
        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
            console.log('[SCRIPT] Creating uploads directory...');
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log('[SCRIPT] Uploads directory created successfully');
        } else {
            console.log('[SCRIPT] Uploads directory already exists');
        }
        
        // Ensure the directory is writable
        const testFile = path.join(uploadsDir, '.test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('[SCRIPT] Uploads directory is writable');
        
        return true;
    } catch (error) {
        console.error('[SCRIPT] Error ensuring uploads directory:', error);
        return false;
    }
};

// Run the function
const success = ensureUploadsDir();
if (!success) {
    console.error('[SCRIPT] Failed to ensure uploads directory');
    process.exit(1);
}

console.log('[SCRIPT] Uploads directory check completed successfully'); 