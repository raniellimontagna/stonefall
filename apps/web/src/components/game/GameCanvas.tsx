import { useEffect, useRef, useState } from 'react';
import { BuildPanel, ResourceBar, TickDisplay } from '@/components/ui';
import { Game } from '@/game/Game';
import styles from './GameCanvas.module.css';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Create game instance
    gameRef.current = new Game(containerRef.current);

    // Wait for game to be ready
    const checkReady = setInterval(() => {
      if (gameRef.current?.isReady) {
        setIsLoading(false);
        clearInterval(checkReady);
      }
    }, 100);

    // Cleanup on unmount
    return () => {
      clearInterval(checkReady);
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  return (
    <div className={styles.gameWrapper}>
      {/* Loading overlay */}
      {isLoading && (
        <div className={styles.loading}>
          <h1>⛏️ Stonefall</h1>
          <p>Loading...</p>
        </div>
      )}

      {/* Top bar with resources and tick - only show when loaded */}
      {!isLoading && (
        <div className={styles.topBar}>
          <ResourceBar />
          <TickDisplay />
        </div>
      )}

      {/* Main game area - always rendered but hidden while loading */}
      <div className={styles.gameArea} style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <div id="game-container" ref={containerRef} className={styles.gameContainer} />

        {/* Right panel with build options */}
        {!isLoading && <BuildPanel />}
      </div>
    </div>
  );
}
