/**
 * BuildingManager
 * Handles building placement validation and rendering in Phaser
 */

import type {
  Building,
  BuildingDefinition,
  BuildingType,
  GridPosition,
  MapData,
  ProductionRates,
  Resources,
} from '@stonefall/shared';
import {
  BASE_MAX_POPULATION,
  BUILDINGS,
  Era,
  ResourceType,
  TILE_SIZE,
  TileType,
} from '@stonefall/shared';
import type Phaser from 'phaser';

/** Building colors for placeholder rendering */
const BUILDING_COLORS: Record<string, number> = {
  town_center: 0x8b4513, // SaddleBrown
  house: 0xdeb887, // BurlyWood
  farm: 0xf4a460, // SandyBrown
  sawmill: 0x654321, // DarkBrown
  mine: 0x2f4f4f, // DarkSlateGray
  gold_mine: 0xffd700, // Gold
  barracks: 0x8b0000, // DarkRed
  defense_tower: 0x696969, // DimGray
};

export interface PlacementValidation {
  valid: boolean;
  reason?: string;
}

/**
 * BuildingManager class for Phaser scene integration
 */
export class BuildingManager {
  private scene: Phaser.Scene;
  private buildingsContainer: Phaser.GameObjects.Container | null = null;
  private previewGraphics: Phaser.GameObjects.Graphics | null = null;
  private buildings: Map<string, Phaser.GameObjects.Rectangle> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Initialize the building manager
   */
  initialize(): void {
    this.buildingsContainer = this.scene.add.container(0, 0);
    this.previewGraphics = this.scene.add.graphics();
    this.previewGraphics.setDepth(100); // Above buildings
  }

  /**
   * Render a building on the map
   */
  renderBuilding(building: Building): void {
    if (!this.buildingsContainer) return;

    const { col, row } = building.position;
    const x = col * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const color = BUILDING_COLORS[building.type] ?? 0x888888;

    // Create building rectangle
    const rect = this.scene.add.rectangle(x, y, TILE_SIZE - 4, TILE_SIZE - 4, color);
    rect.setStrokeStyle(2, 0x000000);
    rect.setData('buildingId', building.id);

    this.buildingsContainer.add(rect);
    this.buildings.set(building.id, rect);

    // Add building type initial as text
    const def = BUILDINGS[building.type];
    const initial = def.name.charAt(0).toUpperCase();
    const text = this.scene.add.text(x, y, initial, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.buildingsContainer.add(text);
  }

  /**
   * Remove a building from the display
   */
  removeBuilding(id: string): void {
    const rect = this.buildings.get(id);
    if (rect) {
      rect.destroy();
      this.buildings.delete(id);
    }
  }

  /**
   * Show placement preview at grid position
   */
  showPlacementPreview(
    _buildingType: BuildingType,
    col: number,
    row: number,
    isValid: boolean
  ): void {
    if (!this.previewGraphics) return;

    this.previewGraphics.clear();

    const x = col * TILE_SIZE;
    const y = row * TILE_SIZE;
    const color = isValid ? 0x00ff00 : 0xff0000;
    const alpha = 0.5;

    this.previewGraphics.fillStyle(color, alpha);
    this.previewGraphics.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    this.previewGraphics.lineStyle(2, color, 1);
    this.previewGraphics.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  }

  /**
   * Hide placement preview
   */
  hidePreview(): void {
    this.previewGraphics?.clear();
  }

  /**
   * Clear all buildings from display
   */
  clear(): void {
    for (const rect of this.buildings.values()) {
      rect.destroy();
    }
    this.buildings.clear();
    this.buildingsContainer?.removeAll(true);
    this.previewGraphics?.clear();
  }

  /**
   * Destroy the manager
   */
  destroy(): void {
    this.clear();
    this.buildingsContainer?.destroy();
    this.previewGraphics?.destroy();
  }
}

// =============================================================================
// STATIC UTILITY FUNCTIONS
// =============================================================================

/**
 * Validate if a building can be placed at a position
 */
export function validateBuildingPlacement(
  buildingType: BuildingType,
  col: number,
  row: number,
  map: MapData,
  buildings: Building[],
  resources: Resources,
  era: Era
): PlacementValidation {
  const def = BUILDINGS[buildingType];

  // Check bounds
  if (col < 0 || col >= map.width || row < 0 || row >= map.height) {
    return { valid: false, reason: 'Out of bounds' };
  }

  // Get tile
  const tile = map.tiles[row]?.[col];
  if (!tile) {
    return { valid: false, reason: 'Invalid tile' };
  }

  // Check tile type
  if (!def.validTiles.includes(tile.type)) {
    return { valid: false, reason: `Cannot build on ${tile.type}` };
  }

  // Check water
  if (tile.type === TileType.Water) {
    return { valid: false, reason: 'Cannot build on water' };
  }

  // Check if occupied
  const existingBuilding = buildings.find((b) => b.position.col === col && b.position.row === row);
  if (existingBuilding) {
    return { valid: false, reason: 'Tile occupied' };
  }

  // Check building limit
  if (def.limit !== null) {
    const count = buildings.filter((b) => b.type === buildingType).length;
    if (count >= def.limit) {
      return { valid: false, reason: `Limit of ${def.limit} reached` };
    }
  }

  // Check cost
  for (const [resource, cost] of Object.entries(def.cost)) {
    const resourceType = resource as ResourceType;
    if (cost !== undefined && resources[resourceType] < cost) {
      return { valid: false, reason: `Not enough ${resource}` };
    }
  }

  // Check era
  if (def.era === Era.Bronze && era === Era.Stone) {
    return { valid: false, reason: 'Requires Bronze Age' };
  }
  if (def.era === Era.Iron && era !== Era.Iron) {
    return { valid: false, reason: 'Requires Iron Age' };
  }

  return { valid: true };
}

/**
 * Calculate total production from buildings
 */
export function calculateBuildingProduction(buildings: Building[]): ProductionRates {
  const production: ProductionRates = { food: 0, wood: 0, stone: 0, gold: 0 };

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
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

  return production;
}

/**
 * Calculate max population from buildings
 */
export function calculateMaxPopulation(buildings: Building[]): number {
  let maxPop = BASE_MAX_POPULATION;

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
    maxPop += def.populationBonus;
  }

  return maxPop;
}

/**
 * Get building definition
 */
export function getBuildingDefinition(type: BuildingType): BuildingDefinition {
  return BUILDINGS[type];
}

/**
 * Generate a unique building ID
 */
export function generateBuildingId(): string {
  return `building_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new building instance
 */
export function createBuilding(type: BuildingType, position: GridPosition): Building {
  const def = BUILDINGS[type];
  return {
    id: generateBuildingId(),
    type,
    position,
    hp: def.hp,
    maxHp: def.hp,
  };
}
