/**
 * Combat Constants Tests
 * Tests for combat-related constants and configurations
 */
import { describe, expect, it } from 'vitest';
import { Era, ResourceType } from '../types/game';
import {
  ATTACK_COST,
  BARRACKS_STRENGTH,
  COMBAT_COOLDOWN,
  DEFEND_COST,
  DEFEND_DURATION,
  ERA_MILITARY_BASE,
  RIVAL_DEFENSE,
  RIVAL_ERA_ADVANCE_TICKS,
  RIVAL_NAMES,
  RIVAL_STRENGTH,
  TOWER_DEFENSE,
} from './combat';

describe('Combat Constants', () => {
  describe('ATTACK_COST', () => {
    it('should require food to attack', () => {
      expect(ATTACK_COST[ResourceType.Food]).toBeDefined();
      expect(ATTACK_COST[ResourceType.Food]).toBeGreaterThan(0);
    });

    it('should require gold to attack', () => {
      expect(ATTACK_COST[ResourceType.Gold]).toBeDefined();
      expect(ATTACK_COST[ResourceType.Gold]).toBeGreaterThan(0);
    });
  });

  describe('DEFEND_COST', () => {
    it('should require only food to defend', () => {
      expect(DEFEND_COST[ResourceType.Food]).toBeDefined();
      expect(DEFEND_COST[ResourceType.Food]).toBeGreaterThan(0);
    });

    it('should be cheaper than attack', () => {
      const attackFood = ATTACK_COST[ResourceType.Food] ?? 0;
      const defendFood = DEFEND_COST[ResourceType.Food] ?? 0;
      expect(defendFood).toBeLessThan(attackFood);
    });
  });

  describe('Cooldowns', () => {
    it('should have positive combat cooldown', () => {
      expect(COMBAT_COOLDOWN).toBeGreaterThan(0);
    });

    it('should have positive defend duration', () => {
      expect(DEFEND_DURATION).toBeGreaterThan(0);
    });
  });

  describe('Military Buildings', () => {
    it('should have positive barracks strength', () => {
      expect(BARRACKS_STRENGTH).toBeGreaterThan(0);
    });

    it('should have positive tower defense', () => {
      expect(TOWER_DEFENSE).toBeGreaterThan(0);
    });
  });

  describe('ERA_MILITARY_BASE', () => {
    it('should have values for all eras', () => {
      expect(ERA_MILITARY_BASE[Era.Stone]).toBeDefined();
      expect(ERA_MILITARY_BASE[Era.Bronze]).toBeDefined();
      expect(ERA_MILITARY_BASE[Era.Iron]).toBeDefined();
    });

    it('should have increasing strength per era', () => {
      expect(ERA_MILITARY_BASE[Era.Bronze].strength).toBeGreaterThan(
        ERA_MILITARY_BASE[Era.Stone].strength
      );
      expect(ERA_MILITARY_BASE[Era.Iron].strength).toBeGreaterThan(
        ERA_MILITARY_BASE[Era.Bronze].strength
      );
    });

    it('should have increasing defense per era', () => {
      expect(ERA_MILITARY_BASE[Era.Bronze].defense).toBeGreaterThan(
        ERA_MILITARY_BASE[Era.Stone].defense
      );
      expect(ERA_MILITARY_BASE[Era.Iron].defense).toBeGreaterThan(
        ERA_MILITARY_BASE[Era.Bronze].defense
      );
    });
  });

  describe('RIVAL_STRENGTH', () => {
    it('should have values for all eras', () => {
      expect(RIVAL_STRENGTH[Era.Stone]).toBeDefined();
      expect(RIVAL_STRENGTH[Era.Bronze]).toBeDefined();
      expect(RIVAL_STRENGTH[Era.Iron]).toBeDefined();
    });

    it('should increase with era', () => {
      expect(RIVAL_STRENGTH[Era.Bronze]).toBeGreaterThan(RIVAL_STRENGTH[Era.Stone]);
      expect(RIVAL_STRENGTH[Era.Iron]).toBeGreaterThan(RIVAL_STRENGTH[Era.Bronze]);
    });
  });

  describe('RIVAL_DEFENSE', () => {
    it('should have values for all eras', () => {
      expect(RIVAL_DEFENSE[Era.Stone]).toBeDefined();
      expect(RIVAL_DEFENSE[Era.Bronze]).toBeDefined();
      expect(RIVAL_DEFENSE[Era.Iron]).toBeDefined();
    });

    it('should increase with era', () => {
      expect(RIVAL_DEFENSE[Era.Bronze]).toBeGreaterThan(RIVAL_DEFENSE[Era.Stone]);
      expect(RIVAL_DEFENSE[Era.Iron]).toBeGreaterThan(RIVAL_DEFENSE[Era.Bronze]);
    });
  });

  describe('RIVAL_ERA_ADVANCE_TICKS', () => {
    it('should be a positive number', () => {
      expect(RIVAL_ERA_ADVANCE_TICKS).toBeGreaterThan(0);
    });
  });

  describe('RIVAL_NAMES', () => {
    it('should have at least one name', () => {
      expect(RIVAL_NAMES.length).toBeGreaterThan(0);
    });

    it('should have non-empty strings', () => {
      for (const name of RIVAL_NAMES) {
        expect(name.length).toBeGreaterThan(0);
      }
    });
  });
});
