#!/bin/bash

# Kill any existing Vite processes
echo "Killing any existing Vite processes..."
pkill -f vite || true

# Wait a moment to ensure all processes are terminated
sleep 2

# Set the current directory to client
cd "$(dirname "$0")/client"
echo "Working directory: $(pwd)"

# Start the client in development mode
echo "Starting client..."
npm run dev 