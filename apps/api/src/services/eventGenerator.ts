/**
 * Event Generator Service
 * Generates game events using AI or fallback data
 */

import type { EventGenerationContext, GameEvent } from '@stonefall/shared';
import {
  EVENT_TYPE_ICONS,
  getEventWeights,
  getRandomFallbackEvent,
  selectEventType,
} from '@stonefall/shared';
import { eventLogger as log } from '../lib/logger';
import { generateEvent, isGeminiAvailable } from './gemini';

/** Generate a unique event ID */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Generate a game event (AI or fallback) */
export async function generateGameEvent(context: EventGenerationContext): Promise<GameEvent> {
  log.debug(
    { era: context.era, tick: context.tick, population: context.population },
    'Starting event generation'
  );

  // Determine event type based on game state
  const weights = getEventWeights(context.resources.food, context.population, context.era);
  const eventType = selectEventType(weights);
  log.debug({ eventType, weights }, 'Selected event type');

  // Try AI generation if available
  if (isGeminiAvailable()) {
    try {
      const aiResponse = await generateEvent(context, eventType);

      if (aiResponse) {
        log.info({ title: aiResponse.title, type: eventType }, 'AI event generated');

        return {
          id: generateEventId(),
          type: eventType,
          title: aiResponse.title,
          description: aiResponse.description,
          icon: EVENT_TYPE_ICONS[eventType],
          triggeredAt: context.tick,
          era: context.era,
          choices: aiResponse.choices.map((choice, index) => ({
            id: `choice_${index}`,
            text: choice.text,
            effects: choice.effects,
          })),
        };
      }
      log.debug('AI returned null, using fallback');
    } catch (error) {
      log.error({ error }, 'AI generation failed');
    }
  }

  // Fallback to pre-defined events
  const fallbackEvent = getRandomFallbackEvent(context.era);
  log.info({ title: fallbackEvent.title }, 'Using fallback event');

  return {
    ...fallbackEvent,
    id: generateEventId(),
    triggeredAt: context.tick,
    era: context.era,
  };
}

/** Check if events should trigger based on probability */
export function shouldTriggerEvent(
  currentTick: number,
  lastEventTick: number,
  minInterval: number,
  chancePerTick: number
): boolean {
  if (currentTick - lastEventTick < minInterval) {
    return false;
  }
  return Math.random() < chancePerTick;
}
