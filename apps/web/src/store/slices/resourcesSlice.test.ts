/**
 * Resources Slice Tests
 * Tests for resource management in the game store
 */

import { INITIAL_RESOURCES, ResourceType } from '@stonefall/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '../gameStore';

describe('resourcesSlice', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe('initial state', () => {
    it('should start with initial resources', () => {
      const { resources } = useGameStore.getState();

      expect(resources[ResourceType.Food]).toBe(INITIAL_RESOURCES[ResourceType.Food]);
      expect(resources[ResourceType.Wood]).toBe(INITIAL_RESOURCES[ResourceType.Wood]);
      expect(resources[ResourceType.Stone]).toBe(INITIAL_RESOURCES[ResourceType.Stone]);
      expect(resources[ResourceType.Gold]).toBe(INITIAL_RESOURCES[ResourceType.Gold]);
    });
  });

  describe('addResources', () => {
    it('should add food correctly', () => {
      const store = useGameStore.getState();
      const initialFood = store.resources[ResourceType.Food];

      store.addResources({ [ResourceType.Food]: 10 });

      expect(useGameStore.getState().resources[ResourceType.Food]).toBe(initialFood + 10);
    });

    it('should add multiple resources at once', () => {
      const store = useGameStore.getState();
      const initialWood = store.resources[ResourceType.Wood];
      const initialStone = store.resources[ResourceType.Stone];

      store.addResources({
        [ResourceType.Wood]: 20,
        [ResourceType.Stone]: 15,
      });

      const newState = useGameStore.getState();
      expect(newState.resources[ResourceType.Wood]).toBe(initialWood + 20);
      expect(newState.resources[ResourceType.Stone]).toBe(initialStone + 15);
    });
  });

  describe('subtractResources', () => {
    it('should subtract resources when affordable', () => {
      const store = useGameStore.getState();
      const initialFood = store.resources[ResourceType.Food];

      const result = store.subtractResources({ [ResourceType.Food]: 10 });

      expect(result).toBe(true);
      expect(useGameStore.getState().resources[ResourceType.Food]).toBe(initialFood - 10);
    });

    it('should return false when not affordable', () => {
      const store = useGameStore.getState();

      // Try to subtract more than we have
      const result = store.subtractResources({ [ResourceType.Gold]: 1000 });

      expect(result).toBe(false);
      // Resources should remain unchanged
      expect(useGameStore.getState().resources[ResourceType.Gold]).toBe(
        INITIAL_RESOURCES[ResourceType.Gold]
      );
    });
  });

  describe('canAfford', () => {
    it('should return true when resources are sufficient', () => {
      const store = useGameStore.getState();

      expect(
        store.canAfford({
          [ResourceType.Food]: 10,
          [ResourceType.Wood]: 10,
        })
      ).toBe(true);
    });

    it('should return false when any resource is insufficient', () => {
      const store = useGameStore.getState();

      expect(
        store.canAfford({
          [ResourceType.Food]: 10,
          [ResourceType.Gold]: 1000, // Way more than we have
        })
      ).toBe(false);
    });

    it('should return true for empty cost', () => {
      const store = useGameStore.getState();

      expect(store.canAfford({})).toBe(true);
    });
  });
});
