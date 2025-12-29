import type { EventChoice, EventEffect, GameEvent } from '@stonefall/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { selectPendingEvent, selectResources, useGameStore } from '@/store';

const getEventIcon = (event: GameEvent): string => {
  if (event.icon) return event.icon;
  const icons: Record<string, string> = {
    economic: '🌾',
    social: '👥',
    natural: '🌋',
    military: '⚔️',
    political: '🏛️',
  };
  return icons[event.type] || '📜';
};

const formatEffect = (effect: EventEffect): string => {
  const targetLabels: Record<string, string> = {
    food: 'Food',
    wood: 'Wood',
    stone: 'Stone',
    gold: 'Gold',
    current: 'Pop',
    max: 'Max Pop',
    strength: 'Strength',
    defense: 'Defense',
  };

  const label = targetLabels[effect.target] || effect.target;
  const sign = effect.value >= 0 ? '+' : '';
  const suffix = effect.isPercentage ? '%' : '';

  return `${label}: ${sign}${effect.value}${suffix}`;
};

const canAffordChoice = (choice: EventChoice, resources: Record<string, number>): boolean => {
  if (!choice.requirements) return true;
  for (const [key, value] of Object.entries(choice.requirements)) {
    const resourceValue = resources[key];
    if (value !== undefined && resourceValue !== undefined && resourceValue < value) {
      return false;
    }
  }
  return true;
};

export const EventCard = () => {
  const pendingEvent = useGameStore(selectPendingEvent);
  const resources = useGameStore(selectResources);
  const resolveEvent = useGameStore((state) => state.resolveEvent);

  const resourcesRecord = useMemo(
    () => ({
      food: resources.food,
      wood: resources.wood,
      stone: resources.stone,
      gold: resources.gold,
    }),
    [resources]
  );

  const handleChoice = useCallback(
    (choiceId: string) => {
      resolveEvent(choiceId);
    },
    [resolveEvent]
  );

  if (!pendingEvent) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card
            variant="wood"
            className="w-full max-w-lg shadow-2xl border-4 border-gold-dark relative"
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="text-5xl mb-2 filter drop-shadow-md">
                {getEventIcon(pendingEvent)}
              </div>
              <h2 className="text-2xl font-bold text-gold-light uppercase tracking-wide drop-shadow-md">
                {pendingEvent.title}
              </h2>
              <span className="text-xs uppercase bg-stone-900/50 px-2 py-0.5 rounded text-stone-400 mt-1">
                {pendingEvent.type} Event
              </span>
            </div>

            {/* Description */}
            <p className="text-stone-200 mb-6 text-center italic bg-stone-900/30 p-3 rounded-lg border border-stone-800">
              "{pendingEvent.description}"
            </p>

            {/* Choices */}
            <div className="flex flex-col gap-3">
              {pendingEvent.choices.map((choice: EventChoice) => {
                const canAfford = canAffordChoice(choice, resourcesRecord);

                return (
                  <Button
                    key={choice.id}
                    variant={canAfford ? 'secondary' : 'ghost'}
                    className={cn(
                      'flex flex-col items-center p-4 h-auto border-2',
                      canAfford
                        ? 'border-wood-accent hover:border-gold-main'
                        : 'opacity-50 grayscale border-transparent'
                    )}
                    onClick={() => canAfford && handleChoice(choice.id)}
                    disabled={!canAfford}
                  >
                    <span className="font-bold text-lg">{choice.text}</span>
                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                      {choice.effects.map((effect: EventEffect, index: number) => (
                        <span
                          key={`${effect.type}-${effect.target}-${index}`}
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded font-mono font-bold',
                            effect.value > 0
                              ? 'bg-green-900/50 text-green-300'
                              : effect.value < 0
                                ? 'bg-red-900/50 text-red-300'
                                : 'bg-stone-700 text-stone-300'
                          )}
                        >
                          {formatEffect(effect)}
                        </span>
                      ))}
                    </div>
                  </Button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventCard;
