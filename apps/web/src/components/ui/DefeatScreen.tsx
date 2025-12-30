import { CloseCircle } from '@solar-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GameStats } from '@/components/ui/GameStats';
import { selectGameOver, selectStatistics, useGameStore } from '@/store';

export function DefeatScreen() {
  const gameOver = useGameStore(selectGameOver);
  const statistics = useGameStore(selectStatistics);
  const resetGame = useGameStore((s) => s.resetGame);
  const openChronicle = useGameStore((s) => s.openChronicle);

  const isVisible = gameOver === 'starvation' || gameOver === 'defeat';

  const getDefeatMessage = () => {
    if (gameOver === 'starvation') {
      return 'A fome dizimou sua população, levando ao colapso da civilização.';
    }
    return 'Seu império foi derrotado pelos rivais, caindo nas sombras da história.';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          {/* Red overlay effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute inset-0 bg-red-900 pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10"
          >
            <Card variant="stone" className="bg-stone-950/95 border-4 border-red-900/50 shadow-2xl">
              {/* Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-center mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                  className="flex justify-center mb-4"
                >
                  <CloseCircle size={80} weight="Bold" className="text-red-500 drop-shadow-lg" />
                </motion.div>
                <h1
                  className="text-5xl md:text-6xl font-bold text-red-500 mb-3 drop-shadow-2xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  DERROTA
                </h1>
                <p className="text-xl text-stone-400 max-w-md mx-auto">{getDefeatMessage()}</p>
              </motion.div>

              {/* Statistics */}
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold text-stone-200 mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  📊 Estatísticas Finais
                </h2>
                <GameStats statistics={statistics} />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  variant="danger"
                  className="flex-1 text-lg py-3"
                  onClick={() => {
                    resetGame();
                    window.location.reload();
                  }}
                >
                  🔄 Tentar Novamente
                </Button>
                <Button variant="secondary" className="flex-1 text-lg py-3" onClick={openChronicle}>
                  📜 Ver Crônica
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
