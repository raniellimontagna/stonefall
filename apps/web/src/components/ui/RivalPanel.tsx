/**
 * RivalPanel Component
 * Shows rival info and combat actions
 */

import {
  ATTACK_COST,
  BARRACKS_STRENGTH,
  COMBAT_COOLDOWN,
  DEFEND_COST,
  ERA_NAMES,
  ResourceType,
  TOWER_DEFENSE,
} from '@stonefall/shared';
import { useMemo, useState } from 'react';
import { selectBuildings, selectEra, selectPopulation, useGameStore } from '@/store';
import styles from './RivalPanel.module.css';

export function RivalPanel() {
  const rival = useGameStore((s) => s.rival);
  const combat = useGameStore((s) => s.combat);
  const tick = useGameStore((s) => s.tick);
  const era = useGameStore(selectEra);
  const buildings = useGameStore(selectBuildings);
  const population = useGameStore(selectPopulation);
  const attack = useGameStore((s) => s.attack);
  const defend = useGameStore((s) => s.defend);
  const canAfford = useGameStore((s) => s.canAfford);
  const lastRivalAttack = useGameStore((s) => s.lastRivalAttack);

  // Calculate military from buildings (memoized to avoid infinite loop)
  const military = useMemo(() => {
    let strength = 0;
    let defense = 0;
    for (const building of buildings) {
      if (building.type === 'barracks') strength += BARRACKS_STRENGTH;
      if (building.type === 'defense_tower') defense += TOWER_DEFENSE;
    }
    return { strength, defense };
  }, [buildings]);

  const [lastResult, setLastResult] = useState<string | null>(null);

  const cooldownRemaining = Math.max(0, COMBAT_COOLDOWN - (tick - combat.lastActionTick));
  const canAttack = cooldownRemaining === 0 && canAfford(ATTACK_COST) && !rival.isDefeated;
  const canDefend = cooldownRemaining === 0 && canAfford(DEFEND_COST) && !rival.isDefeated;

  const handleAttack = () => {
    const result = attack();
    if (result) {
      setLastResult(result.message);
    }
  };

  const handleDefend = () => {
    const success = defend();
    if (success) {
      setLastResult('Defesa ativada! +50% defesa por 5 ticks.');
    }
  };

  // Don't show panel in Stone Age (rival is developing)
  if (era === 'stone') {
    return (
      <div className={styles.rivalPanel}>
        <div className={styles.header}>
          <span className={styles.icon}>⚔️</span>
          <span className={styles.title}>Rival</span>
        </div>
        <div className={styles.developing}>
          <p>Uma civilização rival está se desenvolvendo...</p>
          <p className={styles.hint}>Avance para a Idade do Bronze para enfrentá-la.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rivalPanel}>
      <div className={styles.header}>
        <span className={styles.icon}>🏛️</span>
        <span className={styles.title}>{rival.name}</span>
      </div>

      <div className={styles.info}>
        <div className={styles.stat}>
          <span>Era:</span>
          <span>{ERA_NAMES[rival.era]}</span>
        </div>
        <div className={styles.stat}>
          <span>Força:</span>
          <span>{rival.strength}</span>
        </div>
        <div className={styles.stat}>
          <span>Defesa:</span>
          <span>{rival.defense}</span>
        </div>
      </div>

      {/* Rival Population */}
      <div className={styles.stat}>
        <span>👥 Pop. do Rival:</span>
        <span>{rival.population}</span>
      </div>

      {/* Player Military */}
      <div className={styles.military}>
        <span className={styles.militaryTitle}>Sua Civilização</span>

        {/* Player Population */}
        <div className={styles.stat}>
          <span>👥 Sua População:</span>
          <span>
            {population.current}/{population.max}
          </span>
        </div>

        <div className={styles.stat}>
          <span>⚔️ Força:</span>
          <span>{military.strength}</span>
        </div>
        <div className={styles.stat}>
          <span>🛡️ Defesa:</span>
          <span>{military.defense}</span>
        </div>
        {combat.isDefending && tick < combat.defenseEndTick && (
          <div className={styles.defendBuff}>
            🛡️ Defesa ativa! ({combat.defenseEndTick - tick} ticks)
          </div>
        )}
      </div>

      {/* Combat Actions */}
      {!rival.isDefeated && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.attackButton}
            disabled={!canAttack}
            onClick={handleAttack}
          >
            ⚔️ Atacar
            <span className={styles.cost}>
              {ATTACK_COST[ResourceType.Food]}🍖 {ATTACK_COST[ResourceType.Gold]}💰
            </span>
          </button>
          <button
            type="button"
            className={styles.defendButton}
            disabled={!canDefend}
            onClick={handleDefend}
          >
            🛡️ Defender
            <span className={styles.cost}>{DEFEND_COST[ResourceType.Food]}🍖</span>
          </button>
        </div>
      )}

      {/* Cooldown */}
      {cooldownRemaining > 0 && (
        <div className={styles.cooldown}>Cooldown: {cooldownRemaining} ticks</div>
      )}

      {/* Last Result */}
      {lastResult && <div className={styles.result}>{lastResult}</div>}

      {/* Rival Attack Notification */}
      {lastRivalAttack && tick - lastRivalAttack.tick < 10 && (
        <div className={styles.rivalAttack}>
          ⚠️ O rival atacou! -{lastRivalAttack.killed} população
        </div>
      )}

      {/* Victory */}
      {rival.isDefeated && <div className={styles.victory}>🏆 Rival derrotado! Você venceu!</div>}
    </div>
  );
}
