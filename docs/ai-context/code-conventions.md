# Convenções de Código

## Geral

- **Linguagem do código:** Inglês
- **Documentação:** Português (BR)
- **Linting/Formatação:** Biome (unificado)
- **Versões:** Sempre usar as mais recentes estáveis
- **Package Manager:** pnpm

## Monorepo

### Estrutura

```
stonefall/
├── apps/
│   ├── web/       # @stonefall/web
│   └── api/       # @stonefall/api
├── packages/
│   └── shared/    # @stonefall/shared
└── docs/
```

### Imports entre Packages

```typescript
// Em apps/web ou apps/api
import { TileType, TILE_SIZE } from "@stonefall/shared";
```

## TypeScript

```typescript
// Classes: PascalCase
class GameScene extends Phaser.Scene {}

// Interfaces: PascalCase (sem prefixo I)
interface TileData {
  x: number;
  y: number;
  type: TileType;
}

// Types: PascalCase
type TileType = "plains" | "forest" | "mountain" | "water";

// Enums: PascalCase
enum ResourceType {
  Food = "food",
  Wood = "wood",
  Stone = "stone",
  Gold = "gold",
}

// Constantes: UPPER_SNAKE_CASE
const TILE_SIZE = 64;
const GRID_WIDTH = 20;

// Funções e variáveis: camelCase
function calculateProduction() {}
const currentResources = {};
```

## Estrutura de Pastas

### apps/web

```
apps/web/src/
├── main.tsx                # Entry point React
├── App.tsx                 # Componente principal
├── config/
│   └── gameConfig.ts
├── components/             # Componentes React
│   ├── game/
│   │   └── GameCanvas.tsx
│   ├── ui/
│   │   ├── ResourceBar.tsx
│   │   ├── BuildMenu.tsx
│   │   └── TimeControls.tsx
│   ├── modals/
│   │   └── EventModal.tsx
│   └── common/
│       ├── Button.tsx
│       └── Panel.tsx
├── hooks/                  # React hooks customizados
│   ├── useGame.ts
│   └── useApi.ts
├── game/                   # Código Phaser
│   ├── Game.ts
│   ├── scenes/
│   ├── map/
│   ├── buildings/
│   ├── resources/
│   ├── combat/
│   └── events/
├── store/                  # Zustand stores
├── services/               # API client
├── styles/
│   └── index.css
└── utils/
```

### apps/api

```
apps/api/src/
├── index.ts               # Entry point
├── routes/
├── services/
├── middleware/
└── utils/
```

### packages/shared

```
packages/shared/src/
├── index.ts               # Re-exports
├── types/
├── constants/
└── validation/
```

## Padrões

### Componentes React - apps/web

```tsx
// apps/web/src/components/ui/ResourceBar.tsx
import { useGameStore } from "@/store/gameStore";

interface ResourceBarProps {
  className?: string;
}

export function ResourceBar({ className }: ResourceBarProps) {
  const resources = useGameStore((state) => state.resources);

  return (
    <div className={className}>
      <span>🌾 {resources.food}</span>
      <span>🪵 {resources.wood}</span>
      <span>🪨 {resources.stone}</span>
      <span>💰 {resources.gold}</span>
    </div>
  );
}
```

### Hooks Customizados - apps/web

```typescript
// apps/web/src/hooks/useGame.ts
import { useEffect, useRef } from "react";
import { Game } from "@/game/Game";
import { useGameStore } from "@/store/gameStore";

export function useGame(containerId: string) {
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    gameRef.current = new Game(containerId);

    return () => {
      gameRef.current?.destroy();
    };
  }, [containerId]);

  return gameRef;
}
```

### GameCanvas (Integração Phaser + React)

```tsx
// apps/web/src/components/game/GameCanvas.tsx
import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { gameConfig } from "@/config/gameConfig";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = new Phaser.Game({
      ...gameConfig,
      parent: containerRef.current,
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="game-container" />;
}
```

### Estado (Zustand) - apps/web

```typescript
// apps/web/src/store/resourceStore.ts
import { create } from "zustand";
import type { ResourceType } from "@stonefall/shared";

interface ResourceState {
  resources: Record<ResourceType, number>;
  addResource: (type: ResourceType, amount: number) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: { food: 100, wood: 50, stone: 25, gold: 0 },
  addResource: (type, amount) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [type]: state.resources[type] + amount,
      },
    })),
}));
```

### Routes (Hono) - apps/api

```typescript
// apps/api/src/routes/events.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eventRequestSchema } from "@stonefall/shared";

const events = new Hono();

events.post("/generate", zValidator("json", eventRequestSchema), async (c) => {
  const data = c.req.valid("json");
  // ...
  return c.json({ success: true });
});

export default events;
```

### Game Managers - apps/web

```typescript
// apps/web/src/game/buildings/BuildingManager.ts
import type { BuildingType, Position } from "@stonefall/shared";

export class BuildingManager {
  private buildings: Building[] = [];

  constructor(private scene: Phaser.Scene) {}

  public build(type: BuildingType, position: Position): Building | null {
    // validação e criação
  }

  public destroy(id: string): void {
    // remoção
  }
}
```

## Commits

Formato: `type(scope): message`

### Types

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `refactor`: Refatoração
- `style`: Formatação
- `test`: Testes
- `chore`: Manutenção

### Scopes

- `web`: Frontend
- `api`: Backend
- `shared`: Package compartilhado
- `docs`: Documentação
- `infra`: Configurações do monorepo

### Exemplos

```
feat(web): add tile rendering system
feat(api): implement event generation endpoint
fix(shared): correct resource type exports
docs: update architecture documentation
chore(infra): update turborepo config
```

## Scripts

```bash
# Desenvolvimento
pnpm dev              # Roda tudo
pnpm dev --filter web # Só frontend
pnpm dev --filter api # Só backend

# Build
pnpm build            # Build tudo
pnpm build --filter web

# Qualidade
pnpm check            # Biome check
pnpm lint             # Biome lint
pnpm format           # Biome format
pnpm knip             # Detecta código/deps não usados

# Deps
pnpm add <pkg> --filter @stonefall/web
pnpm add <pkg> --filter @stonefall/api
pnpm add -Dw <pkg>    # DevDep no root
```
