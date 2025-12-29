/**
 * TickDisplay Component
 * Shows current tick and pause/play controls
 */

import { selectIsPaused, selectTick, useGameStore } from '@/store';
import styles from './TickDisplay.module.css';

export function TickDisplay() {
  const tick = useGameStore(selectTick);
  const isPaused = useGameStore(selectIsPaused);
  const togglePause = useGameStore((s) => s.togglePause);

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
      {isPaused && <span className={styles.pausedBadge}>PAUSED</span>}
    </div>
  );
}
