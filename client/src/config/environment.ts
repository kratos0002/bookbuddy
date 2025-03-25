interface Environment {
  apiUrl: string;
  apiTimeout: number;
  openAiKey: string;
  sentryDsn: string | null;
  gaTrackingId: string | null;
  enableAnalytics: boolean;
  enableErrorReporting: boolean;
  cspNonce: string;
  apiKeySalt: string;
  cacheTtl: number;
  maxRetries: number;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

function validateEnvironment(): Environment {
  const requiredVars = ['VITE_API_URL', 'VITE_API_TIMEOUT', 'VITE_OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    apiUrl: import.meta.env.VITE_API_URL,
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10),
    openAiKey: import.meta.env.VITE_OPENAI_API_KEY,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || null,
    gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || null,
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    cspNonce: import.meta.env.VITE_CSP_NONCE || '',
    apiKeySalt: import.meta.env.VITE_API_KEY_SALT || '',
    cacheTtl: parseInt(import.meta.env.VITE_CACHE_TTL, 10) || 3600,
    maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES, 10) || 3,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    isTest: import.meta.env.MODE === 'test'
  };
}

export const env = validateEnvironment(); 