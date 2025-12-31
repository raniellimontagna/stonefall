/**
 * Events Constants Tests
 * Tests for event-related functions and constants
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Era } from '../types/game';
import {
  EVENT_FREQUENCY,
  EVENT_TYPE_ICONS,
  FALLBACK_EVENTS,
  getEventWeights,
  getRandomFallbackEvent,
  MIN_TICKS_BETWEEN_EVENTS,
  selectEventType,
} from './events';

describe('Event Constants', () => {
  describe('EVENT_FREQUENCY', () => {
    it('should have frequency config for all eras', () => {
      expect(EVENT_FREQUENCY[Era.Stone]).toBeDefined();
      expect(EVENT_FREQUENCY[Era.Bronze]).toBeDefined();
      expect(EVENT_FREQUENCY[Era.Iron]).toBeDefined();
    });

    it('should have increasing chance per tick in later eras', () => {
      expect(EVENT_FREQUENCY[Era.Bronze].chancePerTick).toBeGreaterThan(
        EVENT_FREQUENCY[Era.Stone].chancePerTick
      );
      expect(EVENT_FREQUENCY[Era.Iron].chancePerTick).toBeGreaterThan(
        EVENT_FREQUENCY[Era.Bronze].chancePerTick
      );
    });
  });

  describe('EVENT_TYPE_ICONS', () => {
    it('should have icons for all event types', () => {
      expect(EVENT_TYPE_ICONS.economic).toBeDefined();
      expect(EVENT_TYPE_ICONS.social).toBeDefined();
      expect(EVENT_TYPE_ICONS.natural).toBeDefined();
      expect(EVENT_TYPE_ICONS.military).toBeDefined();
      expect(EVENT_TYPE_ICONS.political).toBeDefined();
    });
  });

  describe('FALLBACK_EVENTS', () => {
    it('should have at least one event', () => {
      expect(FALLBACK_EVENTS.length).toBeGreaterThan(0);
    });

    it('should have valid event structure for all events', () => {
      for (const event of FALLBACK_EVENTS) {
        expect(event.id).toBeDefined();
        expect(event.type).toBeDefined();
        expect(event.title).toBeDefined();
        expect(event.description).toBeDefined();
        expect(event.choices.length).toBeGreaterThan(0);
      }
    });

    it('should have choices with effects', () => {
      for (const event of FALLBACK_EVENTS) {
        for (const choice of event.choices) {
          expect(choice.id).toBeDefined();
          expect(choice.text).toBeDefined();
          expect(Array.isArray(choice.effects)).toBe(true);
        }
      }
    });
  });

  describe('MIN_TICKS_BETWEEN_EVENTS', () => {
    it('should be a positive number', () => {
      expect(MIN_TICKS_BETWEEN_EVENTS).toBeGreaterThan(0);
    });
  });
});

describe('getRandomFallbackEvent', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a valid GameEvent structure', () => {
    const event = getRandomFallbackEvent(Era.Stone);

    expect(event.id).toBeDefined();
    expect(event.type).toBeDefined();
    expect(event.title).toBeDefined();
    expect(event.description).toBeDefined();
    expect(event.choices).toBeDefined();
  });

  it('should return event with unique ID containing timestamp', () => {
    const event = getRandomFallbackEvent(Era.Stone);

    expect(event.id).toContain('1234567890');
  });

  it('should work for all eras', () => {
    const stoneEvent = getRandomFallbackEvent(Era.Stone);
    const bronzeEvent = getRandomFallbackEvent(Era.Bronze);
    const ironEvent = getRandomFallbackEvent(Era.Iron);

    expect(stoneEvent).toBeDefined();
    expect(bronzeEvent).toBeDefined();
    expect(ironEvent).toBeDefined();
  });
});

describe('getEventWeights', () => {
  it('should increase economic weight when food is low (< 50)', () => {
    const lowFoodWeights = getEventWeights(30, 10, Era.Stone);
    const normalFoodWeights = getEventWeights(100, 10, Era.Stone);

    expect(lowFoodWeights.economic).toBe(3);
    expect(normalFoodWeights.economic).toBe(1);
  });

  it('should increase social weight when population is high (> 15)', () => {
    const highPopWeights = getEventWeights(100, 20, Era.Stone);
    const lowPopWeights = getEventWeights(100, 10, Era.Stone);

    expect(highPopWeights.social).toBe(2);
    expect(lowPopWeights.social).toBe(1);
  });

  it('should set military weight to 0 in Stone Age', () => {
    const stoneWeights = getEventWeights(100, 10, Era.Stone);

    expect(stoneWeights.military).toBe(0);
  });

  it('should enable military events in Bronze and Iron Age', () => {
    const bronzeWeights = getEventWeights(100, 10, Era.Bronze);
    const ironWeights = getEventWeights(100, 10, Era.Iron);

    expect(bronzeWeights.military).toBe(2);
    expect(ironWeights.military).toBe(2);
  });

  it('should enable political events only in Iron Age', () => {
    const stoneWeights = getEventWeights(100, 10, Era.Stone);
    const bronzeWeights = getEventWeights(100, 10, Era.Bronze);
    const ironWeights = getEventWeights(100, 10, Era.Iron);

    expect(stoneWeights.political).toBe(0);
    expect(bronzeWeights.political).toBe(0);
    expect(ironWeights.political).toBe(2);
  });

  it('should always have natural weight of 1', () => {
    const weights = getEventWeights(100, 10, Era.Stone);

    expect(weights.natural).toBe(1);
  });
});

describe('selectEventType', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return economic when it has highest weight and random is low', () => {
    vi.mocked(Math.random).mockReturnValue(0.1);

    const weights = { economic: 3, social: 1, natural: 1, military: 0, political: 0 };
    const result = selectEventType(weights);

    expect(result).toBe('economic');
  });

  it('should return valid EventType', () => {
    vi.mocked(Math.random).mockReturnValue(0.5);

    const weights = { economic: 1, social: 1, natural: 1, military: 1, political: 1 };
    const result = selectEventType(weights);

    expect(['economic', 'social', 'natural', 'military', 'political']).toContain(result);
  });

  it('should default to economic when all weights result in fallthrough', () => {
    vi.mocked(Math.random).mockReturnValue(0.99);

    const weights = { economic: 0, social: 0, natural: 0, military: 0, political: 0 };
    const result = selectEventType(weights);

    expect(result).toBe('economic');
  });

  it('should select based on weight distribution', () => {
    // With 100% weight on natural, should always return natural
    vi.mocked(Math.random).mockReturnValue(0.5);

    const weights = { economic: 0, social: 0, natural: 10, military: 0, political: 0 };
    const result = selectEventType(weights);

    expect(result).toBe('natural');
  });
});
