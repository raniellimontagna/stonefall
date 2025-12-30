import { DangerTriangle } from '@solar-icons/react';
import { FOOD_DEBT_THRESHOLD, FOOD_GAME_OVER_THRESHOLD, ResourceType } from '@stonefall/shared';
import { cn } from '@/lib/utils';
import { selectResources, useGameStore } from '@/store';

export function StarvationAlert() {
  const resources = useGameStore(selectResources);
  const food = resources[ResourceType.Food];

  if (food >= 0) {
    return null;
  }

  const severity =
    food <= FOOD_DEBT_THRESHOLD
      ? food <= FOOD_GAME_OVER_THRESHOLD * 0.7
        ? 'critical'
        : 'warning'
      : 'caution';

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-lg animate-pulse',
        severity === 'critical'
          ? 'bg-red-900/90 text-red-100 border-red-500'
          : severity === 'warning'
            ? 'bg-orange-900/90 text-orange-100 border-orange-500'
            : 'bg-yellow-900/80 text-yellow-100 border-yellow-600'
      )}
    >
      {severity === 'critical' ? (
        <DangerTriangle size={18} weight="Bold" />
      ) : (
        <DangerTriangle size={18} weight="Linear" />
      )}
      <div className="flex flex-col leading-none">
        <span className="text-xs font-bold uppercase tracking-wider">{severity}</span>
        <span className="font-mono font-bold">Food: {Math.floor(food)}</span>
      </div>
    </div>
  );
}
