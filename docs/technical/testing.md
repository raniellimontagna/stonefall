# Estratégia de Testes

> **Definições de como testar o projeto de forma escalável.**

---

## 🎯 Filosofia de Testes

### Pirâmide de Testes

```
         /\
        /  \
       / E2E \     ← Poucos (críticos)
      /______\
     /        \
    / Integração\   ← Médios (fluxos)
   /______________\
  /                \
 /   Unitários      \  ← Muitos (lógica)
/____________________\
```

### Cobertura Mínima

| Tipo              | Cobertura | Foco                     |
| ----------------- | --------- | ------------------------ |
| `packages/shared` | 90%       | Lógica core, validações  |
| `apps/api`        | 80%       | Endpoints, integração IA |
| `apps/web`        | 70%       | Componentes, game logic  |

---

## 🧪 Configuração Vitest

### `vitest.workspace.ts` (Raiz)

```typescript
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "apps/*/vitest.config.ts",
  "packages/*/vitest.config.ts",
]);
```

### `packages/shared/vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 90,
        statements: 90,
      },
    },
  },
});
```

### `apps/web/vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/*.stories.tsx", "**/test/**"],
    },
  },
});
```

---

## 📁 Estrutura de Testes

```
packages/shared/
├── src/
│   ├── game/
│   │   ├── resources.ts
│   │   └── resources.test.ts     ← Co-located
│   └── validation/
│       ├── schemas.ts
│       └── schemas.test.ts
└── vitest.config.ts

apps/web/
├── src/
│   ├── components/
│   │   └── ResourceBar/
│   │       ├── ResourceBar.tsx
│   │       └── ResourceBar.test.tsx  ← Co-located
│   ├── stores/
│   │   ├── gameStore.ts
│   │   └── gameStore.test.ts
│   └── test/
│       ├── setup.ts              ← Setup global
│       ├── mocks/                ← Mocks compartilhados
│       │   ├── phaser.ts
│       │   └── aiService.ts
│       └── utils/
│           └── render.tsx        ← Helpers de teste
└── vitest.config.ts
```

---

## 📝 Padrões de Teste

### 1. Teste Unitário - Lógica de Recursos

```typescript
// packages/shared/src/game/resources.test.ts
import { describe, it, expect } from "vitest";
import { calculateProduction, canAfford } from "./resources";
import { BALANCE } from "../constants/balance";

describe("calculateProduction", () => {
  it("should calculate food production from farms", () => {
    const buildings = [
      { type: "farm", tile: { type: "plain" } },
      { type: "farm", tile: { type: "plain" } },
    ];

    const production = calculateProduction(buildings, "food");

    expect(production).toBe(BALANCE.buildings.farm.production.food * 2);
  });

  it("should apply tile bonus for forests", () => {
    const buildings = [{ type: "sawmill", tile: { type: "forest" } }];

    const production = calculateProduction(buildings, "wood");

    // Sawmill produz 2 wood, floresta dá +50%
    expect(production).toBe(3);
  });
});

describe("canAfford", () => {
  it("should return true when resources are sufficient", () => {
    const resources = { food: 100, wood: 50, stone: 30 };
    const cost = { wood: 25, stone: 10 };

    expect(canAfford(resources, cost)).toBe(true);
  });

  it("should return false when any resource is insufficient", () => {
    const resources = { food: 100, wood: 50, stone: 5 };
    const cost = { wood: 25, stone: 10 };

    expect(canAfford(resources, cost)).toBe(false);
  });
});
```

### 2. Teste de Integração - Store

```typescript
// apps/web/src/stores/gameStore.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useGameStore } from "./gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe("tick", () => {
    it("should increment tick counter", () => {
      const store = useGameStore.getState();

      store.tick();

      expect(useGameStore.getState().currentTick).toBe(1);
    });

    it("should update resources based on production", () => {
      const store = useGameStore.getState();
      store.placeBuilding({ type: "farm", position: { x: 0, y: 0 } });

      const initialFood = useGameStore.getState().resources.food;
      store.tick();
      const finalFood = useGameStore.getState().resources.food;

      expect(finalFood).toBeGreaterThan(initialFood);
    });

    it("should consume food per population", () => {
      const store = useGameStore.getState();
      store.setPopulation(10);

      const initialFood = useGameStore.getState().resources.food;
      store.tick();
      const finalFood = useGameStore.getState().resources.food;

      expect(finalFood).toBeLessThan(initialFood);
    });
  });
});
```

### 3. Teste de Componente

```typescript
// apps/web/src/components/ResourceBar/ResourceBar.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils/render";
import { ResourceBar } from "./ResourceBar";

describe("ResourceBar", () => {
  it("should display all resources", () => {
    render(<ResourceBar />);

    expect(screen.getByTestId("resource-food")).toBeInTheDocument();
    expect(screen.getByTestId("resource-wood")).toBeInTheDocument();
    expect(screen.getByTestId("resource-stone")).toBeInTheDocument();
  });

  it("should show production rate", () => {
    render(<ResourceBar />, {
      initialState: {
        resources: { food: 100, wood: 50, stone: 30 },
        production: { food: 2, wood: 1, stone: 0 },
      },
    });

    expect(screen.getByText("+2/tick")).toBeInTheDocument();
  });

  it("should highlight negative production in red", () => {
    render(<ResourceBar />, {
      initialState: {
        production: { food: -3, wood: 1, stone: 0 },
      },
    });

    const foodRate = screen.getByTestId("resource-food-rate");
    expect(foodRate).toHaveClass("text-red-500");
  });
});
```

### 4. Mock da API de IA

```typescript
// apps/web/src/test/mocks/aiService.ts
import { vi } from "vitest";

export const mockAIService = {
  generateEvent: vi.fn().mockResolvedValue({
    id: "test-event-1",
    type: "dilemma",
    title: "Test Event",
    description: "A test event description",
    choices: [
      { id: "a", text: "Choice A", effects: { food: 10 } },
      { id: "b", text: "Choice B", effects: { wood: 10 } },
    ],
  }),

  generateChronicle: vi.fn().mockResolvedValue({
    title: "The Test Kingdom",
    chapters: ["Chapter 1"],
  }),
};

// Em setup.ts:
vi.mock("../../services/aiService", () => mockAIService);
```

### 5. Mock do Phaser

```typescript
// apps/web/src/test/mocks/phaser.ts
import { vi } from "vitest";

export const mockPhaser = {
  Game: vi.fn().mockImplementation(() => ({
    scene: {
      add: vi.fn(),
      start: vi.fn(),
    },
    destroy: vi.fn(),
  })),
  Scene: vi.fn(),
  GameObjects: {
    Sprite: vi.fn(),
    Text: vi.fn(),
  },
};

vi.mock("phaser", () => mockPhaser);
```

---

## 🔄 Scripts de Teste

### `package.json` (Raiz)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### Turbo Pipeline

```json
// turbo.json
{
  "pipeline": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": false
    },
    "test:coverage": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

---

## 🚀 CI - Testes Automatizados

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - run: pnpm install

      - run: pnpm test:run

      - run: pnpm test:coverage

      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

---

## ✅ Checklist de Testes por MVP

### MVP 0

- [ ] Testes de geração de grid
- [ ] Testes de cálculo de recursos
- [ ] Testes de validação Zod

### MVP 1

- [ ] Testes de construção de buildings
- [ ] Testes de progressão de tick
- [ ] Testes de limites de recursos

### MVP 2

- [ ] Testes de progressão de era
- [ ] Testes de unlocks
- [ ] Testes de custos escalados

### MVP 3

- [ ] Testes de integração com IA (mock)
- [ ] Testes de fallback offline
- [ ] Testes de efeitos de eventos

### MVP 4

- [ ] Testes de spawn de rival
- [ ] Testes de cálculo de força
- [ ] Testes de combate

### MVP 5

- [ ] Testes de condições de vitória
- [ ] Testes de game over
- [ ] Testes de geração de crônica

### MVP 6

- [ ] Testes E2E de partida completa
- [ ] Testes de performance
- [ ] Testes de regressão
