import { QueryClient } from '@tanstack/react-query';

// Get the API URL from environment or use the Render.com backend as fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bookbuddy-qpi.onrender.com';
console.log('API Base URL:', API_BASE_URL);

// API request helper
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  url: string,
  body?: any
) {
  // Ensure the URL is absolute by checking if it starts with http
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  console.log(`API Request: ${method} ${fullUrl}`, body);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`API Response status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText} for ${fullUrl}`);
      const errorText = await res.text();
      console.error(`Error response body:`, errorText);
      throw new Error(`API request failed: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`API Response from ${fullUrl}:`, data);
    return data;
  } catch (error) {
    console.error(`API request to ${fullUrl} failed:`, error);
    throw error;
  }
}

// Create a new QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
}); 