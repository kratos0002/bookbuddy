import { env } from './environment';

export const securityConfig = {
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        `'nonce-${env.cspNonce}'`,
        'https://apis.google.com',
        'https://www.googletagmanager.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: [
        "'self'",
        'https://api.openai.com',
        env.apiUrl,
        'https://www.google-analytics.com',
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },

  // Security Headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // CORS Configuration
  cors: {
    origin: env.apiUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-CSP-Nonce',
    ],
    exposedHeaders: ['X-Request-ID'],
    credentials: true,
    maxAge: 86400, // 24 hours
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },

  // Cookie Security Configuration
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Input Validation
  validation: {
    sanitize: true,
    escapeHTML: true,
    removeXSS: true,
  },
};

// Helper function to generate security headers
export const getSecurityHeaders = () => {
  const headers = { ...securityConfig.headers };
  
  // Build CSP header
  const cspDirectives = Object.entries(securityConfig.csp.directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
  
  headers['Content-Security-Policy'] = cspDirectives;
  
  return headers;
}; 