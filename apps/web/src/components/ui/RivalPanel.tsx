import { Cloud, Cup, DangerTriangle, Fire, Shield } from '@solar-icons/react';
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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { selectBuildings, selectEra, useGameStore } from '@/store';

interface RivalPanelProps {
  mobile?: boolean;
}

export function RivalPanel({ mobile }: RivalPanelProps) {
  const rival = useGameStore((s) => s.rival);
  const combat = useGameStore((s) => s.combat);
  const tick = useGameStore((s) => s.tick);
  const era = useGameStore(selectEra);
  const buildings = useGameStore(selectBuildings);

  const attack = useGameStore((s) => s.attack);
  const defend = useGameStore((s) => s.defend);
  const canAfford = useGameStore((s) => s.canAfford);
  const lastRivalAttack = useGameStore((s) => s.lastRivalAttack);

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
    if (result) setLastResult(result.message);
  };

  const handleDefend = () => {
    const success = defend();
    if (success) setLastResult('Defesa ativada! +50% defesa por 5 ticks.');
  };

  if (era === 'stone') {
    return (
      <div
        className={cn(
          'flex flex-col gap-3 p-6 text-center opacity-70 bg-stone-900/40 rounded-xl border border-stone-800/50 backdrop-blur-sm',
          mobile ? 'w-full' : ''
        )}
      >
        <div className="flex justify-center text-stone-600">
          <Cloud size={48} weight="Bold" />
        </div>
        <h3 className="text-xl font-bold text-stone-400 drop-shadow-sm">Unknown Rival</h3>
        <p className="text-sm text-stone-500 max-w-[200px] mx-auto">
          Advance to Bronze Age to discover nearby civilizations.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4', mobile ? 'w-full' : '')}>
      {!mobile && (
        <h3 className="text-xl font-bold flex items-center gap-2 text-red-400 drop-shadow-md">
          {/* Attempting to use Swords if available, otherwise fallback to Fire in mind, but import is speculative. 
              If Swords fails, I'll switch to Fire. */}
          <Fire size={24} weight="Bold" className="text-red-500" />
          <span>Warfare</span>
        </h3>
      )}

      {/* Rival Card */}
      <Card
        variant="glass"
        className="bg-gradient-to-br from-red-950/40 to-stone-900/60 border-red-900/30 backdrop-blur-md shadow-xl"
      >
        <div className="flex justify-between items-center mb-4 px-1">
          <h4 className="font-bold text-red-200 flex items-center gap-2 text-lg drop-shadow-md">
            <DangerTriangle size={24} weight="Bold" className="text-red-500" />
            {rival.name}
          </h4>
          <span className="text-xs font-mono font-bold bg-stone-950/50 border border-stone-800 px-2 py-1 rounded text-stone-400 uppercase tracking-wider">
            {ERA_NAMES[rival.era]}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
          <div className="bg-stone-900/40 rounded-lg p-2 border border-red-900/10">
            <div className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              Str
            </div>
            <div className="font-bold text-red-400 text-lg font-mono">{rival.strength}</div>
          </div>
          <div className="bg-stone-900/40 rounded-lg p-2 border border-blue-900/10">
            <div className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              Def
            </div>
            <div className="font-bold text-blue-400 text-lg font-mono">{rival.defense}</div>
          </div>
          <div className="bg-stone-900/40 rounded-lg p-2 border border-yellow-900/10">
            <div className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              Pop
            </div>
            <div className="font-bold text-yellow-400 text-lg font-mono">{rival.population}</div>
          </div>
        </div>

        {rival.isDefeated ? (
          <div className="bg-gold-main/10 text-gold-main font-bold text-center p-4 rounded-xl border border-gold-main/30 flex flex-col items-center gap-2 animate-in fade-in zoom-in">
            <Cup size={32} weight="Bold" className="text-gold-main drop-shadow-lg" />
            <span className="tracking-widest">VICTORY</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button
              variant="danger"
              size="sm"
              disabled={!canAttack}
              onClick={handleAttack}
              className="w-full justify-between h-auto py-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-colors" />
              <span className="flex items-center gap-2 relative z-10">
                <Fire
                  size={18}
                  weight="Bold"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-bold tracking-wide">Attack</span>
              </span>
              <span className="text-xs opacity-90 flex gap-2 font-mono relative z-10 bg-black/20 px-1.5 py-0.5 rounded">
                <span className="flex items-center gap-1">
                  {ATTACK_COST[ResourceType.Food]} <Icon name="food" size="sm" />
                </span>
                <span className="flex items-center gap-1 text-yellow-300">
                  {ATTACK_COST[ResourceType.Gold]} <Icon name="gold" size="sm" />
                </span>
              </span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={!canDefend}
              onClick={handleDefend}
              className="w-full justify-between h-auto py-2 group"
            >
              <span className="flex items-center gap-2">
                <Shield
                  size={18}
                  weight="Bold"
                  className="text-blue-400 group-hover:scale-110 transition-transform"
                />
                <span className="font-bold tracking-wide">Defend</span>
              </span>
              <span className="text-xs opacity-80 flex gap-1 font-mono bg-black/20 px-1.5 py-0.5 rounded">
                <span className="flex items-center gap-1">
                  {DEFEND_COST[ResourceType.Food]} <Icon name="food" size="sm" />
                </span>
              </span>
            </Button>
          </div>
        )}

        {cooldownRemaining > 0 && (
          <div className="mt-3 h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-stone-500 transition-all duration-100 ease-linear"
              style={{ width: `${(cooldownRemaining / COMBAT_COOLDOWN) * 100}%` }}
            />
          </div>
        )}
      </Card>

      {/* Player Military Stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between items-center p-2.5 bg-stone-900/50 rounded-xl border border-stone-800/50 shadow-sm">
          <span className="text-stone-500 font-bold text-xs uppercase tracking-wider">
            My Power
          </span>
          <span className="font-bold text-stone-200 font-mono text-lg flex items-center gap-1.5">
            <Fire size={16} className="text-red-400" weight="Bold" /> {military.strength}
          </span>
        </div>
        <div className="flex justify-between items-center p-2.5 bg-stone-900/50 rounded-xl border border-stone-800/50 shadow-sm">
          <span className="text-stone-500 font-bold text-xs uppercase tracking-wider">My Def</span>
          <span className="font-bold text-stone-200 font-mono text-lg flex items-center gap-1.5">
            <Shield size={16} className="text-blue-400" weight="Bold" /> {military.defense}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {combat.isDefending && tick < combat.defenseEndTick && (
        <div className="bg-blue-900/20 text-blue-200 text-xs px-3 py-2 rounded-lg border border-blue-500/30 flex items-center gap-2 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          <Shield size={14} weight="Bold" className="text-blue-400" />
          <span className="font-bold">Defense Bonus Active</span>
          <span className="font-mono opacity-70 ml-auto">({combat.defenseEndTick - tick}s)</span>
        </div>
      )}

      {lastRivalAttack && tick - lastRivalAttack.tick < 20 && (
        <div className="bg-red-950/60 text-red-100 text-xs px-3 py-2 rounded-lg border border-red-500/50 flex items-center gap-2 animate-bounce-short shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <DangerTriangle size={16} weight="Bold" className="text-red-500" />
          <span className="font-bold">Rival attacked!</span>
          <span className="ml-auto bg-red-500/20 px-1.5 rounded text-red-200">
            -{lastRivalAttack.killed} Pop
          </span>
        </div>
      )}

      {lastResult && (
        <div className="text-xs text-stone-500 text-center italic mt-1 font-medium">
          "{lastResult}"
        </div>
      )}
    </div>
  );
}
