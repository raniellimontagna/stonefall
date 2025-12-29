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
    for (let i = 0; i < 10; i++) {
      this.load.image(
        `placeholder-${i}`,
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      );
    }
  }

  create() {
    // Transition to the main game scene
    this.scene.start('GameScene');
  }
}
