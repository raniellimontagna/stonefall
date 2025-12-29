/**
 * ResourceManager
 * Utility class for resource calculations and tick processing
 */

import type { PopulationState, ProductionRates, Resources } from '@stonefall/shared';
import {
  FOOD_DEBT_THRESHOLD,
  POPULATION_CONSUMPTION_RATE,
  POPULATION_DEATH_INTERVAL,
  POPULATION_GROWTH_INTERVAL,
} from '@stonefall/shared';

export interface TickResult {
  resources: Resources;
  population: PopulationState;
  foodDebt: number;
}

/**
 * Calculate resources after a tick
 */
export function calculateTickResources(
  currentResources: Resources,
  production: ProductionRates,
  populationCount: number
): Resources {
  const consumption = populationCount * POPULATION_CONSUMPTION_RATE;

  return {
    food: currentResources.food + production.food - consumption,
    wood: currentResources.wood + production.wood,
    stone: currentResources.stone + production.stone,
    gold: currentResources.gold + production.gold,
  };
}

/**
 * Calculate net production (production - consumption)
 */
export function calculateNetProduction(
  production: ProductionRates,
  populationCount: number
): ProductionRates {
  const consumption = populationCount * POPULATION_CONSUMPTION_RATE;

  return {
    food: production.food - consumption,
    wood: production.wood,
    stone: production.stone,
    gold: production.gold,
  };
}

/**
 * Check if population should grow
 * Growth happens every POPULATION_GROWTH_INTERVAL ticks if food > 0
 */
export function shouldPopulationGrow(tick: number, food: number): boolean {
  return tick > 0 && tick % POPULATION_GROWTH_INTERVAL === 0 && food > 0;
}

/**
 * Check if population should die from starvation
 * Death happens every POPULATION_DEATH_INTERVAL ticks if food debt exceeds threshold
 */
export function shouldPopulationDie(tick: number, food: number): boolean {
  return tick > 0 && tick % POPULATION_DEATH_INTERVAL === 0 && food < FOOD_DEBT_THRESHOLD;
}

/**
 * Process a full game tick
 */
export function processTick(
  tick: number,
  resources: Resources,
  production: ProductionRates,
  population: PopulationState
): TickResult {
  // Calculate new resources
  const newResources = calculateTickResources(resources, production, population.current);

  // Track food debt for starvation mechanics
  const foodDebt = Math.min(0, newResources.food);

  // Population changes
  let newPopulationCount = population.current;

  // Growth check
  if (shouldPopulationGrow(tick, newResources.food)) {
    if (newPopulationCount < population.max) {
      newPopulationCount += 1;
    }
  }

  // Death check
  if (shouldPopulationDie(tick, newResources.food)) {
    if (newPopulationCount > 1) {
      newPopulationCount -= 1;
    }
  }

  const newPopulation: PopulationState = {
    current: newPopulationCount,
    max: population.max,
    consumptionPerTick: newPopulationCount * POPULATION_CONSUMPTION_RATE,
  };

  return {
    resources: newResources,
    population: newPopulation,
    foodDebt,
  };
}

/**
 * Format a resource number for display
 */
export function formatResource(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(1);
}

/**
 * Format production rate for display (with +/- sign)
 */
export function formatProductionRate(rate: number): string {
  const sign = rate >= 0 ? '+' : '';
  if (Number.isInteger(rate)) {
    return `${sign}${rate}`;
  }
  return `${sign}${rate.toFixed(1)}`;
}
