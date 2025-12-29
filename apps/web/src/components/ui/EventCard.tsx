/**
 * EventCard Component
 * Modal display for game events with player choices
 */

import type { EventChoice, EventEffect, GameEvent } from '@stonefall/shared';
import { useCallback, useMemo } from 'react';
import { selectPendingEvent, selectResources, useGameStore } from '../../store/gameStore';
import styles from './EventCard.module.css';

// =============================================================================
// HELPERS
// =============================================================================

/** Get icon for event type */
const getEventIcon = (event: GameEvent): string => {
  if (event.icon) return event.icon;

  const icons: Record<string, string> = {
    economic: '🌾',
    social: '👥',
    natural: '🌋',
    military: '⚔️',
    political: '🏛️',
  };

  return icons[event.type] || '📜';
};

/** Format effect for display */
const formatEffect = (effect: EventEffect): string => {
  const targetLabels: Record<string, string> = {
    food: '🍖 Comida',
    wood: '🪵 Madeira',
    stone: '🪨 Pedra',
    gold: '🪙 Ouro',
    current: '👤 População',
    max: '👥 Pop. Máx',
    strength: '⚔️ Força',
    defense: '🛡️ Defesa',
  };

  const label = targetLabels[effect.target] || effect.target;
  const sign = effect.value >= 0 ? '+' : '';
  const suffix = effect.isPercentage ? '%' : '';

  return `${label}: ${sign}${effect.value}${suffix}`;
};

/** Check if player can afford choice requirements */
const canAffordChoice = (choice: EventChoice, resources: Record<string, number>): boolean => {
  if (!choice.requirements) return true;

  for (const [key, value] of Object.entries(choice.requirements)) {
    const resourceValue = resources[key];
    if (value !== undefined && resourceValue !== undefined && resourceValue < value) {
      return false;
    }
  }

  return true;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const EventCard = () => {
  const pendingEvent = useGameStore(selectPendingEvent);
  const resources = useGameStore(selectResources);
  const resolveEvent = useGameStore((state) => state.resolveEvent);

  const resourcesRecord = useMemo(
    () => ({
      food: resources.food,
      wood: resources.wood,
      stone: resources.stone,
      gold: resources.gold,
    }),
    [resources]
  );

  const handleChoice = useCallback(
    (choiceId: string) => {
      resolveEvent(choiceId);
    },
    [resolveEvent]
  );

  if (!pendingEvent) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.icon}>{getEventIcon(pendingEvent)}</span>
          <h2 className={styles.title}>{pendingEvent.title}</h2>
        </div>

        {/* Description */}
        <p className={styles.description}>{pendingEvent.description}</p>

        {/* Choices */}
        <div className={styles.choices}>
          {pendingEvent.choices.map((choice) => {
            const canAfford = canAffordChoice(choice, resourcesRecord);

            return (
              <button
                type="button"
                key={choice.id}
                className={`${styles.choice} ${!canAfford ? styles.choiceDisabled : ''}`}
                onClick={() => canAfford && handleChoice(choice.id)}
                disabled={!canAfford}
              >
                <div className={styles.choiceText}>{choice.text}</div>
                <div className={styles.choiceEffects}>
                  {choice.effects.map((effect, index) => (
                    <span
                      key={`${effect.type}-${effect.target}-${index}`}
                      className={`${styles.effect} ${
                        effect.value > 0
                          ? styles.effectPositive
                          : effect.value < 0
                            ? styles.effectNegative
                            : styles.effectNeutral
                      }`}
                    >
                      {formatEffect(effect)}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Event type label */}
        <div className={styles.eventType}>{pendingEvent.type}</div>
      </div>
    </div>
  );
};

export default EventCard;
