/**
 * Health Routes Tests
 * Tests for health check endpoints
 */
import { describe, expect, it } from 'vitest';
import { healthRoutes } from './health';

describe('Health Routes', () => {
  describe('GET /', () => {
    it('should return healthy status', async () => {
      const res = await healthRoutes.request('/');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeDefined();
    });
  });

  describe('GET /ready', () => {
    it('should return ready status', async () => {
      const res = await healthRoutes.request('/ready');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.ready).toBe(true);
      expect(data.services).toBeDefined();
      expect(data.services.api).toBe(true);
    });
  });
});
