/**
 * ResourceBar Component
 * Displays current resources, production rates, and population
 */

import { ResourceType } from '@stonefall/shared';
import { formatProductionRate, formatResource } from '@/game/managers';
import { selectPopulation, selectProduction, selectResources, useGameStore } from '@/store';
import styles from './ResourceBar.module.css';

/** Resource display configuration */
const RESOURCE_CONFIG: Record<ResourceType, { icon: string; color: string; label: string }> = {
  [ResourceType.Food]: { icon: '🌾', color: '#f4a460', label: 'Food' },
  [ResourceType.Wood]: { icon: '🪵', color: '#8b4513', label: 'Wood' },
  [ResourceType.Stone]: { icon: '🪨', color: '#808080', label: 'Stone' },
  [ResourceType.Gold]: { icon: '🪙', color: '#ffd700', label: 'Gold' },
};

export function ResourceBar() {
  const resources = useGameStore(selectResources);
  const production = useGameStore(selectProduction);
  const population = useGameStore(selectPopulation);

  // Calculate net food production (production - consumption)
  const netFoodProduction = production.food - population.consumptionPerTick;

  return (
    <div className={styles.resourceBar}>
      {/* Resources */}
      <div className={styles.resourcesSection}>
        {Object.values(ResourceType).map((type) => {
          const config = RESOURCE_CONFIG[type];
          const value = resources[type];
          const rate = type === ResourceType.Food ? netFoodProduction : production[type];

          return (
            <div key={type} className={styles.resourceItem}>
              <span className={styles.resourceIcon}>{config.icon}</span>
              <span className={styles.resourceValue} style={{ color: config.color }}>
                {formatResource(value)}
              </span>
              <span
                className={styles.resourceRate}
                data-positive={rate >= 0}
                data-negative={rate < 0}
              >
                ({formatProductionRate(rate)}/s)
              </span>
            </div>
          );
        })}
      </div>

      {/* Population */}
      <div className={styles.populationSection}>
        <span className={styles.populationIcon}>👥</span>
        <span className={styles.populationValue}>
          {population.current}/{population.max}
        </span>
        <span className={styles.populationLabel}>Pop</span>
      </div>
    </div>
  );
}
