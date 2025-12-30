import { GameCanvas } from './components/game/GameCanvas';
import { useKeyboardShortcuts } from './hooks';

export function App() {
  useKeyboardShortcuts();
  return <GameCanvas />;
}
