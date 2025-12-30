import { MusicNote, MusicNotes, Pause, Play } from '@solar-icons/react';
import { GAME_SPEEDS, type GameSpeed } from '@stonefall/shared';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { soundManager } from '@/game/SoundManager';
import { cn } from '@/lib/utils';
import { selectGameSpeed, selectIsPaused, selectTick, useGameStore } from '@/store';

export function TickDisplay() {
  const tick = useGameStore(selectTick);
  const isPaused = useGameStore(selectIsPaused);
  const gameSpeed = useGameStore(selectGameSpeed);
  const togglePause = useGameStore((s) => s.togglePause);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      soundManager.stopMusic();
      setIsMusicPlaying(false);
    } else {
      soundManager.playMusic();
      setIsMusicPlaying(true);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-2xl border shadow-lg transition-all hover:shadow-xl',
        'bg-stone-900/60 backdrop-blur-md border-stone-800/50'
      )}
    >
      {/* Music Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMusic}
        className={cn(
          'w-10 h-10 rounded-xl transition-all duration-300',
          isMusicPlaying
            ? 'text-purple-400 bg-purple-400/10 hover:bg-purple-400/20 hover:text-purple-300'
            : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
        )}
        title={isMusicPlaying ? 'Parar Música' : 'Tocar Música'}
      >
        {isMusicPlaying ? (
          <MusicNote size={20} weight="Bold" />
        ) : (
          <MusicNotes size={20} weight="Bold" />
        )}
      </Button>

      {/* Play/Pause */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePause}
        className={cn(
          'w-10 h-10 rounded-xl transition-all duration-300',
          isPaused
            ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 hover:text-yellow-300'
            : 'text-green-400 bg-green-400/10 hover:bg-green-400/20 hover:text-green-300'
        )}
      >
        {isPaused ? <Play size={24} weight="Bold" /> : <Pause size={24} weight="Bold" />}
      </Button>

      <div className="flex flex-col items-center min-w-[70px] leading-tight px-2 border-x border-stone-800/50">
        <span className="text-[10px] uppercase text-stone-500 font-bold tracking-widest mb-0.5">
          Tick
        </span>
        <span className="font-mono text-xl font-bold text-stone-200 tracking-tight shadow-black drop-shadow-sm">
          {tick}
        </span>
      </div>

      <div className="flex gap-1 bg-stone-950/40 rounded-xl p-1 shadow-inner border border-stone-800/30">
        {GAME_SPEEDS.map((speed: GameSpeed) => (
          <button
            type="button"
            key={speed}
            onClick={() => setGameSpeed(speed)}
            className={cn(
              'px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 font-mono',
              gameSpeed === speed
                ? 'bg-stone-700 text-stone-100 shadow-sm scale-105'
                : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
            )}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
}
