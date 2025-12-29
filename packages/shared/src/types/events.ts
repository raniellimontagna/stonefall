/**
 * Event Types
 * Types for the dynamic event system
 */

import type { Era } from './game';

/** Types of events that can occur */
export type EventType = 'economic' | 'social' | 'natural' | 'military' | 'political';

/** Effect types that events can apply */
export type EventEffectType = 'resource' | 'population' | 'military' | 'production';

/** Resource targets for effects */
export type ResourceTarget = 'food' | 'wood' | 'stone' | 'gold';

/** An effect that an event choice can apply */
export interface EventEffect {
  type: EventEffectType;
  target: ResourceTarget | 'current' | 'max' | 'strength' | 'defense';
  value: number;
  /** Optional: percentage-based effect */
  isPercentage?: boolean;
}

/** A choice the player can make in response to an event */
export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  /** Optional: requirements to choose this option */
  requirements?: Partial<Record<ResourceTarget, number>>;
}

/** A game event */
export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: EventChoice[];
  /** Tick when the event was triggered */
  triggeredAt: number;
  /** Era when the event occurred */
  era: Era;
  /** Icon/emoji for the event */
  icon?: string;
}

/** Resolved event with player's choice */
export interface ResolvedEvent {
  event: GameEvent;
  choiceId: string;
  resolvedAt: number;
  appliedEffects: EventEffect[];
}

/** Event generation context sent to AI */
export interface EventGenerationContext {
  era: Era;
  tick: number;
  population: number;
  resources: {
    food: number;
    wood: number;
    stone: number;
    gold: number;
  };
  lastEventType?: EventType;
  recentEvents?: string[];
}

/** Response from AI event generation */
export interface GeneratedEventResponse {
  title: string;
  description: string;
  choices: Array<{
    text: string;
    effects: EventEffect[];
  }>;
}

/** Event frequency configuration */
export interface EventFrequency {
  minInterval: number;
  maxInterval: number;
  chancePerTick: number;
}

/** Event weights based on game state */
export interface EventWeights {
  economic: number;
  social: number;
  natural: number;
  military: number;
  political: number;
}
