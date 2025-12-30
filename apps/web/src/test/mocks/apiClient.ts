/**
 * API Client Mock
 * Mock for apiClient in tests
 */

import { vi } from 'vitest';
import type { GenerateEventResponse } from '@/lib/apiClient';

export const mockApiClient = {
  generateEvent: vi.fn().mockResolvedValue({
    event: {
      id: 'test-event-1',
      type: 'economic',
      title: 'Test Event',
      description: 'A test event description',
      choices: [
        {
          id: 'a',
          text: 'Choice A',
          effects: [{ type: 'resource', target: 'food', value: 10 }],
        },
        {
          id: 'b',
          text: 'Choice B',
          effects: [{ type: 'resource', target: 'wood', value: 10 }],
        },
      ],
    },
    source: 'fallback',
  } satisfies GenerateEventResponse),

  health: vi.fn().mockResolvedValue({ status: 'ok' }),

  isAvailable: vi.fn().mockResolvedValue(true),
};

vi.mock('@/lib/apiClient', () => ({
  apiClient: mockApiClient,
  ApiError: class ApiError extends Error {
    constructor(
      message: string,
      public statusCode?: number,
      public originalError?: Error
    ) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));
