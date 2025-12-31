/**
 * Store Helpers Tests
 * Tests for utility functions used in store
 */

import type { Building } from '@stonefall/shared';
import { BuildingType } from '@stonefall/shared';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { calculateMaxPopulation, calculateProduction, generateBuildingId } from './helpers';

describe('Store Helpers', () => {
  describe('generateBuildingId', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should generate unique IDs', () => {
      const id1 = generateBuildingId();
      const id2 = generateBuildingId();

      expect(id1).not.toBe(id2);
    });

    it('should start with building_ prefix', () => {
      const id = generateBuildingId();

      expect(id).toMatch(/^building_/);
    });

    it('should contain timestamp', () => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890);

      const id = generateBuildingId();

      expect(id).toContain('1234567890');
    });
  });

  describe('calculateProduction', () => {
    it('should return zero production for empty buildings', () => {
      const result = calculateProduction([]);

      expect(result).toEqual({ food: 0, wood: 0, stone: 0, gold: 0 });
    });

    it('should calculate production for a single farm', () => {
      const buildings: Building[] = [
        { id: 'test1', type: BuildingType.Farm, position: { col: 0, row: 0 }, hp: 50, maxHp: 50 },
      ];

      const result = calculateProduction(buildings);

      expect(result.food).toBeGreaterThan(0);
    });

    it('should calculate production for sawmill', () => {
      const buildings: Building[] = [
        {
          id: 'test1',
          type: BuildingType.Sawmill,
          position: { col: 0, row: 0 },
          hp: 75,
          maxHp: 75,
        },
      ];

      const result = calculateProduction(buildings);

      expect(result.wood).toBeGreaterThan(0);
    });

    it('should calculate production for mine', () => {
      const buildings: Building[] = [
        { id: 'test1', type: BuildingType.Mine, position: { col: 0, row: 0 }, hp: 100, maxHp: 100 },
      ];

      const result = calculateProduction(buildings);

      expect(result.stone).toBeGreaterThan(0);
    });

    it('should sum production from multiple buildings', () => {
      const buildings: Building[] = [
        { id: 'test1', type: BuildingType.Farm, position: { col: 0, row: 0 }, hp: 50, maxHp: 50 },
        { id: 'test2', type: BuildingType.Farm, position: { col: 1, row: 0 }, hp: 50, maxHp: 50 },
      ];

      const singleFarm = calculateProduction([buildings[0]!]);
      const twoFarms = calculateProduction(buildings);

      expect(twoFarms.food).toBe(singleFarm.food * 2);
    });

    it('should handle buildings without production', () => {
      const buildings: Building[] = [
        {
          id: 'test1',
          type: BuildingType.House,
          position: { col: 0, row: 0 },
          hp: 100,
          maxHp: 100,
        },
      ];

      const result = calculateProduction(buildings);

      expect(result.food).toBe(0);
      expect(result.wood).toBe(0);
    });
  });

  describe('calculateMaxPopulation', () => {
    it('should return base max population for empty buildings', () => {
      const result = calculateMaxPopulation([]);

      expect(result).toBe(10); // BASE_MAX_POPULATION
    });

    it('should add population bonus from houses', () => {
      const buildings: Building[] = [
        {
          id: 'test1',
          type: BuildingType.House,
          position: { col: 0, row: 0 },
          hp: 100,
          maxHp: 100,
        },
      ];

      const result = calculateMaxPopulation(buildings);

      expect(result).toBeGreaterThan(10); // BASE + house bonus
    });

    it('should sum population from multiple houses', () => {
      const buildings: Building[] = [
        {
          id: 'test1',
          type: BuildingType.House,
          position: { col: 0, row: 0 },
          hp: 100,
          maxHp: 100,
        },
        {
          id: 'test2',
          type: BuildingType.House,
          position: { col: 1, row: 0 },
          hp: 100,
          maxHp: 100,
        },
      ];

      const singleHouse = calculateMaxPopulation([buildings[0]!]);
      const twoHouses = calculateMaxPopulation(buildings);

      expect(twoHouses).toBeGreaterThan(singleHouse);
    });

    it('should include town center population bonus', () => {
      const buildings: Building[] = [
        {
          id: 'test1',
          type: BuildingType.TownCenter,
          position: { col: 5, row: 5 },
          hp: 500,
          maxHp: 500,
        },
      ];

      const result = calculateMaxPopulation(buildings);

      expect(result).toBeGreaterThan(10); // Includes initial bonus
    });
  });
});
