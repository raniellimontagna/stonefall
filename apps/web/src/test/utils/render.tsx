/**
 * Custom Render
 * Testing Library render with providers and store setup
 */

import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { useGameStore } from '@/store';

// Reset store before each render
function resetStore() {
  useGameStore.getState().resetGame();
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add state overrides if needed
  initialState?: Partial<ReturnType<typeof useGameStore.getState>>;
}

function Wrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function customRender(ui: ReactElement, options?: CustomRenderOptions) {
  resetStore();

  // Apply initial state if provided
  if (options?.initialState) {
    const currentState = useGameStore.getState();
    Object.assign(currentState, options.initialState);
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render with custom render
export { customRender as render };
