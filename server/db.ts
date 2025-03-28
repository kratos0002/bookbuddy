import { config } from './config';
import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon client
neonConfig.fetchConnectionCache = true;

// Create a SQL client based on environment
const sql = config.db.url 
  ? neon(config.db.url)
  : neon(`postgresql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}`);

// Export the SQL client
export const db = sql;

// Test the connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as result`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
