/**
 * Store Types
 * Shared types and interfaces for the game store
 */

import type { StateCreator } from 'zustand';

// Re-export shared types
export type {
  Building,
  BuildingType,
  Chronicle,
  ChronicleEntry,
  CombatResult,
  GameEvent,
  GameOverReason,
  GameSpeed,
  GameState,
  GameStatistics,
  MapData,
  MilitaryStatus,
  ProductionRates,
  ResolvedEvent,
  Resources,
  RivalState,
} from '@stonefall/shared';

import type { BuildingsSlice } from './slices/buildingsSlice';
import type { ChronicleSlice } from './slices/chronicleSlice';
import type { CombatSlice } from './slices/combatSlice';
// Import slice types (will be defined in each slice)
import type { CoreSlice } from './slices/coreSlice';
import type { EraSlice } from './slices/eraSlice';
import type { EventsSlice } from './slices/eventsSlice';
import type { ResourcesSlice } from './slices/resourcesSlice';

/**
 * Complete game store type combining all slices
 */
export type GameStore = CoreSlice &
  ResourcesSlice &
  BuildingsSlice &
  EventsSlice &
  EraSlice &
  CombatSlice &
  ChronicleSlice;

/**
 * Helper type for creating slices with proper typing
 */
export type SliceCreator<T> = StateCreator<
  GameStore,
  [['zustand/subscribeWithSelector', never]],
  [],
  T
>;
