/**
 * Game Types
 * Core type definitions for the game
 */

/** Tile types available in the game */
export enum TileType {
  Plains = 'plains',
  Forest = 'forest',
  Mountain = 'mountain',
  Water = 'water',
  Gold = 'gold',
}

/** 2D position */
export interface Position {
  x: number;
  y: number;
}

/** Grid coordinates (tile-based) */
export interface GridPosition {
  col: number;
  row: number;
}

/** Data for a single tile */
export interface TileData {
  type: TileType;
  position: GridPosition;
}

/** Map data structure */
export interface MapData {
  width: number;
  height: number;
  tiles: TileData[][];
}

/** Resource types */
export enum ResourceType {
  Food = 'food',
  Wood = 'wood',
  Stone = 'stone',
  Gold = 'gold',
}

/** Resources object - all resources are required with number values */
export type Resources = Record<ResourceType, number>;

/** Building types */
export enum BuildingType {
  TownCenter = 'town_center',
  House = 'house',
  Farm = 'farm',
  Sawmill = 'sawmill',
  Mine = 'mine',
  GoldMine = 'gold_mine',
  Barracks = 'barracks',
  DefenseTower = 'defense_tower',
}

/** Era types */
export enum Era {
  Stone = 'stone',
  Bronze = 'bronze',
  Iron = 'iron',
}

/** Building instance placed on the map */
export interface Building {
  id: string;
  type: BuildingType;
  position: GridPosition;
  hp: number;
  maxHp: number;
}

/** Building definition from constants */
export interface BuildingDefinition {
  type: BuildingType;
  name: string;
  cost: Partial<Resources>;
  production: Partial<Resources>;
  populationBonus: number;
  hp: number;
  era: Era;
  validTiles: TileType[];
  limit: number | null; // null = unlimited
}

/** Production rates per tick */
export interface ProductionRates {
  food: number;
  wood: number;
  stone: number;
  gold: number;
}

/** Population state */
export interface PopulationState {
  current: number;
  max: number;
  consumptionPerTick: number;
}

/** Game state */
export interface GameState {
  // Core
  tick: number;
  era: Era;
  isPaused: boolean;

  // Resources
  resources: Resources;
  production: ProductionRates;

  // Population
  population: PopulationState;

  // Buildings
  buildings: Building[];

  // Map
  map: MapData;

  // Building placement mode
  placementMode: BuildingType | null;
}
