import { useEffect } from 'react';
import { useGameStore } from '@/store';

/**
 * Keyboard shortcuts for game controls
 * - Space: Toggle pause
 * - 1, 2, 3: Set game speed (1x, 2x, 4x)
 * - B: Toggle build panel
 * - C: Open chronicle
 * - Escape: Cancel placement / close modals
 */
export function useKeyboardShortcuts() {
  const togglePause = useGameStore((s) => s.togglePause);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);
  const setPlacementMode = useGameStore((s) => s.setPlacementMode);
  const placementMode = useGameStore((s) => s.placementMode);
  const openChronicle = useGameStore((s) => s.openChronicle);
  const closeChronicle = useGameStore((s) => s.closeChronicle);
  const chronicleModal = useGameStore((s) => s.chronicleModal);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case '1':
          setGameSpeed(1);
          break;
        case '2':
          setGameSpeed(2);
          break;
        case '3':
          setGameSpeed(4);
          break;
        case 'c':
          if (chronicleModal) {
            closeChronicle();
          } else {
            openChronicle();
          }
          break;
        case 'escape':
          if (chronicleModal) {
            closeChronicle();
          } else if (placementMode) {
            setPlacementMode(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePause,
    setGameSpeed,
    setPlacementMode,
    placementMode,
    openChronicle,
    closeChronicle,
    chronicleModal,
  ]);
}
