import { UsersGroupRounded } from '@solar-icons/react';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';

export function ResourceBar() {
  const { resources, population, production } = useGameStore();

  // Calculate net food rate (production - consumption)
  const consumption = population.consumptionPerTick;
  const foodRate = production.food - consumption;

  return (
    <Card
      variant="glass"
      className={cn(
        'flex flex-col lg:flex-row items-center justify-between px-4 py-2 mx-2 mt-2 gap-3 lg:gap-6',
        'lg:mx-0 lg:mt-0 lg:rounded-none lg:border-t-0 lg:border-x-0 lg:w-full',
        'bg-stone-900/60 backdrop-blur-md border-stone-800/50 shadow-xl'
      )}
    >
      {/* Resources Group */}
      <div className="flex flex-wrap justify-center gap-4 lg:gap-8 items-center w-full lg:w-auto">
        <ResourceItem
          icon="food"
          value={Math.floor(resources.food)}
          rate={foodRate}
          label="Food"
          color="text-orange-300"
        />
        <ResourceItem
          icon="wood"
          value={Math.floor(resources.wood)}
          rate={production.wood}
          label="Wood"
          color="text-amber-700"
        />
        <ResourceItem
          icon="stone"
          value={Math.floor(resources.stone)}
          rate={production.stone}
          label="Stone"
          color="text-stone-400"
        />
        <ResourceItem
          icon="gold"
          value={Math.floor(resources.gold)}
          rate={production.gold}
          label="Gold"
          color="text-yellow-400"
        />
      </div>

      {/* Population */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-1.5 rounded-full border',
          'bg-stone-800/80 border-stone-700/50 shadow-inner min-w-[120px] justify-center'
        )}
      >
        <UsersGroupRounded size={20} weight="Bold" className="text-stone-300" />
        <div className="flex items-baseline gap-1">
          <span className="font-bold text-lg text-stone-100 font-mono tracking-tight">
            {population.current}
          </span>
          <span className="text-xs text-stone-500 font-medium">/ {population.max}</span>
        </div>
      </div>
    </Card>
  );
}

function ResourceItem({
  icon,
  value,
  rate,
  label,
  color,
}: {
  icon: string;
  value: number;
  rate: number;
  label: string;
  color?: string;
}) {
  const isPositive = rate > 0;

  return (
    <div className="flex items-center gap-2 group cursor-help relative" title={label}>
      <div className="relative">
        <Icon
          name={icon}
          size="md"
          className="drop-shadow-lg transition-transform group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-bold min-w-[30px] text-lg font-mono tracking-tight',
            'drop-shadow-md transition-colors',
            color || 'text-stone-100'
          )}
        >
          {value}
        </span>
        {rate !== 0 && (
          <span
            className={cn(
              'text-[10px] font-mono font-bold',
              isPositive ? 'text-green-400' : 'text-red-400'
            )}
          >
            {isPositive ? '+' : ''}
            {rate.toFixed(1)}/t
          </span>
        )}
      </div>
    </div>
  );
}
