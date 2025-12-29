/**
 * BuildPanel Component
 * Panel for selecting buildings to construct
 */

import type { BuildingType, Resources } from '@stonefall/shared';
import { BUILDINGS } from '@stonefall/shared';
import { formatResource } from '@/game/managers';
import { selectPlacementMode, selectResources, useGameStore } from '@/store';
import styles from './BuildPanel.module.css';

export function BuildPanel() {
  const resources = useGameStore(selectResources);
  const placementMode = useGameStore(selectPlacementMode);
  const setPlacementMode = useGameStore((s) => s.setPlacementMode);
  const canAfford = useGameStore((s) => s.canAfford);
  const getAvailableBuildings = useGameStore((s) => s.getAvailableBuildings);

  // Get available buildings for current era (dynamically)
  const availableBuildings = getAvailableBuildings();

  const handleBuildClick = (type: BuildingType) => {
    if (placementMode === type) {
      // Toggle off if already selected
      setPlacementMode(null);
    } else {
      setPlacementMode(type);
    }
  };

  const handleCancelClick = () => {
    setPlacementMode(null);
  };

  return (
    <div className={styles.buildPanel}>
      <h3 className={styles.title}>Build</h3>

      <div className={styles.buildingList}>
        {availableBuildings.map((type) => {
          const def = BUILDINGS[type];
          const affordable = canAfford(def.cost);
          const isSelected = placementMode === type;

          return (
            <button
              type="button"
              key={type}
              className={styles.buildingButton}
              data-selected={isSelected}
              data-disabled={!affordable}
              disabled={!affordable}
              onClick={() => handleBuildClick(type)}
              title={def.name}
            >
              <span className={styles.buildingName}>{def.name}</span>
              <div className={styles.buildingCost}>
                {Object.entries(def.cost).map(([resource, cost]) => (
                  <span
                    key={resource}
                    className={styles.costItem}
                    data-affordable={resources[resource as keyof Resources] >= (cost ?? 0)}
                  >
                    {formatResource(cost ?? 0)} {resource.charAt(0).toUpperCase()}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {placementMode && (
        <div className={styles.placementInfo}>
          <p>Click on the map to place {BUILDINGS[placementMode].name}</p>
          <button type="button" className={styles.cancelButton} onClick={handleCancelClick}>
            Cancel (ESC)
          </button>
        </div>
      )}
    </div>
  );
}
