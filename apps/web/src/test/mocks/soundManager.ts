/**
 * Sound Manager Mock
 * Mock for SoundManager (Howler) in tests
 */

import { vi } from 'vitest';

export const mockSoundManager = {
  play: vi.fn(),
  stop: vi.fn(),
  stopAll: vi.fn(),
  setVolume: vi.fn(),
  setMuted: vi.fn(),
  isMuted: vi.fn().mockReturnValue(false),
};

vi.mock('@/game/SoundManager', () => ({
  soundManager: mockSoundManager,
}));
