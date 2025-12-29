/**
 * Combat Types
 * Types for combat actions and results
 */

/** Combat actions available to player */
export type CombatAction = 'attack' | 'defend';

/** Result of a combat action */
export interface CombatResult {
  action: CombatAction;
  success: boolean;
  playerDamage: number;
  rivalDamage: number;
  message: string;
}

/** Combat state stored in game */
export interface CombatState {
  lastActionTick: number;
  isDefending: boolean;
  defenseEndTick: number;
}
