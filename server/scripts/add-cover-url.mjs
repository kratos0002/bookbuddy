// Migration script to add cover_url column to books table
import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

// Try to load environment variables from .env file
const envPath = path.resolve(projectRoot, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded environment variables from .env file');
} else {
  console.log('No .env file found, using environment variables');
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL must be set. Set it in your .env file or environment variables.');
  process.exit(1);
}

// Create a connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    try {
      // Check if column already exists
      const checkResult = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'books' AND column_name = 'cover_url'
      `);
      
      if (checkResult.rows.length > 0) {
        console.log('Column cover_url already exists in the books table.');
        return;
      }
      
      // Start transaction
      await client.query('BEGIN');
      
      // Add cover_url column to books table
      console.log('Adding cover_url column to books table...');
      await client.query(`
        ALTER TABLE books 
        ADD COLUMN cover_url TEXT DEFAULT '/covers/1984.jpg' NOT NULL
      `);
      
      // Commit transaction
      await client.query('COMMIT');
      console.log('Migration successful! Added cover_url column to books table.');
      
    } catch (error) {
      // Roll back transaction on error
      await client.query('ROLLBACK');
      console.error('Migration failed:', error);
      throw error;
    } finally {
      // Release client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    // End the pool
    await pool.end();
  }
}

// Run the migration
runMigration().catch(console.error); 