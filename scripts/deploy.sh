#!/bin/bash

# Build the application
npm run build

# Run database migrations 
echo "Running database migrations..."
node server/scripts/add-cover-url.mjs

# Start the server
echo "Starting server..."
npm start 