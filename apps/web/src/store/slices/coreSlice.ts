/**
 * Core Slice
 * Manages core game state: tick, pause, speed, map, game over, reset
 */

import type {
  Era as EraType,
  GameOverReason,
  GameSpeed,
  MapData,
  PopulationState,
} from '@stonefall/shared';
import {
  BASE_MAX_POPULATION,
  Era,
  FOOD_DEBT_THRESHOLD,
  FOOD_GAME_OVER_THRESHOLD,
  GRID_HEIGHT,
  GRID_WIDTH,
  INITIAL_POPULATION,
  INITIAL_RESOURCES,
  NEXT_ERA,
  POPULATION_CONSUMPTION_RATE,
  POPULATION_DEATH_INTERVAL,
  POPULATION_GROWTH_INTERVAL,
  ResourceType,
  RIVAL_DEFENSE,
  RIVAL_ERA_ADVANCE_TICKS,
  RIVAL_NAMES,
  RIVAL_STRENGTH,
} from '@stonefall/shared';
import { soundManager } from '@/game/SoundManager';
import type { SliceCreator } from '../types';

export interface CoreSlice {
  // State
  tick: number;
  era: EraType;
  isPaused: boolean;
  gameSpeed: GameSpeed;
  gameOver: GameOverReason;
  map: MapData;
  population: PopulationState;

  // Actions
  processTick: () => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setGameSpeed: (speed: GameSpeed) => void;
  setMap: (map: MapData) => void;
  setGameOver: (reason: GameOverReason) => void;
  resetGame: () => void;
}

export const createCoreSlice: SliceCreator<CoreSlice> = (set, get) => ({
  // Initial state
  tick: 0,
  era: Era.Stone,
  isPaused: true,
  gameSpeed: 1,
  gameOver: null,
  map: {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    tiles: [],
  },
  population: {
    current: INITIAL_POPULATION,
    max: BASE_MAX_POPULATION,
    consumptionPerTick: INITIAL_POPULATION * POPULATION_CONSUMPTION_RATE,
  },

  // Actions
  processTick: () => {
    const state = get();
    if (state.isPaused || state.gameOver) return;

    const newTick = state.tick + 1;

    // Calculate consumption
    const consumption = state.population.current * POPULATION_CONSUMPTION_RATE;

    // Apply production and consumption
    const newFood = state.resources[ResourceType.Food] + state.production.food - consumption;
    const newResources = {
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

  setMap: (map: MapData) => {
    set({ map });
  },

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

    // Play appropriate sound based on game over reason
    if (reason === 'victory') {
      soundManager.play('success');
    } else {
      soundManager.play('error');
    }
  },

  resetGame: () => {
    set({
      tick: 0,
      era: Era.Stone,
      isPaused: true,
      gameSpeed: 1,
      gameOver: null,
      resources: { ...INITIAL_RESOURCES },
      production: { food: 0, wood: 0, stone: 0, gold: 0 },
      population: {
        current: INITIAL_POPULATION,
        max: BASE_MAX_POPULATION,
        consumptionPerTick: INITIAL_POPULATION * POPULATION_CONSUMPTION_RATE,
      },
      buildings: [],
      map: { width: GRID_WIDTH, height: GRID_HEIGHT, tiles: [] },
      placementMode: null,
      pendingEvent: null,
      eventHistory: [],
      lastEventTick: 0,
      isGeneratingEvent: false,
      rival: {
        name: RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)] ?? 'Os Ferringos',
        era: Era.Stone,
        strength: RIVAL_STRENGTH[Era.Stone],
        defense: RIVAL_DEFENSE[Era.Stone],
        population: 25,
        isDefeated: false,
      },
      military: { strength: 0, defense: 0 },
      combat: { lastActionTick: 0, isDefending: false, defenseEndTick: 0 },
      lastRivalAttack: null,
      chronicle: {
        civilizationName:
          RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)] ?? 'Seu Império',
        startedAt: new Date(),
        entries: [],
      },
      statistics: {
        duration: 0,
        realTimePlayed: 0,
        finalEra: Era.Stone,
        maxPopulation: INITIAL_POPULATION,
        totalBuildings: 1,
        totalBattles: 0,
        battlesWon: 0,
        eventsEncountered: 0,
        resourcesGathered: { ...INITIAL_RESOURCES },
      },
      chronicleModal: false,
    });
  },
});
