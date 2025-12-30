/**
 * Debug Menu - Only visible in development mode
 * Provides quick access to test all game states and screens
 */

import {
  AddCircle,
  CloseCircle,
  Crown,
  Cup,
  DangerTriangle,
  Fire,
  Gamepad,
  MonitorSmartphone,
  MusicNote,
  Notebook,
  Restart,
  Settings,
  Star,
  WidgetAdd,
} from '@solar-icons/react';
import type { GameEvent } from '@stonefall/shared';
import { Era, ResourceType } from '@stonefall/shared';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { soundManager } from '@/game/SoundManager';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store';

// Mock event for testing
const MOCK_EVENT: GameEvent = {
  id: 'debug_event_1',
  type: 'economic',
  title: 'Evento de Teste',
  description:
    'Este é um evento de debug para verificar o sistema de eventos funcionando corretamente.',
  icon: '🧪',
  triggeredAt: 0,
  era: Era.Stone,
  choices: [
    {
      id: 'debug_accept',
      text: 'Aceitar (+50 comida)',
      effects: [{ type: 'resource', target: 'food', value: 50, isPercentage: false }],
    },
    {
      id: 'debug_decline',
      text: 'Recusar (-10 madeira)',
      effects: [{ type: 'resource', target: 'wood', value: -10, isPercentage: false }],
    },
  ],
};

interface DebugAction {
  label: string;
  icon: ReactNode;
  action: () => void;
  category: 'screens' | 'resources' | 'game' | 'danger';
}

export function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Store actions
  const setGameOver = useGameStore((s) => s.setGameOver);
  const triggerEvent = useGameStore((s) => s.triggerEvent);
  const openChronicle = useGameStore((s) => s.openChronicle);
  const addResources = useGameStore((s) => s.addResources);
  const resetGame = useGameStore((s) => s.resetGame);
  const advanceEra = useGameStore((s) => s.advanceEra);

  // Get current state for conditional logic
  const era = useGameStore((s) => s.era);
  const tick = useGameStore((s) => s.tick);

  // Actions grouped by category
  const actions: DebugAction[] = [
    // Screens
    {
      label: 'Vitória',
      icon: <Cup size={16} weight="Bold" className="text-gold-main" />,
      action: () => setGameOver('victory'),
      category: 'screens',
    },
    {
      label: 'Derrota (Fome)',
      icon: <CloseCircle size={16} weight="Bold" className="text-red-400" />,
      action: () => setGameOver('starvation'),
      category: 'screens',
    },
    {
      label: 'Derrota (Combate)',
      icon: <DangerTriangle size={16} weight="Bold" className="text-red-400" />,
      action: () => setGameOver('defeat'),
      category: 'screens',
    },
    {
      label: 'Evento',
      icon: <Notebook size={16} weight="Bold" className="text-amber-400" />,
      action: () => triggerEvent({ ...MOCK_EVENT, triggeredAt: tick, era }),
      category: 'screens',
    },
    {
      label: 'Crônica',
      icon: <Notebook size={16} weight="Bold" className="text-stone-300" />,
      action: () => openChronicle(),
      category: 'screens',
    },

    // Resources
    {
      label: '+500 Recursos',
      icon: <WidgetAdd size={16} weight="Bold" className="text-green-400" />,
      action: () =>
        addResources({
          [ResourceType.Food]: 500,
          [ResourceType.Wood]: 500,
          [ResourceType.Stone]: 500,
          [ResourceType.Gold]: 500,
        }),
      category: 'resources',
    },
    {
      label: '+100 Comida',
      icon: <AddCircle size={16} weight="Bold" className="text-green-400" />,
      action: () => addResources({ [ResourceType.Food]: 100 }),
      category: 'resources',
    },
    {
      label: '+100 Ouro',
      icon: <AddCircle size={16} weight="Bold" className="text-gold-main" />,
      action: () => addResources({ [ResourceType.Gold]: 100 }),
      category: 'resources',
    },
    {
      label: 'Zerar Comida',
      icon: <Fire size={16} weight="Bold" className="text-red-400" />,
      action: () => {
        const current = useGameStore.getState().resources[ResourceType.Food];
        addResources({ [ResourceType.Food]: -current - 50 });
      },
      category: 'resources',
    },

    // Game State
    {
      label: 'Avançar Era',
      icon: <Star size={16} weight="Bold" className="text-purple-400" />,
      action: () => {
        // Force advance by adding resources first
        addResources({
          [ResourceType.Food]: 1000,
          [ResourceType.Wood]: 1000,
          [ResourceType.Stone]: 1000,
          [ResourceType.Gold]: 500,
        });
        advanceEra();
      },
      category: 'game',
    },
    {
      label: 'Derrotar Rival',
      icon: <Crown size={16} weight="Bold" className="text-gold-main" />,
      action: () => {
        useGameStore.setState((state) => ({
          rival: { ...state.rival, population: 0, isDefeated: true },
          gameOver: 'victory',
        }));
      },
      category: 'game',
    },
    {
      label: 'Próxima Música',
      icon: <MusicNote size={16} weight="Bold" className="text-purple-400" />,
      action: () => {
        soundManager.skipToNextTrack();
      },
      category: 'game',
    },

    // Danger
    {
      label: 'Reset Jogo',
      icon: <Restart size={16} weight="Bold" className="text-red-400" />,
      action: () => {
        resetGame();
        window.location.reload();
      },
      category: 'danger',
    },
  ];

  // Keyboard shortcut (F9)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'F9') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const categoryLabels: Record<DebugAction['category'], { label: string; icon: ReactNode }> = {
    screens: {
      label: 'Telas',
      icon: <MonitorSmartphone size={14} weight="Bold" />,
    },
    resources: {
      label: 'Recursos',
      icon: <WidgetAdd size={14} weight="Bold" />,
    },
    game: {
      label: 'Estado',
      icon: <Gamepad size={14} weight="Bold" />,
    },
    danger: {
      label: 'Danger Zone',
      icon: <DangerTriangle size={14} weight="Bold" />,
    },
  };

  const categoryColors: Record<DebugAction['category'], string> = {
    screens: 'border-blue-500/30 bg-blue-950/20',
    resources: 'border-green-500/30 bg-green-950/20',
    game: 'border-purple-500/30 bg-purple-950/20',
    danger: 'border-red-500/30 bg-red-950/20',
  };

  return (
    <>
      {/* Toggle Button - Fixed bottom-left */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'fixed bottom-4 left-4 z-[100] p-3 rounded-full shadow-xl transition-all duration-300',
          'bg-stone-800 border-2 border-stone-600 hover:border-gold-main hover:scale-110',
          isOpen && 'bg-gold-main/20 border-gold-main rotate-45'
        )}
        title="Debug Menu (F9)"
      >
        {isOpen ? (
          <CloseCircle size={24} weight="Bold" className="text-gold-main" />
        ) : (
          <Settings size={24} weight="Bold" className="text-stone-300" />
        )}
      </button>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-20 left-4 z-[100] w-80 max-h-[70vh] overflow-y-auto"
          >
            <Card
              variant="stone"
              className="bg-stone-900/95 backdrop-blur-md border-2 border-gold-main/30 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-700">
                <Settings size={24} weight="Bold" className="text-gold-main" />
                <div>
                  <h3 className="text-lg font-bold text-gold-main">Debug Menu</h3>
                  <p className="text-xs text-stone-500">DEV only • F9 toggle</p>
                </div>
              </div>

              {/* Actions by Category */}
              {(['screens', 'resources', 'game', 'danger'] as const).map((category) => {
                const categoryActions = actions.filter((a) => a.category === category);
                if (categoryActions.length === 0) return null;

                return (
                  <div key={category} className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                      {categoryLabels[category].icon}
                      {categoryLabels[category].label}
                    </h4>
                    <div
                      className={cn(
                        'grid grid-cols-2 gap-2 p-2 rounded-lg border',
                        categoryColors[category]
                      )}
                    >
                      {categoryActions.map((action) => (
                        <Button
                          key={action.label}
                          variant="ghost"
                          size="sm"
                          sound={false}
                          className={cn(
                            'flex items-center justify-start gap-2 text-xs h-auto py-2 px-2',
                            'hover:bg-stone-700/50 border border-transparent hover:border-stone-600',
                            category === 'danger' && 'hover:bg-red-900/30 hover:border-red-500/30'
                          )}
                          onClick={() => {
                            action.action();
                          }}
                        >
                          {action.icon}
                          <span className="truncate">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Current State Info */}
              <div className="mt-4 pt-3 border-t border-stone-700 text-xs text-stone-500 font-mono">
                <div className="flex justify-between">
                  <span>Era:</span>
                  <span className="text-stone-300">{era}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tick:</span>
                  <span className="text-stone-300">{tick}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
