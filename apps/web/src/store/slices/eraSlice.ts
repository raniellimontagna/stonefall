/**
 * Era Slice
 * Manages era progression
 */

import type { BuildingType, Resources } from '@stonefall/shared';
import { BUILDINGS, ERA_MODIFIERS, ERA_REQUIREMENTS, Era, NEXT_ERA } from '@stonefall/shared';
import { soundManager } from '@/game/SoundManager';
import type { SliceCreator } from '../types';

export interface EraSlice {
  // Actions (no additional state - uses era from CoreSlice)
  canAdvanceEra: () => boolean;
  advanceEra: () => boolean;
  getAvailableBuildings: () => BuildingType[];
}

export const createEraSlice: SliceCreator<EraSlice> = (set, get) => ({
  // Actions
  canAdvanceEra: () => {
    const state = get();
    const nextEra = NEXT_ERA[state.era];
    if (!nextEra) return false;

    const requirements = ERA_REQUIREMENTS[nextEra];
    if (!requirements) return false;

    // Check resource requirements
    for (const [resource, amount] of Object.entries(requirements.resources)) {
      if (state.resources[resource as keyof Resources] < (amount ?? 0)) {
        return false;
      }
    }

    // Check population requirement
    if (state.population.current < requirements.population) {
      return false;
    }

    // Check building requirements
    for (const buildingType of requirements.buildings) {
      if (get().getBuildingCount(buildingType) < 1) {
        return false;
      }
    }

    return true;
  },

  advanceEra: () => {
    const state = get();
    if (!get().canAdvanceEra()) return false;

    const nextEra = NEXT_ERA[state.era];
    if (!nextEra) return false;

    const requirements = ERA_REQUIREMENTS[nextEra];
    if (!requirements) return false;

    // Consume resources for era advancement
    const newResources = { ...state.resources };
    for (const [resource, amount] of Object.entries(requirements.resources)) {
      const key = resource as keyof Resources;
      newResources[key] -= amount ?? 0;
    }

    // Apply era modifier to production
    const modifier = ERA_MODIFIERS[nextEra];
    const newProduction = {
      food: state.production.food * modifier.production,
      wood: state.production.wood * modifier.production,
      stone: state.production.stone * modifier.production,
      gold: state.production.gold * modifier.production,
    };

    set({
      era: nextEra,
      resources: newResources,
      production: newProduction,
    });

    // Chronicle: Register era advancement
    const eraNames = {
      stone: 'Idade da Pedra',
      bronze: 'Idade do Bronze',
      iron: 'Idade do Ferro',
    };
    get().addChronicleEntry({
      type: 'era',
      title: `Avanço para ${eraNames[nextEra]}`,
      description: `A civilização evoluiu para a ${eraNames[nextEra]}, desbloqueando novas tecnologias.`,
      icon: '⚡',
    });

    // Play success sound for era advancement
    soundManager.play('success');

    return true;
  },

  getAvailableBuildings: () => {
    const state = get();
    const availableBuildings: BuildingType[] = [];

    for (const [type, def] of Object.entries(BUILDINGS)) {
      // Skip Town Center (auto-placed)
      if (type === 'town_center') continue;

      // Check if building is available for current era or earlier
      const buildingEraIndex = [Era.Stone, Era.Bronze, Era.Iron].indexOf(def.era);
      const currentEraIndex = [Era.Stone, Era.Bronze, Era.Iron].indexOf(state.era);

      if (buildingEraIndex <= currentEraIndex) {
        availableBuildings.push(type as BuildingType);
      }
    }

    return availableBuildings;
  },
});
