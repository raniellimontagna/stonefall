/**
 * Events Routes
 * API endpoints for event generation
 */

import type { EventGenerationContext } from '@stonefall/shared';
import { Era } from '@stonefall/shared';
import { Hono } from 'hono';
import { routeLogger as log } from '../lib/logger';
import { generateGameEvent, isGeminiAvailable } from '../services';

export const eventsRoutes = new Hono();

/** Rate limiting - track last request per session */
const lastRequestTime = new Map<string, number>();
const RATE_LIMIT_MS = 2000;

/** POST /events/generate - Generate a new event */
eventsRoutes.post('/generate', async (c) => {
  const clientId = c.req.header('x-client-id') || 'default';
  const now = Date.now();
  const lastTime = lastRequestTime.get(clientId) || 0;

  if (now - lastTime < RATE_LIMIT_MS) {
    log.debug({ clientId }, 'Rate limited');
    return c.json({ error: 'Rate limited. Please wait before requesting another event.' }, 429);
  }
  lastRequestTime.set(clientId, now);

  try {
    const body = (await c.req.json()) as EventGenerationContext;

    if (!body.era || body.tick === undefined || !body.resources) {
      log.debug('Missing required fields');
      return c.json({ error: 'Missing required fields: era, tick, resources' }, 400);
    }

    if (!Object.values(Era).includes(body.era)) {
      log.debug({ era: body.era }, 'Invalid era');
      return c.json(
        { error: `Invalid era. Must be one of: ${Object.values(Era).join(', ')}` },
        400
      );
    }

    const event = await generateGameEvent(body);
    const source = isGeminiAvailable() ? 'ai' : 'fallback';

    log.info({ eventTitle: event.title, source }, 'Event generated');

    return c.json({ success: true, event, source });
  } catch (error) {
    log.error({ error }, 'Error generating event');
    return c.json({ error: 'Failed to generate event' }, 500);
  }
});

/** GET /events/status - Check if AI is available */
eventsRoutes.get('/status', (c) => {
  return c.json({
    aiAvailable: isGeminiAvailable(),
    rateLimitMs: RATE_LIMIT_MS,
  });
});
