import type { Building, MapData } from '@stonefall/shared';
import {
  BUILDINGS,
  BuildingType,
  CAMERA_MAX_ZOOM,
  CAMERA_MIN_ZOOM,
  CAMERA_ZOOM_SPEED,
  GRID_HEIGHT,
  GRID_WIDTH,
  MAP_HEIGHT_PX,
  MAP_WIDTH_PX,
  TICK_RATE,
  TILE_SIZE,
} from '@stonefall/shared';
import Phaser from 'phaser';
import { useGameStore } from '../../store';
import { BuildingManager, validateBuildingPlacement } from '../managers';
import { GameMap } from '../map/GameMap';

/**
 * Main Game Scene
 * Handles the core gameplay, map rendering, and camera controls
 */
export class GameScene extends Phaser.Scene {
  private gameMap!: GameMap;
  private buildingManager!: BuildingManager;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private cameraStartX = 0;
  private cameraStartY = 0;
  private tickTimer: Phaser.Time.TimerEvent | null = null;
  private unsubscribeStore: (() => void) | null = null;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create the game map
    this.gameMap = new GameMap(this, GRID_WIDTH, GRID_HEIGHT);
    this.gameMap.generate();
    this.gameMap.render();

    // Initialize building manager
    this.buildingManager = new BuildingManager(this);
    this.buildingManager.initialize();

    // Sync map data to store
    this.syncMapToStore();

    // Place initial Town Center
    this.placeInitialTownCenter();

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

    // Setup building placement
    this.setupBuildingPlacement();

    // Setup tick system
    this.setupTickSystem();

    // Subscribe to store for building updates
    this.subscribeToStore();

    // Debug: log map creation
    console.log(`Map created: ${GRID_WIDTH}x${GRID_HEIGHT} tiles`);
  }

  private syncMapToStore() {
    const store = useGameStore.getState();
    const mapData: MapData = {
      width: GRID_WIDTH,
      height: GRID_HEIGHT,
      tiles: [],
    };

    // Convert GameMap tiles to store format
    for (let row = 0; row < GRID_HEIGHT; row++) {
      const rowTiles = [];
      for (let col = 0; col < GRID_WIDTH; col++) {
        const tile = this.gameMap.getTile(col, row);
        if (tile) {
          rowTiles.push(tile);
        }
      }
      mapData.tiles.push(rowTiles);
    }

    store.setMap(mapData);
  }

  private placeInitialTownCenter() {
    const store = useGameStore.getState();

    // Find a suitable tile near center for Town Center
    const centerCol = Math.floor(GRID_WIDTH / 2);
    const centerRow = Math.floor(GRID_HEIGHT / 2);

    // Search for valid placement near center
    const searchRadius = 3;
    for (let r = 0; r <= searchRadius; r++) {
      for (let dc = -r; dc <= r; dc++) {
        for (let dr = -r; dr <= r; dr++) {
          const col = centerCol + dc;
          const row = centerRow + dr;

          const tile = this.gameMap.getTile(col, row);
          if (tile && BUILDINGS[BuildingType.TownCenter].validTiles.includes(tile.type)) {
            // Place Town Center here
            const success = store.placeBuilding(BuildingType.TownCenter, col, row);
            if (success) {
              // Render the building
              const building = store.getBuildingAt(col, row);
              if (building) {
                this.buildingManager.renderBuilding(building);
              }
              console.log(`Town Center placed at ${col}, ${row}`);
              return;
            }
          }
        }
      }
    }

    console.warn('Could not place initial Town Center!');
  }

  private setupCameraControls() {
    // Mouse drag for panning with right button (button 2) or middle button (button 1)
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Button 2 is right click, button 1 is middle click
      if (pointer.button === 2 || pointer.button === 1) {
        this.isDragging = true;
        this.dragStartX = pointer.x;
        this.dragStartY = pointer.y;
        this.cameraStartX = this.cameras.main.scrollX;
        this.cameraStartY = this.cameras.main.scrollY;
        console.log('Camera drag started, button:', pointer.button);
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging && pointer.isDown) {
        const zoom = this.cameras.main.zoom;
        const deltaX = (this.dragStartX - pointer.x) / zoom;
        const deltaY = (this.dragStartY - pointer.y) / zoom;

        this.cameras.main.scrollX = this.cameraStartX + deltaX;
        this.cameras.main.scrollY = this.cameraStartY + deltaY;
      }

      // Update placement preview
      this.updatePlacementPreview(pointer);
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // Stop dragging when right or middle button is released
      if (pointer.button === 2 || pointer.button === 1) {
        this.isDragging = false;
        console.log('Camera drag stopped');
      }
    });

    // Also stop dragging if pointer leaves the game
    this.input.on('pointerout', () => {
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

    // Keyboard shortcuts
    this.input.keyboard?.on('keydown-SPACE', () => {
      useGameStore.getState().togglePause();
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      useGameStore.getState().setPlacementMode(null);
      this.buildingManager.hidePreview();
    });
  }

  private setupBuildingPlacement() {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.leftButtonDown()) return;

      const store = useGameStore.getState();
      const placementMode = store.placementMode;

      if (!placementMode) return;

      // Get grid position from world coordinates
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const col = Math.floor(worldPoint.x / TILE_SIZE);
      const row = Math.floor(worldPoint.y / TILE_SIZE);

      // Validate and place building
      const validation = validateBuildingPlacement(
        placementMode,
        col,
        row,
        store.map,
        store.buildings,
        store.resources,
        store.era
      );

      if (validation.valid) {
        const success = store.placeBuilding(placementMode, col, row);
        if (success) {
          const building = store.getBuildingAt(col, row);
          if (building) {
            this.buildingManager.renderBuilding(building);
          }
          this.buildingManager.hidePreview();
        }
      } else {
        console.log(`Cannot place building: ${validation.reason}`);
      }
    });
  }

  private updatePlacementPreview(pointer: Phaser.Input.Pointer) {
    const store = useGameStore.getState();
    const placementMode = store.placementMode;

    if (!placementMode) {
      this.buildingManager.hidePreview();
      return;
    }

    // Get grid position from world coordinates
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const col = Math.floor(worldPoint.x / TILE_SIZE);
    const row = Math.floor(worldPoint.y / TILE_SIZE);

    // Check if within bounds
    if (col < 0 || col >= GRID_WIDTH || row < 0 || row >= GRID_HEIGHT) {
      this.buildingManager.hidePreview();
      return;
    }

    // Validate placement
    const validation = validateBuildingPlacement(
      placementMode,
      col,
      row,
      store.map,
      store.buildings,
      store.resources,
      store.era
    );

    this.buildingManager.showPlacementPreview(placementMode, col, row, validation.valid);
  }

  private setupTickSystem() {
    this.tickTimer = this.time.addEvent({
      delay: TICK_RATE,
      callback: () => {
        const store = useGameStore.getState();
        store.processTick();
      },
      loop: true,
    });
  }

  private subscribeToStore() {
    // Subscribe to building changes to sync render
    this.unsubscribeStore = useGameStore.subscribe(
      (state) => state.buildings,
      (buildings, prevBuildings) => {
        // Find new buildings and render them
        for (const building of buildings) {
          const existed = prevBuildings.find((b: Building) => b.id === building.id);
          if (!existed) {
            this.buildingManager.renderBuilding(building);
          }
        }

        // Find removed buildings and remove them
        for (const prevBuilding of prevBuildings) {
          const exists = buildings.find((b: Building) => b.id === prevBuilding.id);
          if (!exists) {
            this.buildingManager.removeBuilding(prevBuilding.id);
          }
        }
      }
    );
  }

  shutdown() {
    // Cleanup
    this.tickTimer?.destroy();
    this.unsubscribeStore?.();
    this.buildingManager.destroy();
  }
}
