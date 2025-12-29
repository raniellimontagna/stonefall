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
  Faith = 'faith',
}

/** Resources object */
export type Resources = Partial<Record<ResourceType, number>>;

/** Building types (for future MVPs) */
export enum BuildingType {
  TownCenter = 'town_center',
  House = 'house',
  Farm = 'farm',
  Sawmill = 'sawmill',
  Quarry = 'quarry',
  Mine = 'mine',
  Temple = 'temple',
  Barracks = 'barracks',
  Tower = 'tower',
}

/** Era types */
export enum Era {
  StoneAge = 'stone_age',
  BronzeAge = 'bronze_age',
  IronAge = 'iron_age',
}

/** Game state (for future MVPs) */
export interface GameState {
  tick: number;
  era: Era;
  resources: Resources;
  population: number;
  maxPopulation: number;
  map: MapData;
}
