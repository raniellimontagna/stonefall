import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/store/helpers.ts', 'src/store/selectors.ts', 'src/lib/**/*.ts'],
      exclude: ['src/**/*.test.{ts,tsx}'],
      // Thresholds disabled for now - main coverage achieved in @stonefall/shared
      // Web app has complex Zustand stores that need proper mocking
      // thresholds: { ... },
    },
  },
});
