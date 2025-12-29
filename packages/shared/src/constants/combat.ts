/**
 * Combat Constants
 * Values for combat system
 */

import type { Resources } from '../types/game';
import { Era, ResourceType } from '../types/game';

// =============================================================================
// COMBAT COSTS
// =============================================================================

/** Cost to attack rival */
export const ATTACK_COST: Partial<Resources> = {
  [ResourceType.Food]: 15,
  [ResourceType.Gold]: 5,
};

/** Cost to defend */
export const DEFEND_COST: Partial<Resources> = {
  [ResourceType.Food]: 10,
};

// =============================================================================
// COOLDOWNS (in ticks)
// =============================================================================

/** Cooldown between combat actions */
export const COMBAT_COOLDOWN = 10;

/** Duration of defend buff */
export const DEFEND_DURATION = 5;

// =============================================================================
// MILITARY
// =============================================================================

/** Strength per Barracks */
export const BARRACKS_STRENGTH = 25;

/** Defense per Defense Tower */
export const TOWER_DEFENSE = 20;

/** Base military values per era */
export const ERA_MILITARY_BASE: Record<Era, { strength: number; defense: number }> = {
  [Era.Stone]: { strength: 10, defense: 10 },
  [Era.Bronze]: { strength: 30, defense: 30 },
  [Era.Iron]: { strength: 60, defense: 60 },
};

// =============================================================================
// RIVAL
// =============================================================================

/** Rival strength per era */
export const RIVAL_STRENGTH: Record<Era, number> = {
  [Era.Stone]: 15,
  [Era.Bronze]: 40,
  [Era.Iron]: 80,
};

/** Rival defense per era */
export const RIVAL_DEFENSE: Record<Era, number> = {
  [Era.Stone]: 10,
  [Era.Bronze]: 35,
  [Era.Iron]: 70,
};

/** Ticks for rival to advance era (simulated) */
export const RIVAL_ERA_ADVANCE_TICKS = 300;

/** Rival names pool */
export const RIVAL_NAMES = [
  'Os Ferringos',
  'Clã da Serpente',
  'Tribo do Trovão',
  'Povo das Sombras',
  'Império Dourado',
];
