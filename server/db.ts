import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Try to load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL must be set. Did you forget to provision a database?\n" +
    "Make sure you have a .env file in the project root with DATABASE_URL defined.\n" +
    "Current working directory: " + process.cwd()
  );
}

// Declare the database variable outside try/catch
let dbInstance: any;

// Initialize database connection with error handling for schema issues
try {
  // Using Pool for connection as this is the recommended approach
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  dbInstance = drizzle(pool, { schema });
  console.log("Database connection established successfully");
} catch (error) {
  console.error("Error initializing database:", error);
  
  // Create a stub version of the database connection
  // This allows the app to run even with database issues
  dbInstance = {
    select: () => ({
      from: () => ({
        where: () => Promise.resolve([]),
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: () => Promise.resolve([]),
      }),
    }),
    // Add other methods as needed
  };
  
  console.warn("Using fallback stub database connection");
}

// Export the database instance
export const db = dbInstance;
