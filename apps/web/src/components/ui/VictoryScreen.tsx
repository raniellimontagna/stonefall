import { Crown } from '@solar-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GameStats } from '@/components/ui/GameStats';
import { selectGameOver, selectStatistics, useGameStore } from '@/store';

export function VictoryScreen() {
  const gameOver = useGameStore(selectGameOver);
  const statistics = useGameStore(selectStatistics);
  const resetGame = useGameStore((s) => s.resetGame);
  const openChronicle = useGameStore((s) => s.openChronicle);

  const isVisible = gameOver === 'victory';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card variant="stone" className="bg-stone-900/95 border-4 border-gold-main shadow-2xl">
              {/* Header */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-center mb-6"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  className="flex justify-center mb-4"
                >
                  <Crown size={80} weight="Bold" className="text-gold-main drop-shadow-lg" />
                </motion.div>
                <h1
                  className="text-5xl md:text-6xl font-bold text-gold-main mb-3 drop-shadow-2xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  VITÓRIA!
                </h1>
                <p className="text-xl text-stone-300 max-w-md mx-auto">
                  Sua civilização triunfou sobre os rivais e ergueu-se como o maior império da era!
                </p>
              </motion.div>

              {/* Statistics */}
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold text-stone-100 mb-4 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  📊 Estatísticas
                </h2>
                <GameStats statistics={statistics} />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  variant="primary"
                  className="flex-1 text-lg py-3"
                  onClick={() => {
                    resetGame();
                    window.location.reload();
                  }}
                >
                  🔄 Jogar Novamente
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
