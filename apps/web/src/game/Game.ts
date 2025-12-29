import { GAME_HEIGHT, GAME_WIDTH } from '@stonefall/shared';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

/**
 * Main Game class
 * Initializes Phaser and manages the game lifecycle
 */
export class Game {
  private game: Phaser.Game;
  public isReady = false;

  constructor(container: HTMLElement) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: container,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#1a1a2e',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      input: {
        mouse: {
          target: container,
        },
      },
      disableContextMenu: true,
      scene: [BootScene, GameScene],
      callbacks: {
        postBoot: () => {
          this.isReady = true;
          // Additional context menu prevention on canvas
          const canvas = this.game.canvas;
          if (canvas) {
            canvas.addEventListener('contextmenu', (e) => e.preventDefault());
          }
        },
      },
    };

    this.game = new Phaser.Game(config);
  }

  destroy() {
    this.game.destroy(true);
  }
}
