#!/bin/bash
# Script to deploy changes to Heroku

echo "Starting deployment to Heroku..."

# Ensure we're using the correct Heroku app
HEROKU_APP="gymjournal-75451ef51cbf"

# Check if logged in to Heroku
echo "Checking Heroku login status..."
heroku whoami || heroku login

# Add Heroku as a remote if not already present
heroku git:remote -a $HEROKU_APP

# Commit changes
echo "Committing changes..."
git add .
git commit -m "API endpoint resilience improvements"

# Push to Heroku
echo "Deploying to Heroku..."
git push heroku main

# Check logs for deployment
echo "Deployment complete. Showing recent logs..."
heroku logs --tail -a $HEROKU_APP 