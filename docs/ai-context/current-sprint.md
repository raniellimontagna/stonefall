# Sprint Atual - MVP 0

> **Última atualização:** 29/12/2025

## Objetivo

Criar estrutura do monorepo e mapa básico renderizável.

## Escopo do MVP 0

### Setup do Monorepo

- [ ] Configurar pnpm workspace
- [ ] Configurar Turborepo
- [ ] Configurar Biome
- [ ] Configurar TypeScript base

### packages/shared

- [ ] Types básicos (TileType, Position)
- [ ] Constantes do jogo (TILE_SIZE, GRID_SIZE)

### apps/web

- [ ] Setup Vite + React + Phaser
- [ ] Componente GameCanvas (wrapper Phaser)
- [ ] Sistema de mapa (grid 20x20)
- [ ] Câmera com pan/zoom

### apps/api

- [ ] Setup Hono básico
- [ ] Rota /health

## Fora do Escopo (próximos MVPs)

- Recursos
- Construções
- UI completa
- IA/Eventos
- Combate

## Estrutura Principal

```
stonefall/
├── apps/
│   ├── web/src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── game/
│   │   │       └── GameCanvas.tsx
│   │   └── game/
│   │       ├── Game.ts
│   │       ├── scenes/
│   │       └── map/
│   └── api/src/
│       └── index.ts
├── packages/
│   └── shared/src/
│       ├── types/
│       └── constants/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Decisões Técnicas

- **Monorepo:** pnpm + Turborepo
- **Lint/Format:** Biome (unificado)
- **Tiles:** 64x64 pixels
- **Grid:** 20x20 (configurável)
- **Coordenadas:** x, y (grid simples)

## Comandos

```bash
pnpm install    # Instalar deps
pnpm dev        # Rodar web + api
pnpm build      # Build produção
pnpm check      # Lint + format
```
