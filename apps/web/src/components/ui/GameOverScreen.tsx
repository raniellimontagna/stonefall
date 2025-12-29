/**
 * GameOverScreen Component
 * Shows game over overlay with restart option
 */

import { selectGameOver, selectTick, useGameStore } from '@/store';
import styles from './GameOverScreen.module.css';

export function GameOverScreen() {
  const gameOver = useGameStore(selectGameOver);
  const tick = useGameStore(selectTick);
  const resetGame = useGameStore((s) => s.resetGame);

  if (!gameOver) {
    return null;
  }

  const getMessage = () => {
    switch (gameOver) {
      case 'starvation':
        return 'Your civilization has perished from famine. The people could not survive without food.';
      default:
        return 'Your civilization has fallen.';
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1 className={styles.title}>💀 GAME OVER 💀</h1>
        <p className={styles.message}>{getMessage()}</p>
        <div className={styles.stats}>
          <span>
            Survived for: <strong>{tick}</strong> ticks
          </span>
        </div>
        <button type="button" className={styles.restartButton} onClick={resetGame}>
          🔄 Try Again
        </button>
      </div>
    </div>
  );
}
