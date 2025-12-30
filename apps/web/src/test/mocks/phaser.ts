/**
 * Phaser Mock
 * Mock for Phaser game engine in tests
 */

import { vi } from 'vitest';

export const mockPhaser = {
  Game: vi.fn().mockImplementation(() => ({
    scene: {
      add: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      remove: vi.fn(),
    },
    destroy: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
  })),
  Scene: vi.fn().mockImplementation(() => ({
    add: {
      sprite: vi.fn(),
      text: vi.fn(),
      image: vi.fn(),
      graphics: vi.fn(),
    },
    input: {
      on: vi.fn(),
    },
    cameras: {
      main: {
        setZoom: vi.fn(),
        centerOn: vi.fn(),
      },
    },
    load: {
      image: vi.fn(),
      spritesheet: vi.fn(),
    },
    time: {
      addEvent: vi.fn(),
    },
  })),
  GameObjects: {
    Sprite: vi.fn(),
    Text: vi.fn(),
    Image: vi.fn(),
    Graphics: vi.fn(),
  },
  AUTO: 'AUTO',
  Scale: {
    FIT: 'FIT',
    CENTER_BOTH: 'CENTER_BOTH',
  },
};

vi.mock('phaser', () => mockPhaser);
