/**
 * Game Store
 * Zustand store combining all slices for global game state management
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  createBuildingsSlice,
  createChronicleSlice,
  createCombatSlice,
  createCoreSlice,
  createEraSlice,
  createEventsSlice,
  createResourcesSlice,
} from './slices';
import type { GameStore } from './types';

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((...args) => ({
    ...createCoreSlice(...args),
    ...createResourcesSlice(...args),
    ...createBuildingsSlice(...args),
    ...createEventsSlice(...args),
    ...createEraSlice(...args),
    ...createCombatSlice(...args),
    ...createChronicleSlice(...args),
  }))
);
