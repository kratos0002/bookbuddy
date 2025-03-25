interface Environment {
  apiUrl: string;
  apiTimeout: number;
  maxRetries: number;
  openAiKey: string;
  cspNonce: string;
  enableErrorReporting: boolean;
  enablePerformanceMonitoring: boolean;
  enableAnalytics: boolean;
  sentryDsn?: string;
  gaTrackingId?: string;
}

export const env: Environment = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES || '3', 10),
  openAiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  cspNonce: import.meta.env.VITE_CSP_NONCE || crypto.randomUUID(),
  enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID,
}; 