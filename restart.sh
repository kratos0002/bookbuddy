#!/bin/bash

# Kill all Node.js processes
echo "Killing all Node.js processes..."
pkill -f node || true

# Wait a moment to ensure all processes are terminated
sleep 2

# Set the current directory
cd "$(dirname "$0")"
echo "Working directory: $(pwd)"

# Check if .env file exists
if [ -f .env ]; then
  echo "Found .env file"
else
  echo "Warning: No .env file found. Create one with DATABASE_URL and OPENAI_API_KEY"
fi

# Export the DATABASE_URL explicitly from .env file
if [ -f .env ]; then
  # Extract DATABASE_URL from .env file
  export DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)
  echo "Set DATABASE_URL from .env file"
fi

# Start the server
echo "Starting server..."
npm run dev 