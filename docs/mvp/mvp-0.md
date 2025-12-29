# MVP 0 - Fundação

> **Status:** ✅ Concluído
> **Data de conclusão:** 29/12/2024
> **Tempo real:** ~2 horas

## Objetivo

Criar a estrutura do monorepo e o mapa básico renderizável.

## User Stories

- [x] Como desenvolvedor, quero um monorepo configurado para trabalhar em web e api
- [x] Como desenvolvedor, quero compartilhar código entre apps
- [x] Como jogador, quero ver um mapa 2D na tela
- [x] Como jogador, quero navegar pelo mapa (arrastar/zoom)

## Tasks Técnicas

### 1. Setup do Monorepo

- [x] Inicializar repositório Git
- [x] Configurar pnpm workspace
- [x] Configurar Turborepo
- [x] Configurar Biome (lint + format)
- [x] Configurar TypeScript base
- [x] Criar estrutura de pastas

### 2. packages/shared

- [x] Criar package.json
- [x] Criar tsconfig.json
- [x] Criar types básicos (TileType, etc.)
- [x] Criar constantes do jogo (TILE_SIZE, GRID_SIZE)
- [x] Configurar exports

### 3. apps/web

- [x] Inicializar projeto Vite + React
- [x] Configurar TypeScript
- [x] Instalar Phaser.js
- [x] Criar App.tsx e main.tsx
- [x] Criar componente GameCanvas
- [x] Criar Game class
- [x] Criar BootScene e GameScene
- [x] Criar sistema de mapa (Map, Tile)
- [x] Renderizar grid 20x20
- [x] Implementar câmera (pan/zoom)

### 4. apps/api (Setup básico)

- [x] Inicializar projeto Hono
- [x] Configurar TypeScript
- [x] Criar rota de health check
- [x] Testar comunicação web ↔ api

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
  Gold = "gold", // Tile especial para mina de ouro (raro)
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

| Tile     | Cor       | Frequência |
| -------- | --------- | ---------- |
| Plains   | `#90EE90` | 50%        |
| Forest   | `#228B22` | 25%        |
| Mountain | `#808080` | 15%        |
| Water    | `#4169E1` | 8%         |
| Gold     | `#FFD700` | 2%         |

## Critérios de Aceite

- [x] `pnpm install` funciona sem erros
- [x] `pnpm dev` inicia web e api em paralelo
- [ ] `pnpm build` compila todos os pacotes _(não testado)_
- [x] `pnpm check` (biome) passa sem erros
- [x] apps/web importa de @stonefall/shared
- [x] apps/api importa de @stonefall/shared
- [x] Mapa 20x20 visível na tela
- [x] Tiles coloridos por tipo
- [x] Câmera navega com mouse drag
- [x] Zoom funciona com scroll
- [x] API responde em /health

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
