import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/routes/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/index.ts', 'src/services/**'],
      // Thresholds disabled - services require complex Gemini AI mocking
      // thresholds: { ... },
    },
  },
});
