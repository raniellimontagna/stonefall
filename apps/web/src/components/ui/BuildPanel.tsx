import { Sledgehammer } from '@solar-icons/react';
import type { BuildingType, Resources } from '@stonefall/shared';
import { BUILDINGS } from '@stonefall/shared';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { formatResource } from '@/game/managers';
import { cn } from '@/lib/utils';
import { selectPlacementMode, selectResources, useGameStore } from '@/store';

interface BuildPanelProps {
  mobile?: boolean;
  onBuildingSelect?: () => void;
}

export function BuildPanel({ mobile, onBuildingSelect }: BuildPanelProps) {
  const resources = useGameStore(selectResources);
  const placementMode = useGameStore(selectPlacementMode);
  const setPlacementMode = useGameStore((s) => s.setPlacementMode);
  const canAfford = useGameStore((s) => s.canAfford);
  const getAvailableBuildings = useGameStore((s) => s.getAvailableBuildings);

  const availableBuildings = getAvailableBuildings();

  const handleBuildClick = (type: BuildingType) => {
    if (placementMode === type) {
      setPlacementMode(null);
    } else {
      setPlacementMode(type);
      onBuildingSelect?.();
    }
  };

  // Keyboard shortcut for cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && placementMode) {
        setPlacementMode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placementMode, setPlacementMode]);

  return (
    <div className={cn('flex flex-col gap-4', mobile ? 'w-full' : 'w-full')}>
      {!mobile && (
        <h3
          className="text-xl font-bold flex items-center gap-2 text-wood-light drop-shadow-md"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Sledgehammer size={24} weight="Bold" className="text-wood-main" />
          <span>Construction</span>
        </h3>
      )}

      <div className={cn('grid gap-3', mobile ? 'grid-cols-2' : 'grid-cols-1')}>
        {availableBuildings.map((type) => {
          const def = BUILDINGS[type];
          const affordable = canAfford(def.cost);
          const isSelected = placementMode === type;

          return (
            <Button
              key={type}
              variant="ghost"
              className={cn(
                'relative flex flex-col items-start p-3 h-auto min-h-[90px] transition-all duration-200',
                'bg-stone-900/40 backdrop-blur-sm border border-stone-800/50 hover:bg-stone-800/60',
                isSelected
                  ? 'ring-2 ring-gold-main bg-wood-dark/40 border-gold-main/50 shadow-lg scale-[1.02]'
                  : '',
                !affordable &&
                  !isSelected &&
                  'opacity-60 grayscale hover:grayscale-0 hover:opacity-80'
              )}
              disabled={!affordable && !isSelected}
              onClick={() => handleBuildClick(type)}
            >
              <div className="flex items-center gap-3 w-full mb-3">
                <div
                  className={cn(
                    'p-2 rounded-lg bg-stone-950/50 shadow-inner',
                    isSelected ? 'bg-gold-main/10 text-gold-main' : 'text-stone-400'
                  )}
                >
                  {/* Placeholder for building icon asset if we had one specific logic */}
                  <Icon name={`buildings/${type}`} size="md" className="shrink-0" />
                </div>
                <span
                  className={cn(
                    'font-bold text-lg leading-tight tracking-tight',
                    isSelected ? 'text-gold-light' : 'text-stone-200'
                  )}
                >
                  {def.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs w-full pl-1">
                {Object.entries(def.cost).map(([resource, cost]) => (
                  <span
                    key={resource}
                    className={cn(
                      'flex items-center gap-1.5 font-mono font-bold bg-stone-950/30 px-1.5 py-0.5 rounded',
                      resources[resource as keyof Resources] >= (cost ?? 0)
                        ? 'text-stone-300'
                        : 'text-red-400 bg-red-900/10'
                    )}
                  >
                    <Icon name={resource} size="sm" />
                    {formatResource(cost ?? 0)}
                  </span>
                ))}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
