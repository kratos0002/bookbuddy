import { securityConfig } from '@/config/security';
import DOMPurify from 'dompurify';

// Input validation and sanitization
export class SecurityUtils {
  private static instance: SecurityUtils;
  private purify: DOMPurify.DOMPurifyI;

  private constructor() {
    this.purify = DOMPurify;
    this.configurePurify();
  }

  public static getInstance(): SecurityUtils {
    if (!SecurityUtils.instance) {
      SecurityUtils.instance = new SecurityUtils();
    }
    return SecurityUtils.instance;
  }

  private configurePurify(): void {
    // Configure DOMPurify options
    this.purify.setConfig({
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: true,
    });

    // Add hooks for additional security
    this.purify.addHook('beforeSanitizeElements', (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Additional text node processing if needed
      }
      return node;
    });
  }

  // Sanitize HTML content
  public sanitizeHTML(input: string): string {
    if (!securityConfig.validation.sanitize) return input;
    return this.purify.sanitize(input, { RETURN_TRUSTED_TYPE: false }) as string;
  }

  // Validate and sanitize user input
  public validateInput(input: string | null | undefined): string {
    if (!input) return '';
    
    let sanitized = input.trim();
    
    if (securityConfig.validation.escapeHTML) {
      sanitized = this.escapeHTML(sanitized);
    }
    
    if (securityConfig.validation.removeXSS) {
      sanitized = this.sanitizeHTML(sanitized);
    }
    
    return sanitized;
  }

  // Escape HTML special characters
  private escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Validate email format
  public validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  public validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Generate a secure random string
  public generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const security = SecurityUtils.getInstance(); 