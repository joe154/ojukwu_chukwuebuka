"use client";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

// Custom error interface
export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Response interceptor handler
const createApiInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (err) {
        console.error('Error getting auth token:', err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - Handle errors and retries
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
      const config = error.config as InternalAxiosRequestConfig & { _retry?: number };

      // Network error
      if (!error.response) {
        const apiError: APIError = {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          status: 0,
        };
        return Promise.reject(apiError);
      }

      const { status, data } = error.response;

      // Unauthorized - Clear auth and redirect
      if (status === 401) {
        try {
          await auth.signOut();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        } catch (err) {
          console.error('Error signing out:', err);
        }
      }

      // Retry logic for 429 (rate limit) and 503 (service unavailable)
      if ((status === 429 || status === 503) && (!config._retry || config._retry < 3)) {
        config._retry = (config._retry || 0) + 1;
        const delay = Math.min(1000 * Math.pow(2, config._retry), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }

      // Format API error response
      const apiError: APIError = {
        message: data?.message || error.message || 'An error occurred',
        code: data?.code || 'API_ERROR',
        status,
        details: data?.details || data,
      };

      return Promise.reject(apiError);
    }
  );

  return api;
};

export const api = createApiInstance();

// Export fetcher function for SWR
export const fetcher = async (url: string) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    const apiError = error as APIError;
    const err = new Error(apiError.message);
    (err as any).status = apiError.status;
    throw err;
  }
};

// Export the api instance as default
export default api;
