import {
  CAMERA_MAX_ZOOM,
  CAMERA_MIN_ZOOM,
  CAMERA_ZOOM_SPEED,
  GRID_HEIGHT,
  GRID_WIDTH,
  MAP_HEIGHT_PX,
  MAP_WIDTH_PX,
  TILE_SIZE,
} from '@stonefall/shared';
import Phaser from 'phaser';
import { GameMap } from '../map/GameMap';

/**
 * Main Game Scene
 * Handles the core gameplay, map rendering, and camera controls
 */
export class GameScene extends Phaser.Scene {
  private gameMap!: GameMap;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private cameraStartX = 0;
  private cameraStartY = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create the game map
    this.gameMap = new GameMap(this, GRID_WIDTH, GRID_HEIGHT);
    this.gameMap.generate();
    this.gameMap.render();

    // Setup camera bounds
    this.cameras.main.setBounds(
      -TILE_SIZE,
      -TILE_SIZE,
      MAP_WIDTH_PX + TILE_SIZE * 2,
      MAP_HEIGHT_PX + TILE_SIZE * 2
    );

    // Center camera on map
    this.cameras.main.centerOn(MAP_WIDTH_PX / 2, MAP_HEIGHT_PX / 2);

    // Setup camera controls
    this.setupCameraControls();

    // Debug: log map creation
    console.log(`Map created: ${GRID_WIDTH}x${GRID_HEIGHT} tiles`);
  }

  private setupCameraControls() {
    // Mouse drag for panning
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
        this.cameraStartX = this.cameras.main.scrollX;
        this.cameraStartY = this.cameras.main.scrollY;
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const zoom = this.cameras.main.zoom;
        const deltaX = (this.dragStartX - pointer.x) / zoom;
        const deltaY = (this.dragStartY - pointer.y) / zoom;

        this.cameras.main.scrollX = this.cameraStartX + deltaX;
        this.cameras.main.scrollY = this.cameraStartY + deltaY;
      }
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });

    // Mouse wheel for zooming
    this.input.on(
      'wheel',
      (
        _pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number
      ) => {
        const currentZoom = this.cameras.main.zoom;
        const zoomDelta = deltaY > 0 ? -CAMERA_ZOOM_SPEED : CAMERA_ZOOM_SPEED;
        const newZoom = Phaser.Math.Clamp(
          currentZoom + zoomDelta,
          CAMERA_MIN_ZOOM,
          CAMERA_MAX_ZOOM
        );

        this.cameras.main.setZoom(newZoom);
      }
    );
  }
}
