/**
 * Buildings Slice
 * Manages buildings and placement
 */

import type { Building, BuildingType } from '@stonefall/shared';
import { BUILDINGS, Era, TileType } from '@stonefall/shared';
import { soundManager } from '@/game/SoundManager';
import { calculateMaxPopulation, calculateProduction, generateBuildingId } from '../helpers';
import type { SliceCreator } from '../types';

export interface BuildingsSlice {
  // State
  buildings: Building[];
  placementMode: BuildingType | null;

  // Actions
  placeBuilding: (type: BuildingType, col: number, row: number) => boolean;
  removeBuilding: (id: string) => void;
  setPlacementMode: (type: BuildingType | null) => void;
  canPlaceBuilding: (type: BuildingType, col: number, row: number) => boolean;
  getBuildingAt: (col: number, row: number) => Building | null;
  getBuildingCount: (type: BuildingType) => number;
  recalculateProduction: () => void;
}

export const createBuildingsSlice: SliceCreator<BuildingsSlice> = (set, get) => ({
  // Initial state
  buildings: [],
  placementMode: null,

  // Actions
  placeBuilding: (type: BuildingType, col: number, row: number) => {
    const state = get();
    const def = BUILDINGS[type];

    // Validate placement
    if (!get().canPlaceBuilding(type, col, row)) {
      return false;
    }

    // Deduct cost
    if (!get().subtractResources(def.cost)) {
      return false;
    }

    // Create building
    const building: Building = {
      id: generateBuildingId(),
      type,
      position: { col, row },
      hp: def.hp,
      maxHp: def.hp,
    };

    const newBuildings = [...state.buildings, building];

    // Recalculate production and population
    const production = calculateProduction(newBuildings);
    const maxPopulation = calculateMaxPopulation(newBuildings);

    set({
      buildings: newBuildings,
      production,
      population: {
        ...state.population,
        max: maxPopulation,
      },
      placementMode: null, // Exit placement mode after building
    });

    // Play build sound
    soundManager.play('build');

    // Chronicle: Register first building of each type
    const isFirstOfType = !state.buildings.some((b) => b.type === type);
    if (isFirstOfType && type !== 'town_center') {
      get().addChronicleEntry({
        type: 'building',
        title: `Primeira ${def.name}`,
        description: `Construiu a primeira ${def.name} da civilização.`,
        icon: '🏗️',
      });
    }

    return true;
  },

  removeBuilding: (id: string) => {
    set((state) => {
      const newBuildings = state.buildings.filter((b) => b.id !== id);
      const production = calculateProduction(newBuildings);
      const maxPopulation = calculateMaxPopulation(newBuildings);

      return {
        buildings: newBuildings,
        production,
        population: {
          ...state.population,
          max: maxPopulation,
        },
      };
    });
  },

  setPlacementMode: (type: BuildingType | null) => {
    set({ placementMode: type });
  },

  canPlaceBuilding: (type: BuildingType, col: number, row: number) => {
    const state = get();
    const def = BUILDINGS[type];

    // Check if within map bounds
    if (col < 0 || col >= state.map.width || row < 0 || row >= state.map.height) {
      return false;
    }

    // Check if tile exists and is valid type
    const tile = state.map.tiles[row]?.[col];
    if (!tile || !def.validTiles.includes(tile.type)) {
      return false;
    }

    // Check if tile is not water (additional safety)
    if (tile.type === TileType.Water) {
      return false;
    }

    // Check if tile is already occupied
    if (get().getBuildingAt(col, row)) {
      return false;
    }

    // Check building limit
    if (def.limit !== null) {
      const count = get().getBuildingCount(type);
      if (count >= def.limit) {
        return false;
      }
    }

    // Check if can afford
    if (!get().canAfford(def.cost)) {
      return false;
    }

    // Check era requirement
    if (def.era === Era.Bronze && state.era === Era.Stone) {
      return false;
    }
    if (def.era === Era.Iron && state.era !== Era.Iron) {
      return false;
    }

    return true;
  },

  getBuildingAt: (col: number, row: number) => {
    const state = get();
    return state.buildings.find((b) => b.position.col === col && b.position.row === row) ?? null;
  },

  getBuildingCount: (type: BuildingType) => {
    const state = get();
    return state.buildings.filter((b) => b.type === type).length;
  },

  recalculateProduction: () => {
    const state = get();
    const production = calculateProduction(state.buildings);
    const maxPopulation = calculateMaxPopulation(state.buildings);

    set({
      production,
      population: {
        ...state.population,
        max: maxPopulation,
      },
    });
  },
});
