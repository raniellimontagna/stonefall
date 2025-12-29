/**
 * Game Store
 * Zustand store for global game state management
 */

import type {
  Building,
  BuildingType,
  GameEvent,
  GameOverReason,
  GameSpeed,
  GameState,
  MapData,
  ProductionRates,
  ResolvedEvent,
  Resources,
} from '@stonefall/shared';
import {
  BASE_MAX_POPULATION,
  BUILDINGS,
  ERA_MODIFIERS,
  ERA_REQUIREMENTS,
  Era,
  EVENT_FREQUENCY,
  FOOD_DEBT_THRESHOLD,
  FOOD_GAME_OVER_THRESHOLD,
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_POPULATION,
  INITIAL_RESOURCES,
  MIN_TICKS_BETWEEN_EVENTS,
  NEXT_ERA,
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

  // Events (MVP 3)
  triggerEvent: (event: GameEvent) => void;
  resolveEvent: (choiceId: string) => void;
  checkForEvent: () => Promise<void>;

  // Era progression (MVP 4)
  canAdvanceEra: () => boolean;
  advanceEra: () => boolean;
  getAvailableBuildings: () => BuildingType[];

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

  // Events (MVP 3)
  pendingEvent: null,
  eventHistory: [],
  lastEventTick: 0,
  isGeneratingEvent: false,
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

      // Check for events after state update (async, non-blocking)
      // Only check if no game over and no pending event
      if (!gameOver && !state.pendingEvent) {
        get().checkForEvent();
      }
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
    // EVENTS (MVP 3)
    // =========================================================================

    triggerEvent: (event: GameEvent) => {
      set((state) => ({
        pendingEvent: event,
        isPaused: true, // Pause game when event is active
        lastEventTick: state.tick,
      }));
    },

    resolveEvent: (choiceId: string) => {
      const state = get();
      const event = state.pendingEvent;

      if (!event) return;

      // Find the chosen option
      const choice = event.choices.find((c) => c.id === choiceId);
      if (!choice) return;

      // Apply effects
      const newResources = { ...state.resources };
      let newPopulation = state.population.current;

      for (const effect of choice.effects) {
        if (effect.type === 'resource') {
          const target = effect.target as keyof Resources;
          if (target in newResources) {
            if (effect.isPercentage) {
              newResources[target] = Math.floor(newResources[target] * (1 + effect.value / 100));
            } else {
              newResources[target] = Math.max(0, newResources[target] + effect.value);
            }
          }
        } else if (effect.type === 'population') {
          if (effect.target === 'current') {
            if (effect.isPercentage) {
              newPopulation = Math.floor(newPopulation * (1 + effect.value / 100));
            } else {
              newPopulation = Math.max(1, newPopulation + effect.value);
            }
          }
        }
      }

      // Clamp population to max
      newPopulation = Math.min(newPopulation, state.population.max);

      // Create resolved event record
      const resolvedEvent: ResolvedEvent = {
        event,
        choiceId,
        resolvedAt: state.tick,
        appliedEffects: choice.effects,
      };

      set({
        pendingEvent: null,
        isPaused: false, // Resume game after event is resolved
        resources: newResources,
        population: {
          ...state.population,
          current: newPopulation,
          consumptionPerTick: newPopulation * POPULATION_CONSUMPTION_RATE,
        },
        eventHistory: [...state.eventHistory, resolvedEvent],
      });
    },

    checkForEvent: async () => {
      const state = get();

      // Don't check if game is paused, over, or event is pending, or already generating
      if (state.isPaused || state.gameOver || state.pendingEvent || state.isGeneratingEvent) return;

      // Check cooldown
      const ticksSinceLastEvent = state.tick - state.lastEventTick;
      if (ticksSinceLastEvent < MIN_TICKS_BETWEEN_EVENTS) return;

      // Check frequency based on era
      const frequency = EVENT_FREQUENCY[state.era];
      const randomRoll = Math.random();

      // Only trigger if past minimum interval and random check passes
      if (ticksSinceLastEvent < frequency.minInterval) return;
      if (randomRoll > frequency.chancePerTick) return;

      // Set lock
      set({ isGeneratingEvent: true });

      // Try to fetch event from API
      try {
        const response = await fetch('/api/events/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            era: state.era,
            tick: state.tick,
            population: state.population.current,
            resources: {
              food: state.resources.food,
              wood: state.resources.wood,
              stone: state.resources.stone,
              gold: state.resources.gold,
            },
            recentEvents: state.eventHistory.slice(-3).map((e) => e.event.title),
          }),
        });

        if (response.ok) {
          const eventData = await response.json();
          if (eventData.event) {
            get().triggerEvent(eventData.event);
          }
        }
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        // Release lock
        set({ isGeneratingEvent: false });
      }
    },

    // =========================================================================
    // ERA PROGRESSION (MVP 4)
    // =========================================================================

    canAdvanceEra: () => {
      const state = get();
      const nextEra = NEXT_ERA[state.era];
      if (!nextEra) return false;

      const requirements = ERA_REQUIREMENTS[nextEra];
      if (!requirements) return false;

      // Check resource requirements
      for (const [resource, amount] of Object.entries(requirements.resources)) {
        if (state.resources[resource as keyof Resources] < (amount ?? 0)) {
          return false;
        }
      }

      // Check population requirement
      if (state.population.current < requirements.population) {
        return false;
      }

      // Check building requirements
      for (const buildingType of requirements.buildings) {
        if (get().getBuildingCount(buildingType) < 1) {
          return false;
        }
      }

      return true;
    },

    advanceEra: () => {
      const state = get();
      if (!get().canAdvanceEra()) return false;

      const nextEra = NEXT_ERA[state.era];
      if (!nextEra) return false;

      const requirements = ERA_REQUIREMENTS[nextEra];
      if (!requirements) return false;

      // Consume resources for era advancement
      const newResources = { ...state.resources };
      for (const [resource, amount] of Object.entries(requirements.resources)) {
        const key = resource as keyof Resources;
        newResources[key] -= amount ?? 0;
      }

      // Apply era modifier to production
      const modifier = ERA_MODIFIERS[nextEra];
      const newProduction = {
        food: state.production.food * modifier.production,
        wood: state.production.wood * modifier.production,
        stone: state.production.stone * modifier.production,
        gold: state.production.gold * modifier.production,
      };

      set({
        era: nextEra,
        resources: newResources,
        production: newProduction,
      });

      return true;
    },

    getAvailableBuildings: () => {
      const state = get();
      const availableBuildings: BuildingType[] = [];

      for (const [type, def] of Object.entries(BUILDINGS)) {
        // Skip Town Center (auto-placed)
        if (type === 'town_center') continue;

        // Check if building is available for current era or earlier
        const buildingEraIndex = [Era.Stone, Era.Bronze, Era.Iron].indexOf(def.era);
        const currentEraIndex = [Era.Stone, Era.Bronze, Era.Iron].indexOf(state.era);

        if (buildingEraIndex <= currentEraIndex) {
          availableBuildings.push(type as BuildingType);
        }
      }

      return availableBuildings;
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
export const selectPendingEvent = (state: GameStore) => state.pendingEvent;
export const selectEventHistory = (state: GameStore) => state.eventHistory;
