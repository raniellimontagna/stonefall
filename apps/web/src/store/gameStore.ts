/**
 * Game Store
 * Zustand store for global game state management
 */

import type {
  Building,
  BuildingType,
  GameOverReason,
  GameSpeed,
  GameState,
  MapData,
  ProductionRates,
  Resources,
} from '@stonefall/shared';
import {
  BASE_MAX_POPULATION,
  BUILDINGS,
  Era,
  FOOD_DEBT_THRESHOLD,
  FOOD_GAME_OVER_THRESHOLD,
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_POPULATION,
  INITIAL_RESOURCES,
  POPULATION_CONSUMPTION_RATE,
  POPULATION_DEATH_INTERVAL,
  POPULATION_GROWTH_INTERVAL,
  ResourceType,
  TileType,
} from '@stonefall/shared';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface GameActions {
  // Tick system
  processTick: () => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setGameSpeed: (speed: GameSpeed) => void;

  // Map
  setMap: (map: MapData) => void;

  // Resources
  addResources: (resources: Partial<Resources>) => void;
  subtractResources: (resources: Partial<Resources>) => boolean;
  canAfford: (cost: Partial<Resources>) => boolean;

  // Buildings
  placeBuilding: (type: BuildingType, col: number, row: number) => boolean;
  removeBuilding: (id: string) => void;
  setPlacementMode: (type: BuildingType | null) => void;
  canPlaceBuilding: (type: BuildingType, col: number, row: number) => boolean;
  getBuildingAt: (col: number, row: number) => Building | null;
  getBuildingCount: (type: BuildingType) => number;

  // Production
  recalculateProduction: () => void;

  // Game over
  setGameOver: (reason: GameOverReason) => void;

  // Reset
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

// =============================================================================
// INITIAL STATE
// =============================================================================

const createInitialState = (): GameState => ({
  tick: 0,
  era: Era.Stone,
  isPaused: true,
  gameSpeed: 1,
  gameOver: null,

  resources: { ...INITIAL_RESOURCES },
  production: {
    food: 0,
    wood: 0,
    stone: 0,
    gold: 0,
  },

  population: {
    current: INITIAL_POPULATION,
    max: BASE_MAX_POPULATION,
    consumptionPerTick: INITIAL_POPULATION * POPULATION_CONSUMPTION_RATE,
  },

  buildings: [],

  map: {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    tiles: [],
  },

  placementMode: null,
});

// =============================================================================
// HELPERS
// =============================================================================

/** Generate unique building ID */
const generateBuildingId = (): string => {
  return `building_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/** Calculate total production from all buildings */
const calculateProduction = (buildings: Building[]): ProductionRates => {
  const production: ProductionRates = { food: 0, wood: 0, stone: 0, gold: 0 };

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
    if (def.production) {
      if (def.production[ResourceType.Food]) {
        production.food += def.production[ResourceType.Food];
      }
      if (def.production[ResourceType.Wood]) {
        production.wood += def.production[ResourceType.Wood];
      }
      if (def.production[ResourceType.Stone]) {
        production.stone += def.production[ResourceType.Stone];
      }
      if (def.production[ResourceType.Gold]) {
        production.gold += def.production[ResourceType.Gold];
      }
    }
  }

  return production;
};

/** Calculate max population from buildings */
const calculateMaxPopulation = (buildings: Building[]): number => {
  let maxPop = BASE_MAX_POPULATION;

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
    maxPop += def.populationBonus;
  }

  return maxPop;
};

// =============================================================================
// STORE
// =============================================================================

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...createInitialState(),

    // =========================================================================
    // TICK SYSTEM
    // =========================================================================

    processTick: () => {
      const state = get();
      if (state.isPaused || state.gameOver) return;

      const newTick = state.tick + 1;

      // Calculate consumption
      const consumption = state.population.current * POPULATION_CONSUMPTION_RATE;

      // Apply production and consumption
      const newFood = state.resources[ResourceType.Food] + state.production.food - consumption;
      const newResources: Resources = {
        [ResourceType.Food]: newFood,
        [ResourceType.Wood]: state.resources[ResourceType.Wood] + state.production.wood,
        [ResourceType.Stone]: state.resources[ResourceType.Stone] + state.production.stone,
        [ResourceType.Gold]: state.resources[ResourceType.Gold] + state.production.gold,
      };

      // Population changes
      let newPopulation = state.population.current;

      // Growth: +1 every POPULATION_GROWTH_INTERVAL ticks if food > 0
      if (
        newFood > 0 &&
        newTick % POPULATION_GROWTH_INTERVAL === 0 &&
        newPopulation < state.population.max
      ) {
        newPopulation += 1;
      }

      // Death: -1 every POPULATION_DEATH_INTERVAL ticks if food < threshold
      if (
        newFood < FOOD_DEBT_THRESHOLD &&
        newTick % POPULATION_DEATH_INTERVAL === 0 &&
        newPopulation > 1
      ) {
        newPopulation -= 1;
      }

      // Check for game over
      let gameOver: GameOverReason = null;
      if (newFood < FOOD_GAME_OVER_THRESHOLD) {
        gameOver = 'starvation';
      }

      set({
        tick: newTick,
        resources: newResources,
        population: {
          ...state.population,
          current: newPopulation,
          consumptionPerTick: newPopulation * POPULATION_CONSUMPTION_RATE,
        },
        gameOver,
      });
    },

    togglePause: () => {
      set((state) => ({ isPaused: !state.isPaused }));
    },

    setPaused: (paused: boolean) => {
      set({ isPaused: paused });
    },

    setGameSpeed: (speed: GameSpeed) => {
      set({ gameSpeed: speed });
    },

    // =========================================================================
    // MAP
    // =========================================================================

    setMap: (map: MapData) => {
      set({ map });
    },

    // =========================================================================
    // RESOURCES
    // =========================================================================

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

    // =========================================================================
    // BUILDINGS
    // =========================================================================

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

    // =========================================================================
    // PRODUCTION
    // =========================================================================

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

    // =========================================================================
    // GAME OVER
    // =========================================================================

    setGameOver: (reason: GameOverReason) => {
      set({ gameOver: reason, isPaused: true });
    },

    // =========================================================================
    // RESET
    // =========================================================================

    resetGame: () => {
      set(createInitialState());
    },
  }))
);

// =============================================================================
// SELECTORS (for optimized re-renders)
// =============================================================================

export const selectResources = (state: GameStore) => state.resources;
export const selectProduction = (state: GameStore) => state.production;
export const selectPopulation = (state: GameStore) => state.population;
export const selectBuildings = (state: GameStore) => state.buildings;
export const selectTick = (state: GameStore) => state.tick;
export const selectEra = (state: GameStore) => state.era;
export const selectIsPaused = (state: GameStore) => state.isPaused;
export const selectPlacementMode = (state: GameStore) => state.placementMode;
export const selectGameSpeed = (state: GameStore) => state.gameSpeed;
export const selectGameOver = (state: GameStore) => state.gameOver;
