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
import { generateEvent, isGeminiAvailable } from './gemini';

/** Generate a unique event ID */
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/** Generate a game event (AI or fallback) */
export async function generateGameEvent(context: EventGenerationContext): Promise<GameEvent> {
  console.log('🎲 [EventGenerator] Starting event generation...');
  console.log('📊 [EventGenerator] Context:', {
    era: context.era,
    tick: context.tick,
    population: context.population,
    food: context.resources.food,
  });

  // Determine event type based on game state
  const weights = getEventWeights(context.resources.food, context.population, context.era);
  const eventType = selectEventType(weights);
  console.log('🎯 [EventGenerator] Selected event type:', eventType);
  console.log('⚖️  [EventGenerator] Event weights:', weights);

  // Try AI generation if available
  const geminiAvailable = isGeminiAvailable();
  console.log(`🤖 [EventGenerator] Gemini available: ${geminiAvailable}`);

  if (geminiAvailable) {
    console.log('🚀 [EventGenerator] Attempting AI generation...');
    try {
      const aiResponse = await generateEvent(context, eventType);

      if (aiResponse) {
        console.log('✅ [EventGenerator] AI generation successful!');
        console.log('📝 [EventGenerator] AI event title:', aiResponse.title);

        // Convert AI response to GameEvent
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
      console.log('⚠️  [EventGenerator] AI returned null response');
    } catch (error) {
      console.error('❌ [EventGenerator] AI generation failed:', error);
    }
  }

  // Fallback to pre-defined events
  console.log('📚 [EventGenerator] Using fallback event');
  const fallbackEvent = getRandomFallbackEvent(context.era);
  console.log('📖 [EventGenerator] Fallback event:', fallbackEvent.title);

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
  // Ensure minimum interval between events
  if (currentTick - lastEventTick < minInterval) {
    return false;
  }

  // Random chance
  return Math.random() < chancePerTick;
}
