/**
 * API Client
 * Centralized, production-ready API client with Axios
 *
 * Features:
 * - Axios with interceptors
 * - Zod schema validation
 * - Retry logic with exponential backoff
 * - Request timeout
 * - Error handling and logging
 */

import type { Era } from '@stonefall/shared';
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { z } from 'zod';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000, // 1 second base delay
} as const;

// =============================================================================
// ZOD SCHEMAS FOR RESPONSE VALIDATION
// =============================================================================

// API returns partial event data - triggeredAt and era are added by frontend
const EventEffectSchema = z.object({
  type: z.enum(['resource', 'population', 'military', 'production']),
  target: z.string(),
  value: z.number(),
  isPercentage: z.boolean().optional(),
});

const EventChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  effects: z.array(EventEffectSchema),
  requirements: z.record(z.string(), z.number()).optional(),
});

// Event data as returned by API (without frontend-added fields)
const ApiEventSchema = z.object({
  id: z.string(),
  type: z.enum(['economic', 'social', 'natural', 'military', 'political']),
  title: z.string(),
  description: z.string(),
  choices: z.array(EventChoiceSchema),
  icon: z.string().optional(),
});

const GenerateEventResponseSchema = z.object({
  event: ApiEventSchema.nullable(),
  source: z.enum(['ai', 'fallback']).optional(),
});

const HealthResponseSchema = z.object({
  status: z.string(),
});

// =============================================================================
// TYPES
// =============================================================================

/** Event data as returned by API (before frontend enrichment) */
export interface ApiEvent {
  id: string;
  type: 'economic' | 'social' | 'natural' | 'military' | 'political';
  title: string;
  description: string;
  choices: Array<{
    id: string;
    text: string;
    effects: Array<{
      type: 'resource' | 'population' | 'military' | 'production';
      target: string;
      value: number;
      isPercentage?: boolean;
    }>;
    requirements?: Record<string, number>;
  }>;
  icon?: string;
}

export interface GenerateEventRequest {
  era: Era;
  tick: number;
  population: number;
  resources: {
    food: number;
    wood: number;
    stone: number;
    gold: number;
  };
  recentEvents: string[];
}

export interface GenerateEventResponse {
  event: ApiEvent | null;
  source?: 'ai' | 'fallback';
}

export interface HealthResponse {
  status: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// =============================================================================
// AXIOS INSTANCE
// =============================================================================

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - logging in development
  instance.interceptors.request.use(
    (config) => {
      if (import.meta.env.DEV) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const message = getErrorMessage(error);
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${message}`, error);
      }
      return Promise.reject(new ApiError(message, error.response?.status, error));
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

// =============================================================================
// HELPERS
// =============================================================================

function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as { error?: string; message?: string } | undefined;
    return data?.error || data?.message || `Server error: ${error.response.status}`;
  }
  if (error.request) {
    // Request was made but no response received
    return 'Network error: No response from server';
  }
  // Something went wrong in request setup
  return error.message || 'Unknown error occurred';
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number }
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= options.retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (
        error instanceof ApiError &&
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        throw error;
      }

      if (attempt < options.retries) {
        // Exponential backoff
        const delay = options.delay * 2 ** attempt;
        if (import.meta.env.DEV) {
          console.log(`[API] Retry ${attempt + 1}/${options.retries} after ${delay}ms`);
        }
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

function validateResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    if (import.meta.env.DEV) {
      console.error('[API] Response validation failed:', result.error.issues);
    }
    throw new ApiError('Invalid response format from server');
  }
  return result.data;
}

// =============================================================================
// API CLIENT
// =============================================================================

async function request<T>(config: AxiosRequestConfig, schema: z.ZodType<T>): Promise<T> {
  const response = await withRetry(() => axiosInstance.request(config), {
    retries: API_CONFIG.retries,
    delay: API_CONFIG.retryDelay,
  });
  return validateResponse(schema, response.data);
}

export const apiClient = {
  /**
   * Generate a game event using AI
   * Returns partial event data that needs to be enriched with triggeredAt and era
   * @throws {ApiError} If request fails or response is invalid
   */
  generateEvent: async (context: GenerateEventRequest): Promise<GenerateEventResponse> => {
    return request<GenerateEventResponse>(
      {
        method: 'POST',
        url: '/api/events/generate',
        data: context,
      },
      GenerateEventResponseSchema
    );
  },

  /**
   * Health check endpoint
   * @throws {ApiError} If request fails
   */
  health: async (): Promise<HealthResponse> => {
    return request<HealthResponse>(
      {
        method: 'GET',
        url: '/health',
      },
      HealthResponseSchema
    );
  },

  /**
   * Check if API is available (doesn't throw)
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      await apiClient.health();
      return true;
    } catch {
      return false;
    }
  },
};

export default apiClient;
