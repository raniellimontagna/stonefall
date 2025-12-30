/**
 * Combat Slice
 * Manages combat, rival, and military
 */

import type { CombatResult, MilitaryStatus, RivalState } from '@stonefall/shared';
import {
  ATTACK_COST,
  BARRACKS_STRENGTH,
  COMBAT_COOLDOWN,
  DEFEND_COST,
  DEFEND_DURATION,
  Era,
  RIVAL_DEFENSE,
  RIVAL_NAMES,
  RIVAL_STRENGTH,
  TOWER_DEFENSE,
} from '@stonefall/shared';
import { soundManager } from '@/game/SoundManager';
import type { SliceCreator } from '../types';

export interface CombatSlice {
  // State
  rival: RivalState;
  military: MilitaryStatus;
  combat: {
    lastActionTick: number;
    isDefending: boolean;
    defenseEndTick: number;
  };
  lastRivalAttack: { tick: number; killed: number } | null;

  // Actions
  attack: () => CombatResult | null;
  defend: () => boolean;
  calculateMilitary: () => MilitaryStatus;
}

export const createCombatSlice: SliceCreator<CombatSlice> = (set, get) => ({
  // Initial state
  rival: {
    name: RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)] ?? 'Os Ferringos',
    era: Era.Stone,
    strength: RIVAL_STRENGTH[Era.Stone],
    defense: RIVAL_DEFENSE[Era.Stone],
    population: 25, // Initial rival population (balanced)
    isDefeated: false,
  },
  military: {
    strength: 0,
    defense: 0,
  },
  combat: {
    lastActionTick: 0,
    isDefending: false,
    defenseEndTick: 0,
  },
  lastRivalAttack: null,

  // Actions
  calculateMilitary: () => {
    const state = get();
    let strength = 0;
    let defense = 0;

    for (const building of state.buildings) {
      if (building.type === 'barracks') {
        strength += BARRACKS_STRENGTH;
      }
      if (building.type === 'defense_tower') {
        defense += TOWER_DEFENSE;
      }
    }

    return { strength, defense };
  },

  attack: () => {
    const state = get();

    // Check cooldown
    if (state.tick - state.combat.lastActionTick < COMBAT_COOLDOWN) {
      return null;
    }

    // Check cost
    if (!get().canAfford(ATTACK_COST)) {
      return null;
    }

    // Check if rival already defeated
    if (state.rival.isDefeated) {
      return null;
    }

    // Subtract cost
    get().subtractResources(ATTACK_COST);

    // Calculate population killed
    const military = get().calculateMilitary();
    const playerPower = military.strength * (0.8 + Math.random() * 0.4);
    const rivalDefense = state.rival.defense * (0.8 + Math.random() * 0.4);

    // Kill 1-5 population based on power difference
    const populationKilled = Math.max(1, Math.floor((playerPower - rivalDefense / 2) / 10));
    const newRivalPopulation = Math.max(0, state.rival.population - populationKilled);
    const isDefeated = newRivalPopulation <= 0;

    set({
      combat: {
        ...state.combat,
        lastActionTick: state.tick,
      },
      rival: {
        ...state.rival,
        population: newRivalPopulation,
        isDefeated,
      },
      gameOver: isDefeated ? 'victory' : null,
      // Update statistics
      statistics: {
        ...state.statistics,
        totalBattles: state.statistics.totalBattles + 1,
        battlesWon: isDefeated ? state.statistics.battlesWon + 1 : state.statistics.battlesWon,
      },
    });

    // Chronicle: Register significant battles
    if (populationKilled >= 3 || isDefeated) {
      get().addChronicleEntry({
        type: 'combat',
        title: isDefeated ? `Vitória sobre ${state.rival.name}` : 'Batalha Sangrenta',
        description: isDefeated
          ? `Derrotou completamente ${state.rival.name}, conquistando a vitória final!`
          : `Ataque devastador matou ${populationKilled} da população inimiga.`,
        icon: '⚔️',
      });
    }

    // Play battle sound
    soundManager.play('battle');

    return {
      action: 'attack' as const,
      success: populationKilled > 0,
      playerDamage: 0,
      rivalDamage: populationKilled,
      message: isDefeated
        ? `Vitória! ${state.rival.name} foi derrotado!`
        : `Você matou ${populationKilled} da população inimiga!`,
    };
  },

  defend: () => {
    const state = get();

    // Check cooldown
    if (state.tick - state.combat.lastActionTick < COMBAT_COOLDOWN) {
      return false;
    }

    // Check cost
    if (!get().canAfford(DEFEND_COST)) {
      return false;
    }

    // Subtract cost
    get().subtractResources(DEFEND_COST);

    set({
      combat: {
        lastActionTick: state.tick,
        isDefending: true,
        defenseEndTick: state.tick + DEFEND_DURATION,
      },
    });

    // Play battle sound for defense
    soundManager.play('battle');

    return true;
  },
});
