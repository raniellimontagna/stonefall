/**
 * Events Routes Tests
 * Tests for event generation endpoints
 */

import { Era } from '@stonefall/shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { eventsRoutes } from './events';

// Mock the services module
vi.mock('../services', () => ({
  generateGameEvent: vi.fn().mockResolvedValue({
    id: 'test-event-1',
    type: 'economic',
    title: 'Test Event',
    description: 'A test event',
    choices: [{ id: 'a', text: 'Choice A', effects: [] }],
  }),
  isGeminiAvailable: vi.fn().mockReturnValue(true),
}));

describe('Events Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /status', () => {
    it('should return AI status', async () => {
      const res = await eventsRoutes.request('/status');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.aiAvailable).toBeDefined();
      expect(data.rateLimitMs).toBeDefined();
    });
  });

  describe('POST /generate', () => {
    it('should return 400 if missing required fields', async () => {
      const res = await eventsRoutes.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': `test-missing-fields-${Date.now()}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
    });

    it('should return 400 for invalid era', async () => {
      const res = await eventsRoutes.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': 'test-invalid-era-' + Date.now(),
        },
        body: JSON.stringify({
          era: 'invalid_era',
          tick: 10,
          population: 10,
          resources: { food: 100, wood: 50, stone: 30, gold: 0 },
          recentEvents: [],
        }),
      });
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain('Invalid era');
    });

    it('should generate event for valid request', async () => {
      const res = await eventsRoutes.request('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': `test-client-unique-${Date.now()}`,
        },
        body: JSON.stringify({
          era: Era.Stone,
          tick: 10,
          population: 10,
          resources: { food: 100, wood: 50, stone: 30, gold: 0 },
          recentEvents: [],
        }),
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.event).toBeDefined();
      expect(data.source).toBeDefined();
    });
  });
});
