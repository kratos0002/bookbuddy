// Create a minimal package.json in the dist directory
import fs from 'fs';
import path from 'path';

// Read the main package.json
const mainPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// Create a minimal version for the dist directory
const distPackageJson = {
  name: mainPackageJson.name,
  version: mainPackageJson.version,
  type: "module",
  dependencies: {
    // Include only the dependencies we need at runtime
    "sequelize": mainPackageJson.dependencies.sequelize,
    "pg": mainPackageJson.dependencies.pg,
    "pg-hstore": mainPackageJson.dependencies["pg-hstore"],
    "express": mainPackageJson.dependencies.express,
    "dotenv": mainPackageJson.dependencies.dotenv
  }
};

// Write to dist directory
fs.writeFileSync('./dist/package.json', JSON.stringify(distPackageJson, null, 2));
console.log('Created dist/package.json'); 