# Sprint Atual - MVP 1

> **Última atualização:** 29/12/2025
> **MVP 0:** ✅ Concluído

## Objetivo do MVP 1

Implementar sistema de recursos e construções básicas.

## Escopo do MVP 1

### Sistema de Recursos

- [ ] Store Zustand para game state
- [ ] UI de recursos (barra superior)
- [ ] Tick system (1 tick/segundo)
- [ ] Cálculo de produção/consumo

### Construções Básicas

- [ ] Town Center (único, inicial)
- [ ] House (aumenta população)
- [ ] Farm (produz comida)
- [ ] Sawmill (produz madeira)
- [ ] Quarry (produz pedra)

### UI de Construção

- [ ] Painel lateral com buildings disponíveis
- [ ] Preview de construção no mapa
- [ ] Validação de tile/recursos
- [ ] Feedback visual de construção

### Integração

- [ ] Consumo de recursos ao construir
- [ ] Produção baseada em buildings
- [ ] Limite de população por casas

## Concluído no MVP 0

### Setup do Monorepo ✅

- [x] Configurar pnpm workspace
- [x] Configurar Turborepo
- [x] Configurar Biome
- [x] Configurar TypeScript base

### packages/shared ✅

- [x] Types básicos (TileType, Position)
- [x] Constantes do jogo (TILE_SIZE, GRID_SIZE)

### apps/web ✅

- [x] Setup Vite + React + Phaser
- [x] Componente GameCanvas (wrapper Phaser)
- [x] Sistema de mapa (grid 20x20)
- [x] Câmera com pan/zoom

### apps/api ✅

- [x] Setup Hono básico
- [x] Rota /health

## Fora do Escopo (próximos MVPs)

- Eras e progressão (MVP 2)
- IA/Eventos (MVP 3)
- Combate (MVP 4)
- Vitória/Derrota (MVP 5)

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
