/**
 * Rival Types
 * Types for rival civilization and military status
 */

import type { Era } from './game';

/** Rival civilization state */
export interface RivalState {
  name: string;
  era: Era;
  strength: number;
  defense: number;
  population: number;
  isDefeated: boolean;
}

/** Player military status - calculated from buildings */
export interface MilitaryStatus {
  strength: number; // From Barracks
  defense: number; // From Defense Towers
}
