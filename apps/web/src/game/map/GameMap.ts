import {
  type GridPosition,
  TILE_COLORS,
  TILE_SIZE,
  TILE_WEIGHTS,
  type TileData,
  TileType,
} from '@stonefall/shared';
import type Phaser from 'phaser';

/**
 * GameMap
 * Handles map generation and rendering
 */
export class GameMap {
  private scene: Phaser.Scene;
  private width: number;
  private height: number;
  private tiles: TileData[][] = [];
  private graphics: Phaser.GameObjects.Graphics | null = null;

  constructor(scene: Phaser.Scene, width: number, height: number) {
    this.scene = scene;
    this.width = width;
    this.height = height;
  }

  /**
   * Generate a random map using weighted tile distribution
   */
  generate(): void {
    this.tiles = [];

    for (let row = 0; row < this.height; row++) {
      const rowTiles: TileData[] = [];

      for (let col = 0; col < this.width; col++) {
        const tileType = this.getRandomTileType();
        rowTiles.push({
          type: tileType,
          position: { col, row },
        });
      }

      this.tiles.push(rowTiles);
    }

    // Ensure water tiles are somewhat clustered (simple grouping)
    this.clusterWaterTiles();
  }

  /**
   * Get a random tile type based on weights
   */
  private getRandomTileType(): TileType {
    const random = Math.random() * 100;
    let cumulative = 0;

    const tileTypes = Object.values(TileType);

    for (const type of tileTypes) {
      cumulative += TILE_WEIGHTS[type];
      if (random < cumulative) {
        return type;
      }
    }

    return TileType.Plains;
  }

  /**
   * Simple algorithm to make water tiles cluster together
   */
  private clusterWaterTiles(): void {
    // Find all water tiles and potentially spread them
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row]?.[col];
        if (!tile || tile.type !== TileType.Water) continue;

        // 50% chance to spread to adjacent tiles
        const neighbors = this.getNeighbors(col, row);
        for (const neighbor of neighbors) {
          const neighborTile = this.tiles[neighbor.row]?.[neighbor.col];
          if (neighborTile && neighborTile.type === TileType.Plains && Math.random() < 0.3) {
            neighborTile.type = TileType.Water;
          }
        }
      }
    }
  }

  /**
   * Get neighboring tile positions
   */
  private getNeighbors(col: number, row: number): GridPosition[] {
    const neighbors: GridPosition[] = [];

    if (col > 0) neighbors.push({ col: col - 1, row });
    if (col < this.width - 1) neighbors.push({ col: col + 1, row });
    if (row > 0) neighbors.push({ col, row: row - 1 });
    if (row < this.height - 1) neighbors.push({ col, row: row + 1 });

    return neighbors;
  }

  /**
   * Render the map using colored rectangles
   */
  render(): void {
    if (this.graphics) {
      this.graphics.destroy();
    }

    this.graphics = this.scene.add.graphics();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row]?.[col];
        if (!tile) continue;

        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;
        const color = TILE_COLORS[tile.type];

        // Fill the tile
        this.graphics.fillStyle(color, 1);
        this.graphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        // Draw border for visibility
        this.graphics.lineStyle(1, 0x000000, 0.2);
        this.graphics.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  /**
   * Get tile at grid position
   */
  getTile(col: number, row: number): TileData | null {
    return this.tiles[row]?.[col] ?? null;
  }

  /**
   * Get tile at world position
   */
  getTileAtWorld(worldX: number, worldY: number): TileData | null {
    const col = Math.floor(worldX / TILE_SIZE);
    const row = Math.floor(worldY / TILE_SIZE);
    return this.getTile(col, row);
  }

  /**
   * Get all tiles as a flat array
   */
  getAllTiles(): TileData[] {
    return this.tiles.flat();
  }

  /**
   * Get map dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}
