import { Crown, Fire, Sledgehammer } from '@solar-icons/react';
import { BUILDINGS } from '@stonefall/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { DebugMenu } from '@/components/debug';
import { ResourceBar, StarvationAlert, TickDisplay } from '@/components/hud';
import { ChronicleTimeline, DefeatModal, EventCard, VictoryModal } from '@/components/modals';
import { BuildPanel, EraProgress, RivalPanel } from '@/components/panels';
import { Button, Card } from '@/components/ui';
import { Game } from '@/game/Game';
import { cn } from '@/lib/utils';
import { selectPlacementMode, useGameStore } from '@/store';

type ActivePanel = 'build' | 'rival' | 'era' | null;

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);

  const placementMode = useGameStore(selectPlacementMode);
  const setPlacementMode = useGameStore((state) => state.setPlacementMode);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new Game(containerRef.current);

    const checkReady = setInterval(() => {
      if (gameRef.current?.isReady) {
        setIsLoading(false);
        clearInterval(checkReady);
      }
    }, 100);

    return () => {
      clearInterval(checkReady);
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  return (
    <div className="relative w-full h-full bg-stone-900 overflow-hidden font-game text-stone-100 select-none">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 text-gold-main">
          <h1
            className="text-5xl font-bold mb-4 animate-bounce-short flex items-center gap-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Sledgehammer size={48} weight="Bold" /> Stonefall
          </h1>
          <p className="text-stone-400">Loading Stone Age...</p>
        </div>
      )}

      {/* Main Game Container (Phaser) */}
      <div
        ref={containerRef}
        id="game-container"
        className={cn('absolute inset-0 z-0', isLoading ? 'invisible' : 'visible')}
      />

      {/* Game UI Overlay */}
      {!isLoading && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
          {/* TOP BAR */}
          <div className="pointer-events-auto flex flex-col gap-2 p-2">
            <ResourceBar />
            <div className="flex flex-wrap justify-start items-start gap-4 px-2">
              <TickDisplay />
              <StarvationAlert />
            </div>
          </div>

          {/* DESKTOP SIDEBAR (Large Screens) */}
          <div className="hidden lg:flex absolute right-4 top-24 bottom-4 w-80 flex-col gap-4 pointer-events-auto">
            <Card
              variant="stone"
              className="flex-1 overflow-y-auto flex flex-col gap-4 bg-stone-900/90 backdrop-blur-sm"
            >
              <EraProgress />
              <div className="h-px bg-stone-700 shrink-0" />
              <RivalPanel />
              <div className="h-px bg-stone-700 shrink-0" />
              <BuildPanel />
            </Card>
          </div>

          {/* MOBILE BOTTOM BAR (Small Screens) */}
          <div className="lg:hidden pointer-events-auto mt-auto">
            {/* Active Panel Content */}
            <AnimatePresence>
              {activePanel && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="bg-stone-800/95 backdrop-blur-md border-t-4 border-wood-main max-h-[60vh] overflow-y-auto p-4 rounded-t-2xl shadow-2xl"
                >
                  {activePanel === 'build' && (
                    <BuildPanel mobile onBuildingSelect={() => setActivePanel(null)} />
                  )}
                  {activePanel === 'rival' && <RivalPanel mobile />}
                  {activePanel === 'era' && <EraProgress mobile />}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Tabs */}
            <div className="bg-wood-dark/95 backdrop-blur shadow-[0_-5px_20px_rgba(0,0,0,0.5)] flex justify-around items-center border-t border-wood-light/50 pb-2 pt-2 z-20 relative">
              <NavButton
                icon={<Sledgehammer size={24} weight="Bold" />}
                label="Build"
                active={activePanel === 'build'}
                onClick={() => togglePanel('build')}
              />
              <NavButton
                icon={<Fire size={24} weight="Bold" />}
                label="Rival"
                active={activePanel === 'rival'}
                onClick={() => togglePanel('rival')}
              />
              <NavButton
                icon={<Crown size={24} weight="Bold" />}
                label="Age"
                active={activePanel === 'era'}
                onClick={() => togglePanel('era')}
              />
            </div>
          </div>

          {/* PLACEMENT OVERLAY (Floating) */}
          <AnimatePresence>
            {placementMode && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-auto px-4 z-50 lg:bottom-8"
              >
                <Card
                  variant="glass"
                  className="p-4 bg-wood-dark/90 backdrop-blur-md border-gold-main/50 text-center shadow-2xl flex flex-col gap-2 max-w-sm w-full"
                >
                  <p className="text-sm text-gold-light font-bold">
                    <span className="text-stone-400 font-normal block text-xs uppercase tracking-wider mb-1">
                      Placing
                    </span>
                    {BUILDINGS[placementMode].name}
                  </p>
                  <p className="text-xs text-stone-300">Tap on the map to build</p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setPlacementMode(null)}
                    className="w-full mt-1"
                  >
                    Cancel
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modals & Full Screen Overlays */}
      <ChronicleTimeline />
      <VictoryModal />
      <DefeatModal />
      <EventCard />

      {/* Debug Menu - Dev Only */}
      {import.meta.env.DEV && <DebugMenu />}
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 relative overflow-hidden',
        active
          ? 'bg-wood-light/20 text-gold-main -translate-y-4 scale-110 shadow-lg shadow-black/50 border border-gold-main/30'
          : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
      )}
    >
      <div className={cn('transition-transform duration-300', active ? 'scale-110 rotate-3' : '')}>
        {icon}
      </div>
      <span
        className={cn(
          'text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300',
          active ? 'opacity-100' : 'opacity-70'
        )}
      >
        {label}
      </span>

      {active && (
        <motion.div
          layoutId="activeTabGlow"
          className="absolute inset-0 bg-gold-main/10 rounded-2xl -z-10 blur-sm"
        />
      )}
    </button>
  );
}
