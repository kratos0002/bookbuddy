import { env } from '@/config/environment';

interface ErrorDetails {
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, unknown>;
}

class MonitoringService {
  private static instance: MonitoringService;
  private errorQueue: ErrorDetails[] = [];
  private metricsQueue: PerformanceMetric[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxQueueSize: number = 100;

  private constructor() {
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.startFlushInterval();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private setupErrorHandling(): void {
    if (!env.enableErrorReporting) return;

    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError({
        message: message.toString(),
        stack: error?.stack,
        context: {
          source,
          line: lineno,
          column: colno,
        },
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    };

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        context: {
          reason: event.reason,
        },
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  private setupPerformanceMonitoring(): void {
    if (!env.enablePerformanceMonitoring) return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.captureMetric({
        name: 'page_load',
        value: navigation.loadEventEnd - navigation.startTime,
        timestamp: Date.now(),
        context: {
          type: 'navigation',
          url: window.location.href,
        },
      });
    });

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.captureMetric({
            name: 'resource_timing',
            value: entry.duration,
            timestamp: Date.now(),
            context: {
              type: entry.entryType,
              name: entry.name,
              initiatorType: (entry as PerformanceResourceTiming).initiatorType,
            },
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  public captureError(error: ErrorDetails): void {
    if (!env.enableErrorReporting) return;

    this.errorQueue.push(error);
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.flushErrors();
    }
  }

  public captureMetric(metric: PerformanceMetric): void {
    if (!env.enablePerformanceMonitoring) return;

    this.metricsQueue.push(metric);
    if (this.metricsQueue.length >= this.maxQueueSize) {
      this.flushMetrics();
    }
  }

  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      if (env.enableErrorReporting) {
        await fetch(`${env.apiUrl}/monitoring/errors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ errors }),
        });
      }
    } catch (error) {
      console.error('Failed to send errors to monitoring service:', error);
      // Re-queue failed errors
      this.errorQueue = [...errors, ...this.errorQueue].slice(0, this.maxQueueSize);
    }
  }

  private async flushMetrics(): Promise<void> {
    if (this.metricsQueue.length === 0) return;

    const metrics = [...this.metricsQueue];
    this.metricsQueue = [];

    try {
      if (env.enablePerformanceMonitoring) {
        await fetch(`${env.apiUrl}/monitoring/metrics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metrics }),
        });
      }
    } catch (error) {
      console.error('Failed to send metrics to monitoring service:', error);
      // Re-queue failed metrics
      this.metricsQueue = [...metrics, ...this.metricsQueue].slice(0, this.maxQueueSize);
    }
  }

  private startFlushInterval(): void {
    setInterval(() => {
      this.flushErrors();
      this.flushMetrics();
    }, this.flushInterval);
  }

  // Custom metric tracking methods
  public trackApiCall(endpoint: string, duration: number, status: number): void {
    this.captureMetric({
      name: 'api_call',
      value: duration,
      timestamp: Date.now(),
      context: {
        endpoint,
        status,
      },
    });
  }

  public trackUserAction(action: string, duration?: number): void {
    this.captureMetric({
      name: 'user_action',
      value: duration || 0,
      timestamp: Date.now(),
      context: {
        action,
      },
    });
  }
}

export const monitoring = MonitoringService.getInstance(); 