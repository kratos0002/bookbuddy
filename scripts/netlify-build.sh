#!/bin/bash

echo "Starting custom Netlify build script"

# First, replace client package.json with compatible version
echo "Fixing dependencies..."
./scripts/replace-package-json.sh

# Navigate to client directory
echo "Navigating to client directory..."
cd client

# Install client dependencies with legacy-peer-deps flag
echo "Installing client dependencies..."
npm ci --legacy-peer-deps

# Build the client application
echo "Building the client application..."
npm run build

echo "Build completed successfully" 