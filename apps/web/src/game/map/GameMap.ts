import { type GridPosition, TILE_SIZE, type TileData, TileType } from '@stonefall/shared';
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
   * Generate a procedural map with biomes and resources
   */
  generate(): void {
    this.tiles = [];

    // 1. Initialize with Plains
    for (let row = 0; row < this.height; row++) {
      const rowTiles: TileData[] = [];
      for (let col = 0; col < this.width; col++) {
        rowTiles.push({
          type: TileType.Plains,
          position: { col, row },
        });
      }
      this.tiles.push(rowTiles);
    }

    // 2. Generate Lakes (Clusters)
    this.generateClusters(TileType.Water, 3, 0.5, 4); // Medium lakes: 3 seeds, 50% spread, 4 iterations

    // 3. Generate Forest Clusters (Seeded)
    this.generateClusters(TileType.Forest, 8, 0.65, 4); // Balanced forests: 8 seeds, 65% spread, 4 iterations

    // 4. Generate Mountain Clusters (Seeded)
    this.generateClusters(TileType.Mountain, 4, 0.5, 2); // 4 seeds, 50% spread chance, 2 iterations

    // 5. Generate Sand (Shorelines)
    this.generateShorelines();

    // 6. Scatter Resources (Gold near Mountains)
    this.generateResources();
  }

  /**
   * Generate clusters of a specific tile type
   */
  private generateClusters(
    type: TileType,
    seeds: number,
    spreadChance: number,
    iterations: number
  ): void {
    let currentSeeds: GridPosition[] = [];

    // Place initial seeds
    for (let i = 0; i < seeds; i++) {
      const col = Math.floor(Math.random() * this.width);
      const row = Math.floor(Math.random() * this.height);
      const tile = this.tiles[row]?.[col];

      if (tile && tile.type === TileType.Plains) {
        tile.type = type;
        currentSeeds.push({ col, row });
      }
    }

    // Grow clusters
    for (let i = 0; i < iterations; i++) {
      const newSeeds: GridPosition[] = [];
      for (const seed of currentSeeds) {
        const neighbors = this.getNeighbors(seed.col, seed.row);
        for (const neighbor of neighbors) {
          const tile = this.tiles[neighbor.row]?.[neighbor.col];
          if (tile && tile.type === TileType.Plains) {
            if (Math.random() < spreadChance) {
              tile.type = type;
              newSeeds.push(neighbor);
            }
          }
        }
      }
      currentSeeds = newSeeds;
    }
  }

  /**
   * Generate transitions (Sand) around Water
   */
  private generateShorelines(): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row]?.[col];
        if (tile && tile.type === TileType.Plains) {
          const neighbors = this.getNeighbors(col, row);
          const hasWaterNeighbor = neighbors.some((n) => {
            const t = this.tiles[n.row]?.[n.col];
            return t && t.type === TileType.Water;
          });

          if (hasWaterNeighbor) {
            tile.type = TileType.Sand;
          }
        }
      }
    }
  }

  /**
   * Generate resources (Gold, etc.)
   */
  private generateResources(): void {
    // 1. Gold near Mountains
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row]?.[col];
        if (tile && tile.type === TileType.Mountain) {
          // 15% chance to spawn gold nearby
          if (Math.random() < 0.15) {
            const neighbors = this.getNeighbors(col, row);
            const validNeighbors = neighbors.filter((n) => {
              const t = this.tiles[n.row]?.[n.col];
              return t && t.type === TileType.Plains;
            });

            if (validNeighbors.length > 0) {
              const target = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
              const targetTile = target && this.tiles[target.row]?.[target.col];
              if (targetTile) {
                targetTile.type = TileType.Gold;
              }
            }
          }
        }
      }
    }

    // 2. Extra Stone (Boulders) in Plains
    const boulderCount = 5;
    for (let i = 0; i < boulderCount; i++) {
      const col = Math.floor(Math.random() * this.width);
      const row = Math.floor(Math.random() * this.height);
      const tile = this.tiles[row]?.[col];
      if (tile && tile.type === TileType.Plains) {
        tile.type = TileType.Mountain;
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
  private tileSprites: Phaser.GameObjects.Image[] = [];
  private decorationSprites: Phaser.GameObjects.Image[] = [];

  /**
   * Render the map using pixel art sprites
   */
  render(): void {
    // Clear existing sprites
    this.tileSprites.forEach((sprite) => {
      sprite.destroy();
    });
    this.tileSprites = [];

    this.decorationSprites.forEach((sprite) => {
      sprite.destroy();
    });
    this.decorationSprites = [];

    // We don't use graphics for tiles anymore, but might want it for debug overlays later
    if (this.graphics) {
      this.graphics.clear();
    } else {
      // Initialize graphics just in case other methods use it (though seemingly unused now)
      this.graphics = this.scene.add.graphics();
    }

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tile = this.tiles[row]?.[col];
        if (!tile) continue;

        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        // Map tile type to texture key
        let textureKey = `tile_${tile.type}`;

        // Variations for Plains
        if (tile.type === TileType.Plains) {
          const varRand = Math.random();
          if (varRand < 0.3) textureKey = 'tile_plains_lush';
          else if (varRand < 0.6) textureKey = 'tile_plains_dry';
        }

        // Add sprite
        const sprite = this.scene.add.image(x, y, textureKey);
        sprite.setOrigin(0.5, 0.5); // Center origin for rotation
        sprite.setPosition(x + TILE_SIZE / 2, y + TILE_SIZE / 2); // Adjust pos for center origin
        sprite.setDisplaySize(TILE_SIZE, TILE_SIZE); // Ensure 64x64 fit

        // Random rotation for Plains to add variety
        if (tile.type === TileType.Plains) {
          const angle = Math.floor(Math.random() * 4) * 90;
          sprite.setAngle(angle);
        }

        this.tileSprites.push(sprite);

        // Add Decorations on Plains
        if (tile.type === TileType.Plains) {
          const rand = Math.random();
          // 5% Rock
          if (rand < 0.05) {
            const rock = this.scene.add.image(
              x + 32 + (Math.random() * 20 - 10),
              y + 32 + (Math.random() * 20 - 10),
              'deco_rock'
            );
            rock.setOrigin(0.5, 0.5);
            // Proportional scale
            const scale = 24 / Math.max(rock.width, rock.height);
            rock.setScale(scale);
            this.decorationSprites.push(rock);
          }
          // 8% Bush
          else if (rand < 0.13) {
            const bush = this.scene.add.image(
              x + 32 + (Math.random() * 20 - 10),
              y + 32 + (Math.random() * 20 - 10),
              'deco_bush'
            );
            bush.setOrigin(0.5, 0.5);
            const scale = 32 / Math.max(bush.width, bush.height);
            bush.setScale(scale);
            this.decorationSprites.push(bush);
          }
          // 5% Flowers
          else if (rand < 0.18) {
            const flowers = this.scene.add.image(
              x + 32 + (Math.random() * 20 - 10),
              y + 32 + (Math.random() * 20 - 10),
              'deco_flowers'
            );
            flowers.setOrigin(0.5, 0.5);
            const scale = 28 / Math.max(flowers.width, flowers.height);
            flowers.setScale(scale);
            this.decorationSprites.push(flowers);
          }
        }
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.tileSprites.forEach((sprite) => {
      sprite.destroy();
    });
    this.tileSprites = [];
    this.decorationSprites.forEach((sprite) => {
      sprite.destroy();
    });
    this.decorationSprites = [];
    if (this.graphics) {
      this.graphics.destroy();
      this.graphics = null;
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
