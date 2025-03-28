#!/bin/bash
# verify-build.sh - Script to verify builds locally before deploying

# Exit on any error
set -e

echo "🔍 Starting build verification..."

# Clear existing build
echo "🧹 Cleaning existing build artifacts..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build project using the same command as Render
echo "🏗️ Building project..."
npm run build:render

# Verify critical build outputs exist
echo "✅ Verifying build outputs..."

if [ ! -f "dist/index.js" ]; then
  echo "❌ Build failed: index.js missing"
  exit 1
fi

if [ ! -d "dist/public" ]; then
  echo "❌ Build failed: public directory missing"
  exit 1
fi

if [ ! -d "dist/server" ]; then
  echo "❌ Build failed: server directory missing"
  exit 1
fi

# Optionally run tests
if [ "$1" == "--with-tests" ]; then
  echo "🧪 Running tests..."
  npm run test
fi

echo "✨ Build verification successful! The build should deploy correctly."
echo "📦 To deploy, push your changes to the main branch." 