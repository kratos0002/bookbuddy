import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const ENV_VARS = [
  {
    name: 'VITE_API_URL',
    required: true,
    type: 'string',
    description: 'API base URL',
  },
  {
    name: 'VITE_API_TIMEOUT',
    required: true,
    type: 'number',
    description: 'API request timeout in milliseconds',
  },
  {
    name: 'VITE_MAX_RETRIES',
    required: true,
    type: 'number',
    description: 'Maximum number of API request retries',
  },
  {
    name: 'VITE_CSP_NONCE',
    required: false,
    type: 'string',
    description: 'Content Security Policy nonce',
  },
  {
    name: 'VITE_API_KEY_SALT',
    required: false,
    type: 'string',
    description: 'Salt for API key hashing',
  },
  {
    name: 'VITE_ENABLE_ERROR_REPORTING',
    required: false,
    type: 'boolean',
    description: 'Enable error reporting',
  },
  {
    name: 'VITE_ENABLE_PERFORMANCE_MONITORING',
    required: false,
    type: 'boolean',
    description: 'Enable performance monitoring',
  },
  {
    name: 'VITE_ENABLE_ANALYTICS',
    required: false,
    type: 'boolean',
    description: 'Enable analytics',
  },
  {
    name: 'VITE_CACHE_TTL',
    required: false,
    type: 'number',
    description: 'Cache time-to-live in seconds',
  },
  {
    name: 'VITE_ENABLE_DEBUG_MODE',
    required: false,
    type: 'boolean',
    description: 'Enable debug mode',
  },
];

function validateEnvVar(name, value, type) {
  if (value === undefined) return null;

  switch (type) {
    case 'number':
      if (isNaN(Number(value))) {
        return `${name} must be a number`;
      }
      break;
    case 'boolean':
      if (value !== 'true' && value !== 'false') {
        return `${name} must be 'true' or 'false'`;
      }
      break;
    case 'string':
      if (typeof value !== 'string' || value.trim() === '') {
        return `${name} must be a non-empty string`;
      }
      break;
    default:
      return `Unknown type ${type} for ${name}`;
  }

  return null;
}

function validateEnv() {
  // Get the directory of the current module
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // Load environment variables from .env file
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    console.log('ℹ️  Please create a .env file based on .env.example');
    process.exit(1);
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  const errors = [];
  const warnings = [];

  // Validate each environment variable
  ENV_VARS.forEach((envVar) => {
    const value = envConfig[envVar.name];

    if (envVar.required && !value) {
      errors.push(`Missing required environment variable: ${envVar.name}`);
    } else if (value) {
      const validationError = validateEnvVar(envVar.name, value, envVar.type);
      if (validationError) {
        errors.push(validationError);
      }
    } else {
      warnings.push(`Optional environment variable not set: ${envVar.name}`);
    }
  });

  // Check for unknown environment variables
  Object.keys(envConfig).forEach((key) => {
    if (!ENV_VARS.find((envVar) => envVar.name === key)) {
      warnings.push(`Unknown environment variable: ${key}`);
    }
  });

  // Output validation results
  if (errors.length > 0) {
    console.error('\n❌ Environment validation failed:');
    errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  Warnings:');
    warnings.forEach((warning) => console.warn(`  - ${warning}`));
  }

  console.log('\n✅ Environment validation passed');
}

validateEnv(); 