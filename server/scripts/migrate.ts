import { config } from '../config';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

function splitSqlStatements(sql: string): string[] {
  // First, temporarily replace content inside dollar-quoted strings
  const dollarQuotedStrings: string[] = [];
  let modifiedSql = sql.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
    dollarQuotedStrings.push(match);
    return `__DOLLAR_QUOTED_${dollarQuotedStrings.length - 1}__`;
  });

  // Remove comments and split on semicolons
  const statements = modifiedSql
    // Remove inline comments
    .replace(/--.*$/gm, '')
    // Remove block comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Split on semicolons
    .split(';')
    // Trim whitespace
    .map(stmt => stmt.trim())
    // Remove empty statements
    .filter(stmt => stmt.length > 0)
    // Restore dollar-quoted strings
    .map(stmt => {
      return stmt.replace(/__DOLLAR_QUOTED_(\d+)__/g, (_, index) => {
        return dollarQuotedStrings[parseInt(index)];
      });
    });

  return statements;
}

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    
    if (!config.db.url) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }
    console.log('Using database URL:', config.db.url);

    // Create a database connection
    const sql = neon(config.db.url);

    // Read and execute migrations in order
    const migrations = [
      'init.sql',
      '002_add_characters.sql'
    ];

    for (const migration of migrations) {
      console.log(`Running migration: ${migration}`);
      const sqlContent = readFileSync(join(__dirname, '../migrations', migration), 'utf8');
      const statements = splitSqlStatements(sqlContent);
      
      for (const statement of statements) {
        try {
          console.log('Executing statement:', statement);
          await sql(statement);
        } catch (error) {
          console.error(`Error executing statement in ${migration}:`, error);
          console.error('Statement:', statement);
          throw error;
        }
      }
      console.log(`Completed migration: ${migration}`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations(); 