/**
 * Events Slice
 * Manages AI-generated events
 */

import type { GameEvent, ResolvedEvent, Resources } from '@stonefall/shared';
import {
  EVENT_FREQUENCY,
  MIN_TICKS_BETWEEN_EVENTS,
  POPULATION_CONSUMPTION_RATE,
} from '@stonefall/shared';
import { soundManager } from '@/game/SoundManager';
import { ApiError, apiClient } from '@/lib/apiClient';
import type { SliceCreator } from '../types';

export interface EventsSlice {
  // State
  pendingEvent: GameEvent | null;
  eventHistory: ResolvedEvent[];
  lastEventTick: number;
  isGeneratingEvent: boolean;

  // Actions
  triggerEvent: (event: GameEvent) => void;
  resolveEvent: (choiceId: string) => void;
  checkForEvent: () => Promise<void>;
}

export const createEventsSlice: SliceCreator<EventsSlice> = (set, get) => ({
  // Initial state
  pendingEvent: null,
  eventHistory: [],
  lastEventTick: 0,
  isGeneratingEvent: false,

  // Actions
  triggerEvent: (event: GameEvent) => {
    set((state) => ({
      pendingEvent: event,
      isPaused: true, // Pause game when event is active
      lastEventTick: state.tick,
    }));
  },

  resolveEvent: (choiceId: string) => {
    const state = get();
    const event = state.pendingEvent;

    if (!event) return;

    // Find the chosen option
    const choice = event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply effects
    const newResources = { ...state.resources };
    let newPopulation = state.population.current;

    for (const effect of choice.effects) {
      if (effect.type === 'resource') {
        const target = effect.target as keyof Resources;
        if (target in newResources) {
          if (effect.isPercentage) {
            newResources[target] = Math.floor(newResources[target] * (1 + effect.value / 100));
          } else {
            newResources[target] = Math.max(0, newResources[target] + effect.value);
          }
        }
      } else if (effect.type === 'population') {
        if (effect.target === 'current') {
          if (effect.isPercentage) {
            newPopulation = Math.floor(newPopulation * (1 + effect.value / 100));
          } else {
            newPopulation = Math.max(1, newPopulation + effect.value);
          }
        }
      }
    }

    // Clamp population to max
    newPopulation = Math.min(newPopulation, state.population.max);

    // Create resolved event record
    const resolvedEvent: ResolvedEvent = {
      event,
      choiceId,
      resolvedAt: state.tick,
      appliedEffects: choice.effects,
    };

    set({
      pendingEvent: null,
      isPaused: false, // Resume game after event is resolved
      resources: newResources,
      population: {
        ...state.population,
        current: newPopulation,
        consumptionPerTick: newPopulation * POPULATION_CONSUMPTION_RATE,
      },
      eventHistory: [...state.eventHistory, resolvedEvent],
    });

    // Play collect sound when event is resolved
    soundManager.play('collect');
  },

  checkForEvent: async () => {
    const state = get();

    // Don't check if game is paused, over, or event is pending, or already generating
    if (state.isPaused || state.gameOver || state.pendingEvent || state.isGeneratingEvent) return;

    // Check cooldown
    const ticksSinceLastEvent = state.tick - state.lastEventTick;
    if (ticksSinceLastEvent < MIN_TICKS_BETWEEN_EVENTS) return;

    // Check frequency based on era
    const frequency = EVENT_FREQUENCY[state.era];
    const randomRoll = Math.random();

    // Only trigger if past minimum interval and random check passes
    if (ticksSinceLastEvent < frequency.minInterval) return;
    if (randomRoll > frequency.chancePerTick) return;

    // Set lock
    set({ isGeneratingEvent: true });

    // Try to fetch event from API using centralized client
    try {
      const response = await apiClient.generateEvent({
        era: state.era,
        tick: state.tick,
        population: state.population.current,
        resources: {
          food: state.resources.food,
          wood: state.resources.wood,
          stone: state.resources.stone,
          gold: state.resources.gold,
        },
        recentEvents: state.eventHistory.slice(-3).map((e) => e.event.title),
      });

      if (response.event) {
        // Enrich API event with frontend-specific fields
        // Type assertion is safe here because Zod validated the response structure
        const enrichedEvent = {
          ...response.event,
          triggeredAt: state.tick,
          era: state.era,
        } as GameEvent;
        get().triggerEvent(enrichedEvent);
      }
    } catch (error) {
      // Log error with context for debugging
      if (error instanceof ApiError) {
        console.error(`[Events] API Error (${error.statusCode}): ${error.message}`);
      } else {
        console.error('[Events] Failed to fetch event:', error);
      }
    } finally {
      // Release lock
      set({ isGeneratingEvent: false });
    }
  },
});
