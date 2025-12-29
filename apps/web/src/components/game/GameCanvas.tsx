import { useEffect, useRef, useState } from 'react';
import { Game } from '@/game/Game';

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
    <>
      {isLoading && (
        <div className="loading">
          <h1>⛏️ Stonefall</h1>
          <p>Loading...</p>
        </div>
      )}
      <div
        id="game-container"
        ref={containerRef}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </>
  );
}
