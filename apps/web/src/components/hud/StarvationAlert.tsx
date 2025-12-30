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
        'flex items-center gap-3 px-3 py-2 rounded-2xl border shadow-lg animate-pulse',
        'bg-stone-900/60 backdrop-blur-md',
        severity === 'critical'
          ? 'text-red-400 border-red-500/50 shadow-red-900/20'
          : severity === 'warning'
            ? 'text-orange-400 border-orange-500/50 shadow-orange-900/20'
            : 'text-yellow-400 border-yellow-500/50 shadow-yellow-900/20'
      )}
    >
      {severity === 'critical' ? (
        <DangerTriangle size={24} weight="Bold" className="drop-shadow-md" />
      ) : (
        <DangerTriangle size={24} weight="Linear" className="drop-shadow-md" />
      )}
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">
          {severity}
        </span>
        <span className="font-mono font-bold text-lg tracking-tight">Food: {Math.floor(food)}</span>
      </div>
    </div>
  );
}
