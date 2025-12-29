/**
 * Events Routes
 * API endpoints for event generation
 */

import type { EventGenerationContext } from '@stonefall/shared';
import { Era } from '@stonefall/shared';
import { Hono } from 'hono';
import { generateGameEvent, isGeminiAvailable } from '../services';

export const eventsRoutes = new Hono();

/** Rate limiting - track last request per session */
const lastRequestTime = new Map<string, number>();
const RATE_LIMIT_MS = 2000; // 2 seconds between requests

/** POST /events/generate - Generate a new event */
eventsRoutes.post('/generate', async (c) => {
  console.log('\n🎮 [API] ===== NEW EVENT REQUEST =====');

  // Simple rate limiting
  const clientId = c.req.header('x-client-id') || 'default';
  const now = Date.now();
  const lastTime = lastRequestTime.get(clientId) || 0;

  if (now - lastTime < RATE_LIMIT_MS) {
    console.log(`⏱️  [API] Rate limited for client: ${clientId}`);
    return c.json({ error: 'Rate limited. Please wait before requesting another event.' }, 429);
  }
  lastRequestTime.set(clientId, now);

  try {
    const body = (await c.req.json()) as EventGenerationContext;
    console.log('📥 [API] Request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.era || body.tick === undefined || !body.resources) {
      console.log('❌ [API] Validation failed: missing required fields');
      return c.json({ error: 'Missing required fields: era, tick, resources' }, 400);
    }

    // Validate era
    if (!Object.values(Era).includes(body.era)) {
      console.log(`❌ [API] Invalid era: ${body.era}`);
      return c.json(
        { error: `Invalid era. Must be one of: ${Object.values(Era).join(', ')}` },
        400
      );
    }

    console.log('✅ [API] Validation passed, generating event...');

    // Generate event
    const event = await generateGameEvent(body);

    const source = isGeminiAvailable() ? 'ai' : 'fallback';
    console.log(`📤 [API] Returning event (source: ${source}): ${event.title}`);
    console.log('🎮 [API] ===== END EVENT REQUEST =====\n');

    return c.json({
      success: true,
      event,
      source,
    });
  } catch (error) {
    console.error('❌ [API] Error generating event:', error);
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
