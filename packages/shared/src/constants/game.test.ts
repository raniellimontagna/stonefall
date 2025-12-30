/**
 * Game Constants Tests
 * Tests for game balance constants
 */

import { describe, expect, it } from 'vitest';
import { BuildingType, Era, ResourceType, TileType } from '../types/game';
import {
  BUILDINGS,
  ERA_REQUIREMENTS,
  INITIAL_POPULATION,
  INITIAL_RESOURCES,
  NEXT_ERA,
  TILE_WEIGHTS,
} from './game';

describe('Game Constants', () => {
  describe('INITIAL_RESOURCES', () => {
    it('should have all resource types defined', () => {
      expect(INITIAL_RESOURCES[ResourceType.Food]).toBeDefined();
      expect(INITIAL_RESOURCES[ResourceType.Wood]).toBeDefined();
      expect(INITIAL_RESOURCES[ResourceType.Stone]).toBeDefined();
      expect(INITIAL_RESOURCES[ResourceType.Gold]).toBeDefined();
    });

    it('should have positive starting food', () => {
      expect(INITIAL_RESOURCES[ResourceType.Food]).toBeGreaterThan(0);
    });

    it('should start with 0 gold', () => {
      expect(INITIAL_RESOURCES[ResourceType.Gold]).toBe(0);
    });
  });

  describe('INITIAL_POPULATION', () => {
    it('should be a positive number', () => {
      expect(INITIAL_POPULATION).toBeGreaterThan(0);
    });
  });

  describe('TILE_WEIGHTS', () => {
    it('should have weights for all tile types', () => {
      for (const tileType of Object.values(TileType)) {
        expect(TILE_WEIGHTS[tileType]).toBeDefined();
      }
    });

    it('should have plains as most common tile', () => {
      expect(TILE_WEIGHTS[TileType.Plains]).toBeGreaterThan(TILE_WEIGHTS[TileType.Forest]);
      expect(TILE_WEIGHTS[TileType.Plains]).toBeGreaterThan(TILE_WEIGHTS[TileType.Mountain]);
    });
  });

  describe('BUILDINGS', () => {
    it('should have all building types defined', () => {
      for (const buildingType of Object.values(BuildingType)) {
        expect(BUILDINGS[buildingType]).toBeDefined();
      }
    });

    it('should have TownCenter with limit of 1', () => {
      expect(BUILDINGS[BuildingType.TownCenter].limit).toBe(1);
    });

    it('should have Farm produce food', () => {
      const farm = BUILDINGS[BuildingType.Farm];
      expect(farm.production[ResourceType.Food]).toBeGreaterThan(0);
    });

    it('should have Stone Age buildings cost no gold', () => {
      const stoneAgeBuildings = Object.values(BUILDINGS).filter((b) => b.era === Era.Stone);

      for (const building of stoneAgeBuildings) {
        expect(building.cost[ResourceType.Gold] ?? 0).toBe(0);
      }
    });
  });

  describe('ERA_REQUIREMENTS', () => {
    it('should have no requirements for Stone Age', () => {
      expect(ERA_REQUIREMENTS[Era.Stone]).toBeNull();
    });

    it('should require resources for Bronze Age', () => {
      const bronzeReq = ERA_REQUIREMENTS[Era.Bronze];
      expect(bronzeReq).not.toBeNull();
      expect(bronzeReq?.resources[ResourceType.Stone]).toBeGreaterThan(0);
    });

    it('should require higher population for later eras', () => {
      const bronzeReq = ERA_REQUIREMENTS[Era.Bronze];
      const ironReq = ERA_REQUIREMENTS[Era.Iron];

      expect(bronzeReq?.population).toBeLessThan(ironReq?.population ?? 0);
    });
  });

  describe('NEXT_ERA', () => {
    it('should progress Stone -> Bronze -> Iron', () => {
      expect(NEXT_ERA[Era.Stone]).toBe(Era.Bronze);
      expect(NEXT_ERA[Era.Bronze]).toBe(Era.Iron);
    });

    it('should have no era after Iron', () => {
      expect(NEXT_ERA[Era.Iron]).toBeNull();
    });
  });
});
