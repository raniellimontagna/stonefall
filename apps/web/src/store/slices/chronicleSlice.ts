/**
 * Chronicle Slice
 * Manages chronicle entries and game statistics
 */

import type { Chronicle, ChronicleEntry, GameStatistics } from '@stonefall/shared';
import { Era, INITIAL_POPULATION, INITIAL_RESOURCES, RIVAL_NAMES } from '@stonefall/shared';
import type { SliceCreator } from '../types';

export interface ChronicleSlice {
  // State
  chronicle: Chronicle;
  statistics: GameStatistics;
  chronicleModal: boolean;

  // Actions
  addChronicleEntry: (entry: Omit<ChronicleEntry, 'id' | 'tick' | 'era'>) => void;
  openChronicle: () => void;
  closeChronicle: () => void;
  updateStatistics: () => void;
}

export const createChronicleSlice: SliceCreator<ChronicleSlice> = (set, get) => ({
  // Initial state
  chronicle: {
    civilizationName: RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)] ?? 'Seu Império',
    startedAt: new Date(),
    entries: [],
  },
  statistics: {
    duration: 0,
    realTimePlayed: 0,
    finalEra: Era.Stone,
    maxPopulation: INITIAL_POPULATION,
    totalBuildings: 1, // Town center
    totalBattles: 0,
    battlesWon: 0,
    eventsEncountered: 0,
    resourcesGathered: { ...INITIAL_RESOURCES },
  },
  chronicleModal: false,

  // Actions
  addChronicleEntry: (entry: Omit<ChronicleEntry, 'id' | 'tick' | 'era'>) => {
    const state = get();
    const newEntry: ChronicleEntry = {
      ...entry,
      id: `chronicle_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      tick: state.tick,
      era: state.era,
    };

    // Limit to 200 entries for performance
    const updatedEntries = [...state.chronicle.entries, newEntry];
    if (updatedEntries.length > 200) {
      updatedEntries.shift(); // Remove oldest
    }

    set({
      chronicle: {
        ...state.chronicle,
        entries: updatedEntries,
      },
    });
  },

  openChronicle: () => {
    set({ chronicleModal: true });
  },

  closeChronicle: () => {
    set({ chronicleModal: false });
  },

  updateStatistics: () => {
    const state = get();
    set({
      statistics: {
        ...state.statistics,
        duration: state.tick,
        finalEra: state.era,
        maxPopulation: Math.max(state.statistics.maxPopulation, state.population.current),
        totalBuildings: state.buildings.length,
      },
    });
  },
});
