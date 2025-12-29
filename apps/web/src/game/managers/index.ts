export type { PlacementValidation } from './BuildingManager';
export {
  BuildingManager,
  calculateBuildingProduction,
  calculateMaxPopulation,
  createBuilding,
  generateBuildingId,
  getBuildingDefinition,
  validateBuildingPlacement,
} from './BuildingManager';
export type { TickResult } from './ResourceManager';
export {
  calculateNetProduction,
  calculateTickResources,
  formatProductionRate,
  formatResource,
  processTick,
  shouldPopulationDie,
  shouldPopulationGrow,
} from './ResourceManager';
