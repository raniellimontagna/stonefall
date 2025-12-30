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

    // Render existing buildings from store (handling persistence/HMR)
    const existingBuildings = useGameStore.getState().buildings;
    for (const b of existingBuildings) {
      this.buildingManager.renderBuilding(b);
    }

    // Sync map data to store
    this.syncMapToStore();

    // Subscribe to store for building updates
    this.subscribeToStore();

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
    this.centerCamera();

    // Handle window resizing
    this.scale.on('resize', () => {
      this.centerCamera();
    });

    // Setup camera controls
    this.setupCameraControls();

    // Setup building placement
    this.setupBuildingPlacement();

    // Setup tick system
    this.setupTickSystem();

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
            store.placeBuilding(BuildingType.TownCenter, col, row);
            console.log(`Town Center placed at ${col}, ${row}`);
            return;
          }
        }
      }
    }

    console.warn('Could not place initial Town Center!');
  }

  private setupCameraControls() {
    // Enable multi-touch for pinch zoom
    this.input.addPointer(1);

    // Track previous pinch distance
    let prevPinchDistance = 0;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Start drag with ANY button if not already checking for something else?
      // Actually, standard behavior: Left/Touch is drag if we move.
      this.isDragging = false; // Reset initially

      // Store start positions
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
      this.cameraStartX = this.cameras.main.scrollX;
      this.cameraStartY = this.cameras.main.scrollY;

      // We are *potentially* dragging now.
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // 1. PINCH ZOOM handling
      if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
        // Calculate distance between two pointers
        const distance = Phaser.Math.Distance.Between(
          this.input.pointer1.x,
          this.input.pointer1.y,
          this.input.pointer2.x,
          this.input.pointer2.y
        );

        if (prevPinchDistance > 0) {
          const delta = distance - prevPinchDistance;
          // Zoom based on delta
          const currentZoom = this.cameras.main.zoom;
          // Sensitivity factor
          const zoomFactor = 0.005;
          const newZoom = Phaser.Math.Clamp(
            currentZoom + delta * zoomFactor,
            CAMERA_MIN_ZOOM,
            CAMERA_MAX_ZOOM
          );
          this.cameras.main.setZoom(newZoom);
        }
        prevPinchDistance = distance;
        return; // Skip panning if zooming
      } else {
        prevPinchDistance = 0; // Reset pinch
      }

      // 2. PANNING handling
      // Check for drag threshold to avoid accidental micro-drags being interpreted as pans
      const dist = Phaser.Math.Distance.Between(
        pointer.x,
        pointer.y,
        this.dragStartX,
        this.dragStartY
      );

      // If we are holding down and moved enough, consider it a drag
      if (pointer.isDown && (this.isDragging || dist > 10)) {
        this.isDragging = true;

        const zoom = this.cameras.main.zoom;
        const deltaX = (this.dragStartX - pointer.x) / zoom;
        const deltaY = (this.dragStartY - pointer.y) / zoom;

        this.cameras.main.scrollX = this.cameraStartX + deltaX;
        this.cameras.main.scrollY = this.cameraStartY + deltaY;
      }

      // Update placement preview
      this.updatePlacementPreview(pointer);
    });

    this.input.on('pointerup', () => {
      // Reset pinch distance
      prevPinchDistance = 0;
      // We don't reset isDragging here immediately because setupBuildingPlacement needs to check it.
      // But we can reset it after a short delay or control flow.
      // Actually, setupBuildingPlacement also listens to pointerup.
      // Since Phaser events fire in order of registration, if we register setupBuildingPlacement AFTER setupCameraControls,
      // we can check drag state there.

      // We will reset isDragging in 'pointerout' or after a frame if needed,
      // but let's just leave it for the building placement handler to check.
    });

    // Also stop dragging if pointer leaves the game
    this.input.on('pointerout', () => {
      this.isDragging = false;
      prevPinchDistance = 0;
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
    // Only trigger placement on pointer UP (release), and only if we weren't dragging
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // If we were dragging (panning), do NOT place building
      if (this.isDragging) {
        // Reset dragging state for next interaction
        this.isDragging = false;
        return;
      }

      if (pointer.button !== 0) return; // Only Left Click / Touch

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
          this.buildingManager.hidePreview();
          // Optional: Clear placement mode after placing?
          // store.setPlacementMode(null);
          // Usually better UX to keep it for multiple placements unless explicit.
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
    const store = useGameStore.getState();
    const gameSpeed = store.gameSpeed;

    this.tickTimer = this.time.addEvent({
      delay: TICK_RATE / gameSpeed,
      callback: () => {
        const currentStore = useGameStore.getState();
        currentStore.processTick();
      },
      loop: true,
    });

    // Subscribe to game speed changes
    useGameStore.subscribe(
      (state) => state.gameSpeed,
      (newSpeed) => {
        // Recreate timer with new speed
        this.tickTimer?.destroy();
        this.tickTimer = this.time.addEvent({
          delay: TICK_RATE / newSpeed,
          callback: () => {
            const currentStore = useGameStore.getState();
            currentStore.processTick();
          },
          loop: true,
        });
      }
    );
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

  private centerCamera() {
    this.cameras.main.centerOn(MAP_WIDTH_PX / 2, MAP_HEIGHT_PX / 2);
  }

  shutdown() {
    // Cleanup
    this.tickTimer?.destroy();
    this.unsubscribeStore?.();
    this.buildingManager.destroy();
  }
}
