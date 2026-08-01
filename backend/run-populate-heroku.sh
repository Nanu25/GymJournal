#!/bin/bash

# Get the DATABASE_URL from Heroku
echo "Fetching DATABASE_URL from Heroku..."
DATABASE_URL=$(heroku config:get DATABASE_URL -a your-heroku-app-name)

if [ -z "$DATABASE_URL" ]; then
  echo "Error: Could not fetch DATABASE_URL from Heroku"
  echo "Please run: heroku config:get DATABASE_URL -a your-heroku-app-name"
  echo "And manually set the DATABASE_URL environment variable"
  exit 1
fi

# Set environment variables
export DATABASE_URL
export NODE_ENV=production

# Run the compiled script
echo "Running exercise population script with Heroku database..."
node dist/scripts/populateExercisesFromMuscleGroupMapping.js

echo "Script execution completed." 