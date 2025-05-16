#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Build the frontend
echo "Building frontend..."
cd my-app
npm install
npm run build
cd ..

# Build the backend
echo "Building backend..."
cd backend
npm install
npm run local-build
cd ..

# Deploy to Heroku
echo "Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku"
git push heroku main

echo "Deployment complete!" 