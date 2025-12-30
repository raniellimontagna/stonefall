import type { GameStatistics } from '@stonefall/shared';
import { Era } from '@stonefall/shared';
import { motion } from 'framer-motion';

interface GameStatsProps {
  statistics: GameStatistics;
}

const ERA_NAMES = {
  [Era.Stone]: 'Idade da Pedra',
  [Era.Bronze]: 'Idade do Bronze',
  [Era.Iron]: 'Idade do Ferro',
};

export function GameStats({ statistics }: GameStatsProps) {
  const {
    duration,
    realTimePlayed,
    finalEra,
    maxPopulation,
    totalBuildings,
    totalBattles,
    battlesWon,
    eventsEncountered,
  } = statistics;

  const stats = [
    { label: 'Duração', value: `${duration} ticks` },
    { label: 'Tempo Real', value: `${Math.floor(realTimePlayed / 60)}m ${realTimePlayed % 60}s` },
    { label: 'Era Final', value: ERA_NAMES[finalEra] },
    { label: 'População Máxima', value: maxPopulation },
    { label: 'Construções', value: totalBuildings },
    { label: 'Batalhas', value: `${battlesWon}/${totalBattles}` },
    { label: 'Eventos', value: eventsEncountered },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-stone-800/60 backdrop-blur-sm p-4 rounded-xl border border-stone-700/50"
        >
          <div className="text-xs text-stone-400 uppercase tracking-wider font-medium mb-1">
            {stat.label}
          </div>
          <div
            className="text-2xl font-bold text-stone-100"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {stat.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
