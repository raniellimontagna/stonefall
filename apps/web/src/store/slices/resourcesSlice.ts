/**
 * Resources Slice
 * Manages resources and production
 */

import type { ProductionRates, Resources } from '@stonefall/shared';
import { INITIAL_RESOURCES, type ResourceType } from '@stonefall/shared';
import type { SliceCreator } from '../types';

export interface ResourcesSlice {
  // State
  resources: Resources;
  production: ProductionRates;

  // Actions
  addResources: (resources: Partial<Resources>) => void;
  subtractResources: (resources: Partial<Resources>) => boolean;
  canAfford: (cost: Partial<Resources>) => boolean;
}

export const createResourcesSlice: SliceCreator<ResourcesSlice> = (set, get) => ({
  // Initial state
  resources: { ...INITIAL_RESOURCES },
  production: {
    food: 0,
    wood: 0,
    stone: 0,
    gold: 0,
  },

  // Actions
  addResources: (resources: Partial<Resources>) => {
    set((state) => {
      const newResources = { ...state.resources };
      for (const [key, value] of Object.entries(resources)) {
        const resourceType = key as ResourceType;
        if (value !== undefined) {
          newResources[resourceType] += value;
        }
      }
      return { resources: newResources };
    });
  },

  subtractResources: (resources: Partial<Resources>) => {
    const state = get();
    if (!get().canAfford(resources)) return false;

    const newResources = { ...state.resources };
    for (const [key, value] of Object.entries(resources)) {
      const resourceType = key as ResourceType;
      if (value !== undefined) {
        newResources[resourceType] -= value;
      }
    }

    set({ resources: newResources });
    return true;
  },

  canAfford: (cost: Partial<Resources>) => {
    const state = get();
    for (const [key, value] of Object.entries(cost)) {
      const resourceType = key as ResourceType;
      if (value !== undefined && state.resources[resourceType] < value) {
        return false;
      }
    }
    return true;
  },
});
