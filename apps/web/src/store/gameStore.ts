/**
 * Game Store
 * Zustand store for global game state management
 */

import type {
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
} from '@stonefall/shared';
import {
  ATTACK_COST,
  BARRACKS_STRENGTH,
  BASE_MAX_POPULATION,
  BUILDINGS,
  COMBAT_COOLDOWN,
  DEFEND_COST,
  DEFEND_DURATION,
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
  RIVAL_DEFENSE,
  RIVAL_ERA_ADVANCE_TICKS,
  RIVAL_NAMES,
  RIVAL_STRENGTH,
  TileType,
  TOWER_DEFENSE,
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

  // Combat (MVP 5)
  attack: () => CombatResult | null;
  defend: () => boolean;
  calculateMilitary: () => MilitaryStatus;

  // Reset
  resetGame: () => void;

  // Chronicle (MVP 7)
  addChronicleEntry: (entry: Omit<ChronicleEntry, 'id' | 'tick' | 'era'>) => void;
  openChronicle: () => void;
  closeChronicle: () => void;
  updateStatistics: () => void;
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

  // Rival and Combat (MVP 5)
  rival: {
    name: RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)] ?? 'Os Ferringos',
    era: Era.Stone,
    strength: RIVAL_STRENGTH[Era.Stone],
    defense: RIVAL_DEFENSE[Era.Stone],
    population: 25, // Initial rival population (balanced)
    isDefeated: false,
  },
  military: {
    strength: 0,
    defense: 0,
  },
  combat: {
    lastActionTick: 0,
    isDefending: false,
    defenseEndTick: 0,
  },
  lastRivalAttack: null as { tick: number; killed: number } | null,

  // Chronicle and Statistics (MVP 7)
  chronicle: {
    civilizationName: RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)] ?? 'Seu Império',
    startedAt: new Date(),
    entries: [],
  } as Chronicle,
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
  } as GameStatistics,
  chronicleModal: false,
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

      // =====================================================================
      // RIVAL PROGRESSION AND ATTACK (MVP 5)
      // =====================================================================
      let newRival = state.rival;

      if (!state.rival.isDefeated && state.era !== Era.Stone) {
        // Rival population growth: +1 every 30 ticks
        if (newTick % 30 === 0 && state.rival.population < 50) {
          newRival = {
            ...newRival,
            population: newRival.population + 1,
          };
        }

        // Rival era progression: advances every RIVAL_ERA_ADVANCE_TICKS
        if (newTick % RIVAL_ERA_ADVANCE_TICKS === 0) {
          const nextRivalEra = NEXT_ERA[state.rival.era];
          if (nextRivalEra) {
            newRival = {
              ...newRival,
              era: nextRivalEra,
              strength: RIVAL_STRENGTH[nextRivalEra],
              defense: RIVAL_DEFENSE[nextRivalEra],
            };
          }
        }

        // Rival attacks player every 30 ticks if player is in Bronze Age+
        if (newTick % 30 === 0) {
          const military = get().calculateMilitary();
          const rivalPower = state.rival.strength * (0.8 + Math.random() * 0.4);
          const playerDefense = military.defense * (0.8 + Math.random() * 0.4);

          // Defense reduces damage by 50% instead of blocking completely
          const defenseReduction = state.combat.isDefending ? 0.5 : 1;

          // Kill 1-3 population based on power difference
          const baseDamage = Math.max(1, Math.floor((rivalPower - playerDefense) / 20));
          const populationKilled = Math.max(0, Math.floor(baseDamage * defenseReduction));

          if (populationKilled > 0) {
            newPopulation = Math.max(0, newPopulation - populationKilled);
            // Store attack result for feedback
            set({ lastRivalAttack: { tick: newTick, killed: populationKilled } });
          }

          if (newPopulation <= 0) {
            gameOver = 'defeat';
          }
        }
      }

      set({
        tick: newTick,
        resources: newResources,
        population: {
          ...state.population,
          current: newPopulation,
          consumptionPerTick: newPopulation * POPULATION_CONSUMPTION_RATE,
        },
        rival: newRival,
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
      // Update statistics before ending the game
      const state = get();
      // Calculate real time played in seconds
      const realTimePlayed = Math.floor((Date.now() - state.chronicle.startedAt.getTime()) / 1000);
      set({
        statistics: {
          ...state.statistics,
          duration: state.tick,
          realTimePlayed,
          finalEra: state.era,
          maxPopulation: Math.max(state.statistics.maxPopulation, state.population.current),
          totalBuildings: state.buildings.length,
          eventsEncountered: state.eventHistory.length,
        },
        gameOver: reason,
        isPaused: true,
      });
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

      // Chronicle: Register era advancement
      const eraNames = {
        stone: 'Idade da Pedra',
        bronze: 'Idade do Bronze',
        iron: 'Idade do Ferro',
      };
      get().addChronicleEntry({
        type: 'era',
        title: `Avanço para ${eraNames[nextEra]}`,
        description: `A civilização evoluiu para a ${eraNames[nextEra]}, desbloqueando novas tecnologias.`,
        icon: '⚡',
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
    // COMBAT (MVP 5)
    // =========================================================================

    calculateMilitary: () => {
      const state = get();
      let strength = 0;
      let defense = 0;

      for (const building of state.buildings) {
        if (building.type === 'barracks') {
          strength += BARRACKS_STRENGTH;
        }
        if (building.type === 'defense_tower') {
          defense += TOWER_DEFENSE;
        }
      }

      return { strength, defense };
    },

    attack: () => {
      const state = get();

      // Check cooldown
      if (state.tick - state.combat.lastActionTick < COMBAT_COOLDOWN) {
        return null;
      }

      // Check cost
      if (!get().canAfford(ATTACK_COST)) {
        return null;
      }

      // Check if rival already defeated
      if (state.rival.isDefeated) {
        return null;
      }

      // Subtract cost
      get().subtractResources(ATTACK_COST);

      // Calculate population killed
      const military = get().calculateMilitary();
      const playerPower = military.strength * (0.8 + Math.random() * 0.4);
      const rivalDefense = state.rival.defense * (0.8 + Math.random() * 0.4);

      // Kill 1-5 population based on power difference
      const populationKilled = Math.max(1, Math.floor((playerPower - rivalDefense / 2) / 10));
      const newRivalPopulation = Math.max(0, state.rival.population - populationKilled);
      const isDefeated = newRivalPopulation <= 0;

      set({
        combat: {
          ...state.combat,
          lastActionTick: state.tick,
        },
        rival: {
          ...state.rival,
          population: newRivalPopulation,
          isDefeated,
        },
        gameOver: isDefeated ? 'victory' : null,
        // Update statistics
        statistics: {
          ...state.statistics,
          totalBattles: state.statistics.totalBattles + 1,
          battlesWon: isDefeated ? state.statistics.battlesWon + 1 : state.statistics.battlesWon,
        },
      });

      // Chronicle: Register significant battles
      if (populationKilled >= 3 || isDefeated) {
        get().addChronicleEntry({
          type: 'combat',
          title: isDefeated ? `Vitória sobre ${state.rival.name}` : 'Batalha Sangrenta',
          description: isDefeated
            ? `Derrotou completamente ${state.rival.name}, conquistando a vitória final!`
            : `Ataque devastador matou ${populationKilled} da população inimiga.`,
          icon: '⚔️',
        });
      }

      return {
        action: 'attack' as const,
        success: populationKilled > 0,
        playerDamage: 0,
        rivalDamage: populationKilled,
        message: isDefeated
          ? `Vitória! ${state.rival.name} foi derrotado!`
          : `Você matou ${populationKilled} da população inimiga!`,
      };
    },

    defend: () => {
      const state = get();

      // Check cooldown
      if (state.tick - state.combat.lastActionTick < COMBAT_COOLDOWN) {
        return false;
      }

      // Check cost
      if (!get().canAfford(DEFEND_COST)) {
        return false;
      }

      // Subtract cost
      get().subtractResources(DEFEND_COST);

      set({
        combat: {
          lastActionTick: state.tick,
          isDefending: true,
          defenseEndTick: state.tick + DEFEND_DURATION,
        },
      });

      return true;
    },

    // =========================================================================
    // CHRONICLE & STATISTICS (MVP 7)
    // =========================================================================

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
export const selectChronicle = (state: GameStore) => state.chronicle;
export const selectStatistics = (state: GameStore) => state.statistics;
export const selectChronicleModal = (state: GameStore) => state.chronicleModal;
