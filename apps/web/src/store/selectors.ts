/**
 * Store Selectors
 * Optimized selectors for component re-renders
 */

import type { GameStore } from './types';

// Core
export const selectTick = (state: GameStore) => state.tick;
export const selectEra = (state: GameStore) => state.era;
export const selectIsPaused = (state: GameStore) => state.isPaused;
export const selectGameSpeed = (state: GameStore) => state.gameSpeed;
export const selectGameOver = (state: GameStore) => state.gameOver;

// Resources
export const selectResources = (state: GameStore) => state.resources;
export const selectProduction = (state: GameStore) => state.production;
export const selectPopulation = (state: GameStore) => state.population;

// Buildings
export const selectBuildings = (state: GameStore) => state.buildings;
export const selectPlacementMode = (state: GameStore) => state.placementMode;

// Events
export const selectPendingEvent = (state: GameStore) => state.pendingEvent;
export const selectEventHistory = (state: GameStore) => state.eventHistory;

// Chronicle
export const selectChronicle = (state: GameStore) => state.chronicle;
export const selectStatistics = (state: GameStore) => state.statistics;
export const selectChronicleModal = (state: GameStore) => state.chronicleModal;

// Combat
export const selectRival = (state: GameStore) => state.rival;
export const selectMilitary = (state: GameStore) => state.military;
export const selectCombat = (state: GameStore) => state.combat;
export const selectLastRivalAttack = (state: GameStore) => state.lastRivalAttack;
