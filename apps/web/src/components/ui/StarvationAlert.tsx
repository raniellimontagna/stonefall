/**
 * StarvationAlert Component
 * Shows warning when food is negative and critical alert near game over
 */

import { FOOD_DEBT_THRESHOLD, FOOD_GAME_OVER_THRESHOLD, ResourceType } from '@stonefall/shared';
import { selectResources, useGameStore } from '@/store';
import styles from './StarvationAlert.module.css';

export function StarvationAlert() {
  const resources = useGameStore(selectResources);
  const food = resources[ResourceType.Food];

  // No alert if food is positive
  if (food >= 0) {
    return null;
  }

  // Calculate severity (0 = just negative, 1 = critical/near game over)
  const severity =
    food <= FOOD_DEBT_THRESHOLD
      ? food <= FOOD_GAME_OVER_THRESHOLD * 0.7
        ? 'critical'
        : 'warning'
      : 'caution';

  const getMessage = () => {
    switch (severity) {
      case 'critical':
        return '⚠️ CRITICAL: Famine! Population dying rapidly!';
      case 'warning':
        return '⚠️ WARNING: Starvation! Build farms immediately!';
      default:
        return '⚠️ CAUTION: Food shortage! Increase production!';
    }
  };

  return (
    <div className={`${styles.alert} ${styles[severity]}`}>
      <span className={styles.message}>{getMessage()}</span>
      <span className={styles.foodAmount}>Food: {food}</span>
    </div>
  );
}
