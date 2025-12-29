import { CheckCircle, CloseCircle, Crown, Star } from '@solar-icons/react';
import type { BuildingType, Resources } from '@stonefall/shared';
import { BUILDINGS, ERA_NAMES, ERA_REQUIREMENTS, NEXT_ERA } from '@stonefall/shared';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { selectEra, selectPopulation, selectResources, useGameStore } from '@/store';

interface EraProgressProps {
  mobile?: boolean;
}

export function EraProgress({ mobile }: EraProgressProps) {
  const era = useGameStore(selectEra);
  const resources = useGameStore(selectResources);
  const population = useGameStore(selectPopulation);
  const canAdvanceEra = useGameStore((s) => s.canAdvanceEra);
  const advanceEra = useGameStore((s) => s.advanceEra);
  const getBuildingCount = useGameStore((s) => s.getBuildingCount);

  const nextEra = NEXT_ERA[era];
  const requirements = nextEra ? ERA_REQUIREMENTS[nextEra] : null;

  const handleAdvance = () => {
    if (canAdvanceEra()) {
      advanceEra();
    }
  };

  let progressPercentage = 100;
  if (requirements) {
    const checks: boolean[] = [];
    for (const [resource, amount] of Object.entries(requirements.resources)) {
      checks.push(resources[resource as keyof Resources] >= (amount ?? 0));
    }
    checks.push(population.current >= requirements.population);
    for (const buildingType of requirements.buildings) {
      checks.push(getBuildingCount(buildingType) >= 1);
    }
    const metCount = checks.filter(Boolean).length;
    progressPercentage = Math.round((metCount / checks.length) * 100);
  }

  const MetIcon = ({ met }: { met: boolean }) =>
    met ? (
      <CheckCircle size={18} className="text-green-400 drop-shadow-sm" weight="Bold" />
    ) : (
      <CloseCircle size={18} className="text-stone-600" weight="Bold" />
    );

  return (
    <div className={cn('flex flex-col gap-4', mobile ? 'w-full' : '')}>
      {!mobile && (
        <h3 className="text-xl font-bold flex items-center gap-2 text-gold-main drop-shadow-md">
          <Crown size={24} weight="Bold" className="text-gold-main" />
          <span>Era Progression</span>
        </h3>
      )}

      <div className="flex justify-between items-baseline mb-2 px-1">
        <span className="text-xs text-stone-500 uppercase tracking-widest font-bold">
          Current Era
        </span>
        <span className="text-xl font-bold text-stone-100 drop-shadow-md font-mono tracking-tight">
          {ERA_NAMES[era]}
        </span>
      </div>

      {nextEra && requirements ? (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm px-1">
            <span className="text-stone-400 flex items-center gap-1.5">
              Next:{' '}
              <span className="text-gold-light font-bold flex items-center gap-1">
                <Star size={14} weight="Bold" /> {ERA_NAMES[nextEra]}
              </span>
            </span>
            <span className="text-stone-500 font-mono font-bold bg-stone-900 px-1.5 rounded">
              {progressPercentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-stone-950/50 rounded-full overflow-hidden border border-stone-800/50 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-gold-dark to-gold-main transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,215,0,0.3)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <Card
            variant="glass"
            className="p-4 flex flex-col gap-3 bg-stone-900/60 backdrop-blur-md border-stone-800/50"
          >
            {/* Resources */}
            {Object.entries(requirements.resources).map(([resource, amount]) => {
              const current = resources[resource as keyof Resources];
              const met = current >= (amount ?? 0);
              return (
                <div
                  key={resource}
                  className={cn(
                    'flex items-center justify-between text-sm transition-opacity duration-300',
                    met ? 'opacity-60 grayscale-[0.3]' : ''
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MetIcon met={met} />
                    <span className="flex items-center gap-1.5 font-medium text-stone-200">
                      <Icon name={resource} size="sm" className="drop-shadow" /> {amount}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'font-mono text-xs font-bold px-1.5 rounded',
                      met ? 'text-green-400/80' : 'text-stone-500 bg-stone-950/30'
                    )}
                  >
                    {Math.floor(current)}/{amount}
                  </span>
                </div>
              );
            })}

            {/* Population */}
            <div
              className={cn(
                'flex items-center justify-between text-sm transition-opacity duration-300',
                population.current >= requirements.population ? 'opacity-60 grayscale-[0.3]' : ''
              )}
            >
              <div className="flex items-center gap-3">
                <MetIcon met={population.current >= requirements.population} />
                <span className="text-stone-200 font-medium">
                  {requirements.population} Population
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-stone-500 bg-stone-950/30 px-1.5 rounded">
                {population.current}/{requirements.population}
              </span>
            </div>

            {/* Buildings */}
            {requirements.buildings.map((buildingType: BuildingType) => {
              const count = getBuildingCount(buildingType);
              const met = count >= 1;
              return (
                <div
                  key={buildingType}
                  className={cn(
                    'flex items-center justify-between text-sm transition-opacity duration-300',
                    met ? 'opacity-60 grayscale-[0.3]' : ''
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MetIcon met={met} />
                    <span className="text-stone-200 font-medium">
                      {BUILDINGS[buildingType]?.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </Card>

          <Button
            variant="primary"
            disabled={!canAdvanceEra()}
            onClick={handleAdvance}
            className={cn(
              'w-full mt-2 font-bold tracking-wide shadow-lg',
              canAdvanceEra() ? 'animate-pulse shadow-gold-main/20' : 'opacity-80'
            )}
          >
            Advance Era
          </Button>
        </div>
      ) : (
        <div className="p-6 bg-gold-main/5 border border-gold-main/20 rounded-xl text-center backdrop-blur-sm">
          <p className="text-gold-main font-bold text-lg mb-1 drop-shadow-sm">Max Level Reached</p>
          <p className="text-xs text-stone-400 max-w-[200px] mx-auto leading-relaxed">
            Your civilization stands at the pinnacle of history.
          </p>
        </div>
      )}
    </div>
  );
}
