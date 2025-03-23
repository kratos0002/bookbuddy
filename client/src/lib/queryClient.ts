import { QueryClient } from '@tanstack/react-query';

// API request helper
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  url: string,
  body?: any
) {
  console.log(`API Request: ${method} ${url}`, body);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`API Response status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText} for ${url}`);
      const errorText = await res.text();
      console.error(`Error response body:`, errorText);
      throw new Error(`API request failed: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`API Response from ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
}

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
}); 