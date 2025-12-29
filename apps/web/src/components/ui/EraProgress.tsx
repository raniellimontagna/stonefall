/**
 * EraProgress Component
 * Shows current era, next era requirements, and advance button
 */

import type { BuildingType, Resources } from '@stonefall/shared';
import { BUILDINGS, ERA_NAMES, ERA_REQUIREMENTS, NEXT_ERA, ResourceType } from '@stonefall/shared';
import { selectEra, selectPopulation, selectResources, useGameStore } from '@/store';
import styles from './EraProgress.module.css';

export function EraProgress() {
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

  // Calculate progress percentage
  let progressPercentage = 100;
  if (requirements) {
    const checks: boolean[] = [];

    // Resource checks
    for (const [resource, amount] of Object.entries(requirements.resources)) {
      checks.push(resources[resource as keyof Resources] >= (amount ?? 0));
    }

    // Population check
    checks.push(population.current >= requirements.population);

    // Building checks
    for (const buildingType of requirements.buildings) {
      checks.push(getBuildingCount(buildingType) >= 1);
    }

    const metCount = checks.filter(Boolean).length;
    progressPercentage = Math.round((metCount / checks.length) * 100);
  }

  return (
    <div className={styles.eraProgress}>
      <div className={styles.header}>
        <span className={styles.label}>Era</span>
        <span className={styles.currentEra}>{ERA_NAMES[era]}</span>
      </div>

      {nextEra && requirements && (
        <>
          <div className={styles.nextEra}>
            <span>Próxima: {ERA_NAMES[nextEra]}</span>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
          </div>

          <div className={styles.requirements}>
            {/* Resource requirements */}
            {Object.entries(requirements.resources).map(([resource, amount]) => {
              const current = resources[resource as keyof Resources];
              const met = current >= (amount ?? 0);
              return (
                <div key={resource} className={styles.requirement} data-met={met}>
                  <span className={styles.icon}>{met ? '✅' : '❌'}</span>
                  <span>
                    {amount} {resource === ResourceType.Stone ? 'pedra' : 'ouro'}
                  </span>
                  <span className={styles.current}>
                    ({Math.floor(current)}/{amount})
                  </span>
                </div>
              );
            })}

            {/* Population requirement */}
            <div
              className={styles.requirement}
              data-met={population.current >= requirements.population}
            >
              <span className={styles.icon}>
                {population.current >= requirements.population ? '✅' : '❌'}
              </span>
              <span>{requirements.population} população</span>
              <span className={styles.current}>
                ({population.current}/{requirements.population})
              </span>
            </div>

            {/* Building requirements */}
            {requirements.buildings.map((buildingType: BuildingType) => {
              const count = getBuildingCount(buildingType);
              const met = count >= 1;
              const buildingName = BUILDINGS[buildingType]?.name ?? buildingType;
              return (
                <div key={buildingType} className={styles.requirement} data-met={met}>
                  <span className={styles.icon}>{met ? '✅' : '❌'}</span>
                  <span>1 {buildingName}</span>
                  <span className={styles.current}>({count}/1)</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.advanceButton}
            disabled={!canAdvanceEra()}
            onClick={handleAdvance}
          >
            Avançar Era
          </button>
        </>
      )}

      {!nextEra && (
        <div className={styles.maxEra}>
          <span>🏆 Era máxima alcançada!</span>
        </div>
      )}
    </div>
  );
}
