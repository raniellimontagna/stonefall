import Phaser from 'phaser';

/**
 * Boot Scene
 * First scene to load - handles initial setup and asset loading
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // For MVP 0, we're using colored rectangles instead of sprites
    // This is where we would load assets in future MVPs

    // Show loading progress
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    // Simulate loading for smooth transition
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffd700, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Trigger a fake load to show progress bar
    // In future MVPs, real assets will be loaded here
    // Load Tile Assets
    // this.load.image('tile_plains', 'assets/tiles/plains.png'); // Now procedural
    this.load.image('tile_forest', 'assets/tiles/forest.png');
    this.load.image('tile_mountain', 'assets/tiles/mountain.png');
    this.load.image('tile_water', 'assets/tiles/water.png');
    this.load.image('tile_gold', 'assets/tiles/gold.png');

    // Load Building Assets
    this.load.image('building_town_center', 'assets/icons/buildings/town_center.png');
    this.load.image('building_house', 'assets/icons/buildings/house.png');
    this.load.image('building_farm', 'assets/icons/buildings/farm.png');
    this.load.image('building_sawmill', 'assets/icons/buildings/sawmill.png');
    this.load.image('building_mine', 'assets/icons/buildings/mine.png');
    this.load.image('building_gold_mine', 'assets/icons/buildings/gold_mine.png');
    this.load.image('building_barracks', 'assets/icons/buildings/barracks.png');
    this.load.image('building_defense_tower', 'assets/icons/buildings/defense_tower.png');

    // Load Decorations
    this.load.image('deco_rock', 'assets/decorations/rock_small.png');
    this.load.image('deco_bush', 'assets/decorations/bush.png');
    this.load.image('deco_flowers', 'assets/decorations/flowers.png');

    // Trigger a fake load to show progress bar (can remove loop if assets are enough, but keeping for smooth UI)
    for (let i = 0; i < 5; i++) {
      // Just delay slightly to show loading bar
    }
  }

  create() {
    this.generateProceduralTextures();
    // Transition to the main game scene
    this.scene.start('GameScene');
  }

  private generateProceduralTextures() {
    // Sand Texture
    if (!this.textures.exists('tile_sand')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xe6c288); // Sand color
      graphics.fillRect(0, 0, 64, 64);
      // Add noise
      graphics.fillStyle(0xdbb076);
      for (let i = 0; i < 50; i++) {
        graphics.fillRect(Math.random() * 64, Math.random() * 64, 2, 2);
      }
      graphics.generateTexture('tile_sand', 64, 64);
      graphics.destroy();
    }

    // Grass Textures (Procedural Variations)
    // Using a cohesive color palette for natural grass
    if (!this.textures.exists('tile_plains')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });

      // Helper function to draw grass blades
      const drawGrassBlades = (
        gfx: Phaser.GameObjects.Graphics,
        bgColor: number,
        bladeColor1: number,
        bladeColor2: number,
        density: number = 1
      ) => {
        // Fill background
        gfx.fillStyle(bgColor);
        gfx.fillRect(0, 0, 64, 64);

        // Add subtle gradient variation (patches of slightly different shades)
        for (let i = 0; i < 6; i++) {
          const patchX = Math.random() * 48;
          const patchY = Math.random() * 48;
          const patchSize = 12 + Math.random() * 16;
          gfx.fillStyle(bladeColor1, 0.3);
          gfx.fillCircle(patchX + patchSize / 2, patchY + patchSize / 2, patchSize / 2);
        }

        // Draw grass blades (vertical strokes of varying heights)
        const bladeCount = Math.floor(80 * density);
        for (let i = 0; i < bladeCount; i++) {
          const x = Math.random() * 64;
          const y = Math.random() * 64;
          const height = 3 + Math.random() * 5;
          const width = 1;

          // Alternate between blade colors for natural look
          gfx.fillStyle(Math.random() > 0.5 ? bladeColor1 : bladeColor2, 0.6 + Math.random() * 0.4);
          gfx.fillRect(x, y, width, height);
        }

        // Add small dots for texture (seeds, small plants)
        for (let i = 0; i < 15; i++) {
          gfx.fillStyle(bladeColor2, 0.4);
          gfx.fillCircle(Math.random() * 64, Math.random() * 64, 1);
        }
      };

      // Variation 1: Standard Green (most common)
      drawGrassBlades(graphics, 0x5a8f4a, 0x4a7a3a, 0x6aa05a, 1);
      graphics.generateTexture('tile_plains', 64, 64);

      // Variation 2: Slightly Lusher (a bit more saturated, subtle difference)
      graphics.clear();
      drawGrassBlades(graphics, 0x5a9448, 0x4a8038, 0x6aa858, 1.1);
      graphics.generateTexture('tile_plains_lush', 64, 64);

      // Variation 3: Slightly Drier (a tiny bit yellower, very subtle)
      graphics.clear();
      drawGrassBlades(graphics, 0x5f8f4a, 0x527a3a, 0x709858, 0.9);
      graphics.generateTexture('tile_plains_dry', 64, 64);

      graphics.destroy();
    }
  }
}
