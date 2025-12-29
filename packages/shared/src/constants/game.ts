/**
 * Game Constants
 * All magic numbers centralized here for easy balancing
 */

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
export const TILE_WEIGHTS = {
  plains: 50,
  forest: 25,
  mountain: 15,
  water: 8,
  gold: 2,
} as const;

/** Tile colors for placeholder rendering */
export const TILE_COLORS = {
  plains: 0x90ee90, // Light green
  forest: 0x228b22, // Forest green
  mountain: 0x808080, // Gray
  water: 0x4169e1, // Royal blue
  gold: 0xffd700, // Gold
} as const;

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
// RESOURCES (Initial values)
// =============================================================================

export const INITIAL_RESOURCES = {
  food: 150,
  wood: 50,
  stone: 20,
  gold: 0,
  faith: 0,
} as const;

// =============================================================================
// DERIVED CONSTANTS
// =============================================================================

/** Total map size in pixels */
export const MAP_WIDTH_PX = GRID_WIDTH * TILE_SIZE;
export const MAP_HEIGHT_PX = GRID_HEIGHT * TILE_SIZE;
