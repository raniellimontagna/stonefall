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

  const isVictory = gameOver === 'victory';

  const getMessage = () => {
    switch (gameOver) {
      case 'starvation':
        return 'Sua civilização pereceu de fome. O povo não conseguiu sobreviver sem comida.';
      case 'defeat':
        return 'Sua civilização foi derrotada pelo rival. Suas defesas não foram suficientes.';
      case 'victory':
        return 'Você derrotou a civilização rival e dominou a região! Glória eterna!';
      default:
        return 'A jornada da sua civilização chegou ao fim.';
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${isVictory ? styles.victory : ''}`}>
        <h1 className={styles.title}>{isVictory ? '🏆 VITÓRIA! 🏆' : '💀 GAME OVER 💀'}</h1>
        <p className={styles.message}>{getMessage()}</p>
        <div className={styles.stats}>
          <span>
            {isVictory ? 'Tempo de vitória' : 'Sobreviveu por'}: <strong>{tick}</strong> ticks
          </span>
        </div>
        <button type="button" className={styles.restartButton} onClick={resetGame}>
          🔄 {isVictory ? 'Jogar Novamente' : 'Tentar de Novo'}
        </button>
      </div>
    </div>
  );
}
