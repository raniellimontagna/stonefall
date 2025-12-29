/**
 * TickDisplay Component
 * Shows current tick, pause/play controls, and game speed
 */

import { GAME_SPEEDS, type GameSpeed } from '@stonefall/shared';
import { selectGameSpeed, selectIsPaused, selectTick, useGameStore } from '@/store';
import styles from './TickDisplay.module.css';

export function TickDisplay() {
  const tick = useGameStore(selectTick);
  const isPaused = useGameStore(selectIsPaused);
  const gameSpeed = useGameStore(selectGameSpeed);
  const togglePause = useGameStore((s) => s.togglePause);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);

  return (
    <div className={styles.tickDisplay}>
      <button
        type="button"
        className={styles.pauseButton}
        onClick={togglePause}
        title={isPaused ? 'Play (Space)' : 'Pause (Space)'}
      >
        {isPaused ? '▶️' : '⏸️'}
      </button>
      <div className={styles.tickInfo}>
        <span className={styles.tickLabel}>Tick</span>
        <span className={styles.tickValue}>{tick}</span>
      </div>
      <div className={styles.speedControls}>
        {GAME_SPEEDS.map((speed: GameSpeed) => (
          <button
            key={speed}
            type="button"
            className={`${styles.speedButton} ${gameSpeed === speed ? styles.active : ''}`}
            onClick={() => setGameSpeed(speed)}
            title={`Speed ${speed}x`}
          >
            {speed}x
          </button>
        ))}
      </div>
      {isPaused && <span className={styles.pausedBadge}>PAUSED</span>}
    </div>
  );
}
