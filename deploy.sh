#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Run the copy-frontend script
echo "Building and copying frontend files..."
node copy-frontend.js

# Build the backend
echo "Building backend..."
cd backend
npm install
npm run local-build
cd ..

# Ensure the backend/public directory contains the frontend files
if [ ! -f "backend/public/index.html" ]; then
  echo "ERROR: Frontend files were not copied correctly."
  echo "Copying fallback index.html..."
  mkdir -p backend/public
  cp backend/public/index.html backend/public/index.html 2>/dev/null || echo "No fallback index.html found."
fi

# Deploy to Heroku
echo "Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku with frontend files"
git push heroku main

echo "Deployment complete!"
echo "Visit your app at: https://gymjournal-75451ef51cbf.herokuapp.com/" 