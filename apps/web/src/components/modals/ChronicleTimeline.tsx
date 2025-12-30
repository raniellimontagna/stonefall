import type { ChronicleEntry } from '@stonefall/shared';
import { Era } from '@stonefall/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { selectChronicle, selectChronicleModal, useGameStore } from '@/store';

const ERA_NAMES: Record<Era, string> = {
  [Era.Stone]: 'Idade da Pedra',
  [Era.Bronze]: 'Idade do Bronze',
  [Era.Iron]: 'Idade do Ferro',
};

const ERA_COLORS: Record<Era, string> = {
  [Era.Stone]: 'border-stone-500 bg-stone-800/50',
  [Era.Bronze]: 'border-amber-600 bg-amber-900/30',
  [Era.Iron]: 'border-gray-500 bg-gray-800/50',
};

function TimelineEntry({ entry }: { entry: ChronicleEntry }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-3 items-start"
    >
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-lg">
          {entry.icon || '📜'}
        </div>
        <div className="w-0.5 h-full bg-stone-700 flex-1 min-h-[20px]" />
      </div>
      <div className="flex-1 pb-4">
        <div className="text-xs text-stone-500 font-mono">Tick {entry.tick}</div>
        <div className="font-semibold text-stone-100" style={{ fontFamily: 'var(--font-heading)' }}>
          {entry.title}
        </div>
        <div className="text-sm text-stone-400">{entry.description}</div>
      </div>
    </motion.div>
  );
}

function EraSection({ era, entries }: { era: Era; entries: ChronicleEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="mb-6">
      <div className={`px-3 py-1.5 rounded-lg border mb-4 inline-block ${ERA_COLORS[era]}`}>
        <span className="text-sm font-bold uppercase tracking-wider">{ERA_NAMES[era]}</span>
      </div>
      <div className="pl-2">
        {entries.map((entry) => (
          <TimelineEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export function ChronicleTimeline() {
  const chronicle = useGameStore(selectChronicle);
  const isOpen = useGameStore(selectChronicleModal);
  const closeChronicle = useGameStore((s) => s.closeChronicle);

  // Group entries by era
  const entriesByEra: Record<Era, ChronicleEntry[]> = {
    [Era.Stone]: [],
    [Era.Bronze]: [],
    [Era.Iron]: [],
  };

  for (const entry of chronicle.entries) {
    entriesByEra[entry.era].push(entry);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeChronicle}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            className="w-full max-w-xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card
              variant="stone"
              className="bg-stone-900/95 border-2 border-stone-600 flex flex-col h-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-700 shrink-0">
                <h2
                  className="text-2xl font-bold text-stone-100 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  📜 Crônica de {chronicle.civilizationName}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeChronicle}>
                  ✕
                </Button>
              </div>

              {/* Timeline - Scrollable */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                {chronicle.entries.length === 0 ? (
                  <div className="text-center py-8 text-stone-500">
                    <div className="text-4xl mb-2">📜</div>
                    <p>A história ainda está sendo escrita...</p>
                    <p className="text-sm">Construa, evolua e conquiste para registrar sua saga.</p>
                  </div>
                ) : (
                  <>
                    <EraSection era={Era.Stone} entries={entriesByEra[Era.Stone]} />
                    <EraSection era={Era.Bronze} entries={entriesByEra[Era.Bronze]} />
                    <EraSection era={Era.Iron} entries={entriesByEra[Era.Iron]} />
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-stone-700 text-center text-sm text-stone-500 shrink-0">
                {chronicle.entries.length} eventos registrados
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
