#!/bin/bash

# Exit on error
set -e

echo "=== Starting custom Netlify build script ==="
echo "Current directory: $(pwd)"
echo "Listing directories: $(ls -la)"

# First, replace client package.json with compatible version
echo "=== Fixing dependencies ==="
# Check if the script exists and is executable
if [ ! -f "./scripts/replace-package-json.sh" ]; then
  echo "ERROR: replace-package-json.sh script not found!"
  exit 1
fi

if [ ! -x "./scripts/replace-package-json.sh" ]; then
  echo "Making replace-package-json.sh executable..."
  chmod +x ./scripts/replace-package-json.sh
fi

# Run the replace script
./scripts/replace-package-json.sh

# Apply patch to vite config
echo "=== Patching Vite configuration ==="
if [ ! -f "./scripts/patch-vite-config.sh" ]; then
  echo "ERROR: patch-vite-config.sh script not found!"
  exit 1
fi

if [ ! -x "./scripts/patch-vite-config.sh" ]; then
  echo "Making patch-vite-config.sh executable..."
  chmod +x ./scripts/patch-vite-config.sh
fi

# Run the patch script
./scripts/patch-vite-config.sh

# Check if client directory exists
if [ ! -d "./client" ]; then
  echo "ERROR: Client directory not found!"
  exit 1
fi

# Navigate to client directory
echo "=== Navigating to client directory ==="
cd client
echo "Current directory after cd: $(pwd)"
echo "Client directory contents: $(ls -la)"

# Check if package.json has been updated properly
echo "=== Checking package.json ==="
grep -A 2 "\"react\":" package.json
grep -A 2 "\"framer-motion\":" package.json

# Install client dependencies with legacy-peer-deps flag
echo "=== Installing client dependencies ==="
npm ci --legacy-peer-deps --no-audit

# Build the client application
echo "=== Building the client application ==="
npm run build

# Check if the build succeeded and dist directory exists
if [ ! -d "./dist" ]; then
  echo "ERROR: Build failed - dist directory not created!"
  exit 1
else
  echo "Dist directory contents: $(ls -la ./dist)"
fi

echo "=== Build completed successfully ===" 