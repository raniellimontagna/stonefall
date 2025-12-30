/**
 * Store Helpers
 * Utility functions used across multiple slices
 */

import type { Building, ProductionRates } from '@stonefall/shared';
import { BASE_MAX_POPULATION, BUILDINGS, ResourceType } from '@stonefall/shared';

/**
 * Generate unique building ID
 */
export const generateBuildingId = (): string => {
  return `building_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Calculate total production from all buildings
 */
export const calculateProduction = (buildings: Building[]): ProductionRates => {
  const production: ProductionRates = { food: 0, wood: 0, stone: 0, gold: 0 };

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
    if (def.production) {
      if (def.production[ResourceType.Food]) {
        production.food += def.production[ResourceType.Food];
      }
      if (def.production[ResourceType.Wood]) {
        production.wood += def.production[ResourceType.Wood];
      }
      if (def.production[ResourceType.Stone]) {
        production.stone += def.production[ResourceType.Stone];
      }
      if (def.production[ResourceType.Gold]) {
        production.gold += def.production[ResourceType.Gold];
      }
    }
  }

  return production;
};

/**
 * Calculate max population from buildings
 */
export const calculateMaxPopulation = (buildings: Building[]): number => {
  let maxPop = BASE_MAX_POPULATION;

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
    maxPop += def.populationBonus;
  }

  return maxPop;
};
