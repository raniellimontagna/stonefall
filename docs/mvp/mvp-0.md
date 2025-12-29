# MVP 0 - Fundação

> **Status:** Em andamento
> **Tempo estimado:** 2-3 dias

## Objetivo

Criar a estrutura do monorepo e o mapa básico renderizável.

## User Stories

- [ ] Como desenvolvedor, quero um monorepo configurado para trabalhar em web e api
- [ ] Como desenvolvedor, quero compartilhar código entre apps
- [ ] Como jogador, quero ver um mapa 2D na tela
- [ ] Como jogador, quero navegar pelo mapa (arrastar/zoom)

## Tasks Técnicas

### 1. Setup do Monorepo

- [ ] Inicializar repositório Git
- [ ] Configurar pnpm workspace
- [ ] Configurar Turborepo
- [ ] Configurar Biome (lint + format)
- [ ] Configurar TypeScript base
- [ ] Criar estrutura de pastas

### 2. packages/shared

- [ ] Criar package.json
- [ ] Criar tsconfig.json
- [ ] Criar types básicos (TileType, etc.)
- [ ] Criar constantes do jogo (TILE_SIZE, GRID_SIZE)
- [ ] Configurar exports

### 3. apps/web

- [ ] Inicializar projeto Vite + React
- [ ] Configurar TypeScript
- [ ] Instalar Phaser.js
- [ ] Criar App.tsx e main.tsx
- [ ] Criar componente GameCanvas
- [ ] Criar Game class
- [ ] Criar BootScene e GameScene
- [ ] Criar sistema de mapa (Map, Tile)
- [ ] Renderizar grid 20x20
- [ ] Implementar câmera (pan/zoom)

### 4. apps/api (Setup básico)

- [ ] Inicializar projeto Hono
- [ ] Configurar TypeScript
- [ ] Criar rota de health check
- [ ] Testar comunicação web ↔ api

## Estrutura de Arquivos

```
stonefall/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── config/
│   │   │   │   └── gameConfig.ts
│   │   │   ├── components/
│   │   │   │   └── game/
│   │   │   │       └── GameCanvas.tsx
│   │   │   ├── game/
│   │   │   │   ├── Game.ts
│   │   │   │   ├── scenes/
│   │   │   │   │   ├── BootScene.ts
│   │   │   │   │   └── GameScene.ts
│   │   │   │   └── map/
│   │   │   │       ├── Map.ts
│   │   │   │       ├── Tile.ts
│   │   │   │       └── TileRenderer.ts
│   │   │   └── styles/
│   │   │       └── index.css
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/
│       ├── src/
│       │   ├── index.ts
│       │   └── routes/
│       │       └── health.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── index.ts
│       │   ├── types/
│       │   │   ├── index.ts
│       │   │   └── game.ts
│       │   └── constants/
│       │       ├── index.ts
│       │       └── game.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docs/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── biome.json
└── tsconfig.base.json
```

## Constantes (packages/shared)

```typescript
// packages/shared/src/constants/game.ts
export const TILE_SIZE = 64;
export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 20;
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
```

## Types (packages/shared)

```typescript
// packages/shared/src/types/game.ts
export enum TileType {
  Plains = "plains",
  Forest = "forest",
  Mountain = "mountain",
  Water = "water",
}

export interface Position {
  x: number;
  y: number;
}

export interface TileData {
  type: TileType;
  position: Position;
}
```

## Assets Placeholder

Para o MVP 0, usar cores sólidas (sem sprites):

| Tile     | Cor       |
| -------- | --------- |
| Plains   | `#90EE90` |
| Forest   | `#228B22` |
| Mountain | `#808080` |
| Water    | `#4169E1` |

## Critérios de Aceite

- [ ] `pnpm install` funciona sem erros
- [ ] `pnpm dev` inicia web e api em paralelo
- [ ] `pnpm build` compila todos os pacotes
- [ ] `pnpm check` (biome) passa sem erros
- [ ] apps/web importa de @stonefall/shared
- [ ] apps/api importa de @stonefall/shared
- [ ] Mapa 20x20 visível na tela
- [ ] Tiles coloridos por tipo
- [ ] Câmera navega com mouse drag
- [ ] Zoom funciona com scroll
- [ ] API responde em /health

## Comandos de Verificação

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Verificar lint/format
pnpm check

# Testar API
curl http://localhost:3001/health
```

## Próximo MVP

Após concluir, seguir para `mvp-1.md` (Recursos e Construções)
