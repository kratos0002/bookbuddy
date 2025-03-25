#!/bin/bash

echo "🔍 Testing build process to catch unresolved dependencies..."

# Clean up previous test builds
rm -rf dist-test
mkdir -p build-logs

# Run the test build process
npm run build:test > build-logs/build-output.log 2>&1

# Check if the build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed! Checking for unresolved dependencies..."
  
  # Extract unresolved dependency errors
  grep -A 3 "Rollup failed to resolve import" build-logs/build-output.log > build-logs/unresolved-deps.log
  
  echo "📋 Found the following unresolved dependencies:"
  cat build-logs/unresolved-deps.log
  
  echo ""
  echo "⚠️ To fix these issues:"
  echo "1. Add the missing dependencies to the main package.json"
  echo "2. Add them to the 'external' array in vite.config.ts"
  echo "3. Run this script again to check for additional issues"
  
  exit 1
else
  echo "✅ Build completed successfully! No unresolved dependencies found."
  echo "🧹 Cleaning up test build directory..."
  rm -rf dist-test
  echo "🚀 Ready to deploy!"
fi 