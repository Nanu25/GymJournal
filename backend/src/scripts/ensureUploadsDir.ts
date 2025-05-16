import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
} else {
    console.log('Uploads directory already exists at:', uploadsDir);
} 