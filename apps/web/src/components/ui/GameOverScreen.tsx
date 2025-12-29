import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { selectGameOver, selectTick, useGameStore } from '@/store';

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
        return 'Your civilization perished from famine. The people could not survive without food.';
      case 'defeat':
        return 'Your civilization was defeated by the rival. Your defenses were insufficient.';
      case 'victory':
        return 'You defeated the rival civilization and dominated the region! Eternal glory!';
      default:
        return 'The journey of your civilization has ended.';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          <Card
            variant={isVictory ? 'wood' : 'stone'}
            className={`w-full max-w-lg text-center p-8 border-4 ${isVictory ? 'border-gold-main shadow-gold-main/20' : 'border-red-900 shadow-red-900/20'}`}
          >
            <div className="text-6xl mb-4">{isVictory ? '🏆' : '💀'}</div>

            <h1
              className={`text-4xl font-bold mb-4 uppercase ${isVictory ? 'text-gold-main' : 'text-stone-500'}`}
            >
              {isVictory ? 'Victory!' : 'Game Over'}
            </h1>

            <p className="text-stone-300 mb-8 text-lg leading-relaxed">{getMessage()}</p>

            <div className="bg-stone-900/50 p-4 rounded-xl mb-6 inline-flex gap-8">
              <div className="flex flex-col">
                <span className="text-xs uppercase text-stone-500">Duration</span>
                <span className="font-mono font-bold text-xl">{tick} ticks</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase text-stone-500">Result</span>
                <span
                  className={`font-bold text-xl ${isVictory ? 'text-green-400' : 'text-red-400'}`}
                >
                  {isVictory ? 'Success' : 'Failure'}
                </span>
              </div>
            </div>

            <Button
              variant={isVictory ? 'primary' : 'secondary'}
              size="lg"
              onClick={resetGame}
              className="w-full"
            >
              🔄 Play Again
            </Button>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
