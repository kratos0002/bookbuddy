import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  db: {
    url: process.env.DATABASE_URL, // Neon DB URL for production
    // Local PostgreSQL fallback configuration
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'bookbuddy',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD
  },
  metrics: {
    enabled: process.env.METRICS_ENABLED === 'true',
    host: process.env.METRICS_HOST || 'localhost',
    port: parseInt(process.env.METRICS_PORT || '9090', 10)
  }
}; 