#!/bin/bash

echo "Starting custom Netlify build script"

# Install dependencies with legacy-peer-deps flag
echo "Installing dependencies..."
npm ci --legacy-peer-deps

# Build the application
echo "Building the application..."
npm run build

echo "Build completed successfully" 