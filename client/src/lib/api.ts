import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { env } from '@/config/environment';

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  private retryCount: Map<string, number>;

  private constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: env.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.retryCount = new Map();
    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add CSP nonce if available
        if (env.cspNonce) {
          config.headers['X-CSP-Nonce'] = env.cspNonce;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = crypto.randomUUID();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Clear retry count on successful response
        const requestId = response.config.url;
        if (requestId) this.retryCount.delete(requestId);
        return response;
      },
      async (error: AxiosError) => {
        if (!error.config) return Promise.reject(error);

        const requestId = error.config.url;
        if (!requestId) return Promise.reject(error);

        const currentRetryCount = this.retryCount.get(requestId) || 0;

        // Retry on network errors or 5xx responses
        if (
          currentRetryCount < env.maxRetries &&
          (!error.response || (error.response.status >= 500 && error.response.status <= 599))
        ) {
          this.retryCount.set(requestId, currentRetryCount + 1);
          const delay = Math.pow(2, currentRetryCount) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.client(error.config);
        }

        // Handle specific error cases
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Handle unauthorized
              break;
            case 403:
              // Handle forbidden
              break;
            case 404:
              // Handle not found
              break;
            case 429:
              // Handle rate limiting
              break;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method with type safety
  public async request<T>(config: {
    method: string;
    url: string;
    data?: any;
    params?: any;
    headers?: Record<string, string>;
  }): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    } catch (error) {
      if (env.enableErrorReporting) {
        // Log error to monitoring service
        console.error('API Request Error:', error);
      }
      throw error;
    }
  }

  // Convenience methods
  public async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({ method: 'GET', url, params });
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }
}

export const api = ApiClient.getInstance(); 