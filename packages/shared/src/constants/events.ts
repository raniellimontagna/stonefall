/**
 * Event Constants
 * Configuration and fallback data for the event system
 */

import type { EventFrequency, EventType, GameEvent } from '../types/events';
import { Era } from '../types/game';

// =============================================================================
// EVENT FREQUENCY
// =============================================================================

/** Event frequency by era */
export const EVENT_FREQUENCY: Record<Era, EventFrequency> = {
  [Era.Stone]: {
    minInterval: 30,
    maxInterval: 50,
    chancePerTick: 0.025, // 2.5%
  },
  [Era.Bronze]: {
    minInterval: 20,
    maxInterval: 40,
    chancePerTick: 0.04, // 4%
  },
  [Era.Iron]: {
    minInterval: 15,
    maxInterval: 30,
    chancePerTick: 0.05, // 5%
  },
};

/** Minimum ticks between events */
export const MIN_TICKS_BETWEEN_EVENTS = 15;

// =============================================================================
// EVENT TYPE ICONS
// =============================================================================

export const EVENT_TYPE_ICONS: Record<EventType, string> = {
  economic: '🌾',
  social: '👥',
  natural: '🌋',
  military: '⚔️',
  political: '🏛️',
};

// =============================================================================
// FALLBACK EVENTS
// =============================================================================

/**
 * Fallback events for offline mode or when AI fails
 * These provide a baseline game experience without AI
 */
export const FALLBACK_EVENTS: GameEvent[] = [
  // === ECONOMIC EVENTS ===
  {
    id: 'fallback_abundant_harvest',
    type: 'economic',
    title: 'Colheita Abundante',
    description:
      'Os campos produziram mais do que o esperado este ciclo. Seus celeiros transbordam com grãos dourados.',
    icon: '🌾',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'celebrate',
        text: 'Celebrar com um festival',
        effects: [
          { type: 'resource', target: 'food', value: 40 },
          { type: 'population', target: 'current', value: 1 },
        ],
      },
      {
        id: 'store',
        text: 'Armazenar para tempos difíceis',
        effects: [{ type: 'resource', target: 'food', value: 60 }],
      },
    ],
  },
  {
    id: 'fallback_drought',
    type: 'economic',
    title: 'Seca Severa',
    description:
      'O sol inclemente castiga suas terras há semanas. As plantações murcham e a água escasseia.',
    icon: '☀️',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'ration',
        text: 'Racionar comida severamente',
        effects: [{ type: 'resource', target: 'food', value: -25 }],
      },
      {
        id: 'search_water',
        text: 'Enviar exploradores para encontrar água',
        effects: [
          { type: 'resource', target: 'food', value: -15 },
          { type: 'resource', target: 'wood', value: 20 },
        ],
      },
    ],
  },
  {
    id: 'fallback_resource_discovery',
    type: 'economic',
    title: 'Descoberta de Recursos',
    description: 'Exploradores encontraram um depósito rico em materiais próximo ao assentamento.',
    icon: '💎',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'mine_stone',
        text: 'Extrair pedra do local',
        effects: [{ type: 'resource', target: 'stone', value: 30 }],
      },
      {
        id: 'harvest_wood',
        text: 'Coletar madeira da área',
        effects: [{ type: 'resource', target: 'wood', value: 35 }],
      },
    ],
  },
  {
    id: 'fallback_plague',
    type: 'economic',
    title: 'Praga nas Plantações',
    description: 'Uma nuvem de gafanhotos desceu sobre os campos, devorando tudo em seu caminho.',
    icon: '🦗',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'burn_fields',
        text: 'Queimar os campos infectados',
        effects: [
          { type: 'resource', target: 'food', value: -40 },
          { type: 'resource', target: 'wood', value: -10 },
        ],
      },
      {
        id: 'wait',
        text: 'Esperar a praga passar',
        effects: [{ type: 'resource', target: 'food', value: -60 }],
      },
    ],
  },
  // === SOCIAL EVENTS ===
  {
    id: 'fallback_festival',
    type: 'social',
    title: 'Festival da Colheita',
    description: 'O povo deseja celebrar a abundância com música e dança. O moral está alto.',
    icon: '🎉',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'grand_feast',
        text: 'Organizar um grande banquete',
        effects: [
          { type: 'resource', target: 'food', value: -30 },
          { type: 'population', target: 'current', value: 2 },
        ],
      },
      {
        id: 'modest_celebration',
        text: 'Celebração modesta',
        effects: [
          { type: 'resource', target: 'food', value: -10 },
          { type: 'population', target: 'current', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'fallback_migration',
    type: 'social',
    title: 'Migrantes Chegam',
    description:
      'Um grupo de famílias nômades pede abrigo em seu assentamento. Parecem trabalhadores habilidosos.',
    icon: '🚶',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'welcome',
        text: 'Acolhê-los de braços abertos',
        effects: [
          { type: 'population', target: 'current', value: 3 },
          { type: 'resource', target: 'food', value: -20 },
        ],
      },
      {
        id: 'reject',
        text: 'Recusar entrada',
        effects: [{ type: 'resource', target: 'wood', value: 15 }],
      },
    ],
  },
  {
    id: 'fallback_disease',
    type: 'social',
    title: 'Doença se Espalha',
    description:
      'Uma febre misteriosa começou a afetar os habitantes. Os curandeiros estão preocupados.',
    icon: '🤒',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'quarantine',
        text: 'Isolar os doentes',
        effects: [
          { type: 'population', target: 'current', value: -1 },
          { type: 'resource', target: 'food', value: -10 },
        ],
      },
      {
        id: 'herbal_remedy',
        text: 'Buscar ervas medicinais',
        effects: [
          { type: 'resource', target: 'wood', value: -15 },
          { type: 'resource', target: 'food', value: -5 },
        ],
      },
    ],
  },
  // === NATURAL EVENTS ===
  {
    id: 'fallback_storm',
    type: 'natural',
    title: 'Tempestade Violenta',
    description: 'Nuvens escuras se aproximam. Trovões ecoam ao longe e o vento começa a uivar.',
    icon: '⛈️',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'reinforce',
        text: 'Reforçar as estruturas',
        effects: [{ type: 'resource', target: 'wood', value: -20 }],
      },
      {
        id: 'shelter',
        text: 'Apenas buscar abrigo',
        effects: [
          { type: 'resource', target: 'wood', value: -30 },
          { type: 'resource', target: 'food', value: -10 },
        ],
      },
    ],
  },
  {
    id: 'fallback_fire',
    type: 'natural',
    title: 'Incêndio Florestal',
    description:
      'Fumaça sobe das florestas próximas. Um incêndio ameaça se espalhar para o assentamento.',
    icon: '🔥',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'fight_fire',
        text: 'Combater o fogo',
        effects: [
          { type: 'resource', target: 'food', value: -15 },
          { type: 'resource', target: 'wood', value: -10 },
        ],
      },
      {
        id: 'evacuate',
        text: 'Evacuar e esperar',
        effects: [{ type: 'resource', target: 'wood', value: -40 }],
      },
    ],
  },
  {
    id: 'fallback_earthquake',
    type: 'natural',
    title: 'Tremor de Terra',
    description: 'A terra tremeu durante a noite. Algumas construções foram danificadas.',
    icon: '🌍',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'repair',
        text: 'Reparar imediatamente',
        effects: [
          { type: 'resource', target: 'stone', value: -20 },
          { type: 'resource', target: 'wood', value: -15 },
        ],
      },
      {
        id: 'assess',
        text: 'Avaliar danos primeiro',
        effects: [
          { type: 'resource', target: 'stone', value: -10 },
          { type: 'resource', target: 'food', value: -10 },
        ],
      },
    ],
  },
  {
    id: 'fallback_good_weather',
    type: 'natural',
    title: 'Clima Favorável',
    description:
      'O tempo está perfeito para trabalhar. O céu azul e a brisa suave inspiram seu povo.',
    icon: '☀️',
    triggeredAt: 0,
    era: Era.Stone,
    choices: [
      {
        id: 'farm_focus',
        text: 'Focar nas plantações',
        effects: [{ type: 'resource', target: 'food', value: 25 }],
      },
      {
        id: 'build_focus',
        text: 'Focar nas construções',
        effects: [
          { type: 'resource', target: 'wood', value: 15 },
          { type: 'resource', target: 'stone', value: 10 },
        ],
      },
    ],
  },
];

/** Get a random fallback event */
export function getRandomFallbackEvent(era: Era): GameEvent {
  // Filter events appropriate for the era
  const availableEvents = FALLBACK_EVENTS.filter(
    (event) => event.era === Era.Stone || event.era === era
  );

  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  const event = availableEvents[randomIndex] ?? FALLBACK_EVENTS[0];

  // Return a copy with a new unique ID (non-null assertion safe due to fallback)
  return {
    ...event!,
    id: `${event!.id}_${Date.now()}`,
  };
}

/** Get event type weights based on game state */
export function getEventWeights(
  foodAmount: number,
  population: number,
  era: Era
): Record<EventType, number> {
  return {
    economic: foodAmount < 50 ? 3 : 1,
    social: population > 15 ? 2 : 1,
    natural: 1,
    military: era !== Era.Stone ? 2 : 0,
    political: era === Era.Iron ? 2 : 0,
  };
}

/** Select a random event type based on weights */
export function selectEventType(weights: Record<EventType, number>): EventType {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const [type, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return type as EventType;
    }
  }

  return 'economic'; // Default fallback
}
