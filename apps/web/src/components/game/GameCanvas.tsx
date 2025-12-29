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
      {isLoading && (
        <div className={styles.loading}>
          <h1>⛏️ Stonefall</h1>
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Top bar with resources and tick */}
          <div className={styles.topBar}>
            <ResourceBar />
            <TickDisplay />
          </div>

          {/* Main game area */}
          <div className={styles.gameArea}>
            <div id="game-container" ref={containerRef} className={styles.gameContainer} />

            {/* Right panel with build options */}
            <BuildPanel />
          </div>
        </>
      )}

      {/* Hidden container while loading */}
      {isLoading && (
        <div
          id="game-container"
          ref={containerRef}
          style={{ visibility: 'hidden', position: 'absolute' }}
        />
      )}
    </div>
  );
}
