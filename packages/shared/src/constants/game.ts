/**
 * Game Constants
 * All magic numbers centralized here for easy balancing
 * Source of truth: docs/game/balance.md
 */

import type { BuildingDefinition, Resources } from '../types/game';
import { BuildingType, Era, ResourceType, TileType } from '../types/game';

// =============================================================================
// DISPLAY
// =============================================================================

/** Size of each tile in pixels */
export const TILE_SIZE = 64;

/** Grid dimensions in tiles */
export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;

/** Game viewport dimensions */
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

/** Camera constraints */
export const CAMERA_MIN_ZOOM = 0.5;
export const CAMERA_MAX_ZOOM = 2;
export const CAMERA_ZOOM_SPEED = 0.1;

// =============================================================================
// TILE GENERATION
// =============================================================================

/** Tile type weights for procedural generation (must sum to 100) */
export const TILE_WEIGHTS: Record<TileType, number> = {
  [TileType.Plains]: 50,
  [TileType.Forest]: 25,
  [TileType.Mountain]: 15,
  [TileType.Water]: 8,
  [TileType.Gold]: 2,
};

/** Tile colors for placeholder rendering */
export const TILE_COLORS: Record<TileType, number> = {
  [TileType.Plains]: 0x90ee90, // Light green
  [TileType.Forest]: 0x228b22, // Forest green
  [TileType.Mountain]: 0x808080, // Gray
  [TileType.Water]: 0x4169e1, // Royal blue
  [TileType.Gold]: 0xffd700, // Gold
};

// =============================================================================
// GAME TIMING
// =============================================================================

/** Milliseconds between game ticks */
export const TICK_RATE = 1000;

/** Ticks per season */
export const TICKS_PER_SEASON = 25;

/** Seasons per year */
export const SEASONS_PER_YEAR = 4;

// =============================================================================
// RESOURCES
// =============================================================================

/** Initial resources at game start */
export const INITIAL_RESOURCES: Resources = {
  [ResourceType.Food]: 150,
  [ResourceType.Wood]: 60,
  [ResourceType.Stone]: 30,
  [ResourceType.Gold]: 0,
};

// =============================================================================
// POPULATION
// =============================================================================

/** Initial population */
export const INITIAL_POPULATION = 5;

/** Base max population (without buildings) */
export const BASE_MAX_POPULATION = 10;

/** Food consumption per population per tick */
export const POPULATION_CONSUMPTION_RATE = 0.3;

/** Population growth: +1 every N ticks when food > 0 */
export const POPULATION_GROWTH_INTERVAL = 20;

/** Population death: -1 every N ticks when food debt > threshold */
export const POPULATION_DEATH_INTERVAL = 5;

/** Food debt threshold for population death */
export const FOOD_DEBT_THRESHOLD = -20;

// =============================================================================
// BUILDINGS
// =============================================================================

/** Building definitions - source of truth for all building data */
export const BUILDINGS: Record<BuildingType, BuildingDefinition> = {
  [BuildingType.TownCenter]: {
    type: BuildingType.TownCenter,
    name: 'Town Center',
    cost: {},
    production: {
      [ResourceType.Food]: 1.5,
      [ResourceType.Wood]: 1,
      [ResourceType.Stone]: 0.5,
    },
    populationBonus: 10,
    hp: 500,
    era: Era.Stone,
    validTiles: [TileType.Plains, TileType.Forest],
    limit: 1,
  },
  [BuildingType.House]: {
    type: BuildingType.House,
    name: 'House',
    cost: { [ResourceType.Wood]: 25 },
    production: {},
    populationBonus: 5,
    hp: 100,
    era: Era.Stone,
    validTiles: [TileType.Plains, TileType.Forest],
    limit: null,
  },
  [BuildingType.Farm]: {
    type: BuildingType.Farm,
    name: 'Farm',
    cost: { [ResourceType.Wood]: 15, [ResourceType.Stone]: 5 },
    production: { [ResourceType.Food]: 3 },
    populationBonus: 0,
    hp: 50,
    era: Era.Stone,
    validTiles: [TileType.Plains],
    limit: null,
  },
  [BuildingType.Sawmill]: {
    type: BuildingType.Sawmill,
    name: 'Sawmill',
    cost: { [ResourceType.Stone]: 20 },
    production: { [ResourceType.Wood]: 2 },
    populationBonus: 0,
    hp: 75,
    era: Era.Stone,
    validTiles: [TileType.Forest],
    limit: null,
  },
  [BuildingType.Mine]: {
    type: BuildingType.Mine,
    name: 'Mine',
    cost: { [ResourceType.Wood]: 30, [ResourceType.Stone]: 15 },
    production: { [ResourceType.Stone]: 2 },
    populationBonus: 0,
    hp: 100,
    era: Era.Stone,
    validTiles: [TileType.Mountain],
    limit: null,
  },
  [BuildingType.GoldMine]: {
    type: BuildingType.GoldMine,
    name: 'Gold Mine',
    cost: { [ResourceType.Wood]: 40, [ResourceType.Stone]: 30 },
    production: { [ResourceType.Gold]: 1 },
    populationBonus: 0,
    hp: 100,
    era: Era.Bronze,
    validTiles: [TileType.Gold],
    limit: null, // 1 per gold tile enforced by tile occupation
  },
  [BuildingType.Barracks]: {
    type: BuildingType.Barracks,
    name: 'Barracks',
    cost: {
      [ResourceType.Wood]: 50,
      [ResourceType.Stone]: 30,
      [ResourceType.Gold]: 10,
    },
    production: {},
    populationBonus: 0,
    hp: 200,
    era: Era.Bronze,
    validTiles: [TileType.Plains, TileType.Forest],
    limit: 3,
  },
  [BuildingType.DefenseTower]: {
    type: BuildingType.DefenseTower,
    name: 'Defense Tower',
    cost: { [ResourceType.Stone]: 40, [ResourceType.Gold]: 15 },
    production: {},
    populationBonus: 0,
    hp: 300,
    era: Era.Bronze,
    validTiles: [TileType.Plains, TileType.Forest, TileType.Mountain],
    limit: 4,
  },
};

/** Buildings available in Stone Age (MVP 1) */
export const STONE_AGE_BUILDINGS: BuildingType[] = [
  BuildingType.TownCenter,
  BuildingType.House,
  BuildingType.Farm,
  BuildingType.Sawmill,
  BuildingType.Mine,
];

// =============================================================================
// DERIVED CONSTANTS
// =============================================================================

/** Total map size in pixels */
export const MAP_WIDTH_PX = GRID_WIDTH * TILE_SIZE;
export const MAP_HEIGHT_PX = GRID_HEIGHT * TILE_SIZE;
