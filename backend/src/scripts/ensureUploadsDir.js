const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at:', uploadsDir);
} else {
    console.log('Uploads directory already exists at:', uploadsDir);
}

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', '..', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
    console.log('Created public directory at:', publicDir);
} else {
    console.log('Public directory already exists at:', publicDir);
} 