# Arquitetura do Projeto

## Visão Geral

O projeto utiliza uma arquitetura de **monorepo** com duas aplicações principais e um pacote compartilhado.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              BROWSER                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                         apps/web                                   │  │
│  │                  (React + Phaser + Vite + TS)                     │  │
│  │                                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │                      REACT APP                               │  │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │  │  │
│  │  │  │  UI/HUD     │  │   Modais    │  │       Menus         │  │  │  │
│  │  │  │ Components  │  │  (Eventos)  │  │   (Construção)      │  │  │  │
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │  │  │
│  │  │         └────────────────┼────────────────────┘             │  │  │
│  │  │                          │                                   │  │  │
│  │  │                   ┌──────▼──────┐                            │  │  │
│  │  │                   │   ZUSTAND   │                            │  │  │
│  │  │                   │ (Game State)│                            │  │  │
│  │  │                   └──────┬──────┘                            │  │  │
│  │  └──────────────────────────┼──────────────────────────────────┘  │  │
│  │                             │                                      │  │
│  │  ┌──────────────────────────▼──────────────────────────────────┐  │  │
│  │  │                       PHASER.JS                              │  │  │
│  │  │                    (Game Canvas)                             │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │ HTTP/REST
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              apps/api                                     │
│                         (Hono + Node.js)                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   AI Service    │  │   Game Logic    │  │      Database           │  │
│  │  (Gemini API)   │  │   (Validation)  │  │  (Futuro: Drizzle+PG)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │   Gemini API    │
                         │    (Google)     │
                         └─────────────────┘
```

## Estrutura do Monorepo

```
stonefall/
├── apps/
│   ├── web/                      # 🎮 Frontend - Jogo
│   │   ├── src/
│   │   │   ├── main.tsx          # Entry point React
│   │   │   ├── App.tsx           # Componente principal
│   │   │   ├── config/
│   │   │   │   ├── constants.ts
│   │   │   │   └── gameConfig.ts
│   │   │   ├── components/       # Componentes React
│   │   │   │   ├── game/
│   │   │   │   │   └── GameCanvas.tsx
│   │   │   │   ├── ui/
│   │   │   │   │   ├── ResourceBar.tsx
│   │   │   │   │   ├── BuildMenu.tsx
│   │   │   │   │   └── TimeControls.tsx
│   │   │   │   ├── modals/
│   │   │   │   │   └── EventModal.tsx
│   │   │   │   └── common/
│   │   │   ├── hooks/            # React hooks
│   │   │   │   ├── useGame.ts
│   │   │   │   └── useApi.ts
│   │   │   ├── game/             # Código Phaser
│   │   │   │   ├── Game.ts
│   │   │   │   ├── scenes/
│   │   │   │   │   ├── BootScene.ts
│   │   │   │   │   ├── MenuScene.ts
│   │   │   │   │   ├── GameScene.ts
│   │   │   │   │   └── EndScene.ts
│   │   │   │   ├── map/
│   │   │   │   │   ├── Map.ts
│   │   │   │   │   ├── Tile.ts
│   │   │   │   │   └── TileRenderer.ts
│   │   │   │   ├── buildings/
│   │   │   │   │   ├── BuildingManager.ts
│   │   │   │   │   └── Building.ts
│   │   │   │   ├── resources/
│   │   │   │   │   └── ResourceManager.ts
│   │   │   │   ├── population/
│   │   │   │   │   └── PopulationManager.ts
│   │   │   │   ├── combat/
│   │   │   │   │   └── CombatManager.ts
│   │   │   │   ├── events/
│   │   │   │   │   └── EventManager.ts
│   │   │   │   └── rival/
│   │   │   │       └── RivalManager.ts
│   │   │   ├── store/
│   │   │   │   ├── gameStore.ts
│   │   │   │   └── uiStore.ts
│   │   │   ├── services/
│   │   │   │   └── apiClient.ts  # Comunicação com API
│   │   │   ├── styles/
│   │   │   │   └── index.css
│   │   │   └── utils/
│   │   ├── public/
│   │   │   └── assets/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/                      # 🔧 Backend - API
│       ├── src/
│       │   ├── index.ts          # Entry point
│       │   ├── routes/
│       │   │   ├── events.ts     # Geração de eventos (IA)
│       │   │   ├── narrative.ts  # Geração de narrativas
│       │   │   ├── rival.ts      # IA do rival
│       │   │   └── health.ts     # Health check
│       │   ├── services/
│       │   │   ├── ai.service.ts # Integração Gemini
│       │   │   └── cache.service.ts
│       │   ├── middleware/
│       │   │   ├── rateLimit.ts
│       │   │   └── validation.ts
│       │   └── utils/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                   # 📦 Código Compartilhado
│       ├── src/
│       │   ├── types/
│       │   │   ├── game.ts       # Types do jogo
│       │   │   ├── resources.ts  # Types de recursos
│       │   │   ├── buildings.ts  # Types de construções
│       │   │   ├── events.ts     # Types de eventos
│       │   │   ├── combat.ts     # Types de combate
│       │   │   └── api.ts        # Types de API requests/responses
│       │   ├── constants/
│       │   │   ├── resources.ts  # Valores de recursos
│       │   │   ├── buildings.ts  # Custos, produção
│       │   │   ├── eras.ts       # Configuração de eras
│       │   │   └── game.ts       # Constantes gerais
│       │   ├── validation/
│       │   │   └── schemas.ts    # Schemas de validação (Zod)
│       │   └── index.ts          # Exports
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                         # 📚 Documentação
│
├── package.json                  # Root workspace
├── pnpm-workspace.yaml           # Config do pnpm
├── turbo.json                    # Config do Turborepo
├── biome.json                    # Linting/Formatting
└── tsconfig.base.json            # TypeScript base config
```

## Responsabilidades

### apps/web (Frontend)

- **React**: UI/HUD, modais, menus
- **Phaser.js**: Renderização do jogo (canvas)
- **Zustand**: Estado compartilhado entre React e Phaser
- Comunicação com API
- Assets e sprites

### apps/api (Backend)

- Geração de eventos por IA (Gemini)
- Geração de narrativas
- IA do rival
- Rate limiting de IA
- Cache de respostas
- (Futuro) Autenticação - Drizzle + PostgreSQL
- (Futuro) Salvamento de partidas

### packages/shared

- Types TypeScript compartilhados
- Constantes do jogo (custos, produção, etc.)
- Schemas de validação
- Utilitários comuns

## Fluxo de Dados

### Gameplay Local (sem API)

```
User Input → Phaser Scene → Manager → Store → UI Update
```

### Geração de Evento (com API)

```
1. EventManager detecta trigger
2. apiClient.generateEvent(context)
3. API recebe request
4. AI Service chama Gemini
5. Resposta parseada e validada
6. Retorna evento para frontend
7. EventManager processa evento
8. UI exibe card de evento
```

### Exemplo: Fluxo de Construção

```
1. Jogador clica no tile
2. GameScene detecta click
3. BuildingManager.build('farm', x, y)
4. BuildingManager valida (usando shared/validation):
   - Tile é plains? ✓
   - Recursos suficientes? ✓
   - Tile livre? ✓
5. ResourceStore.spend({ wood: 20, stone: 10 })
6. BuildingStore.add(new Farm(x, y))
7. Map.placeBuildingSprite(x, y, 'farm')
8. UI atualiza automaticamente via Zustand
```

## Comunicação Web ↔ API

### API Client (Frontend)

```typescript
// apps/web/src/services/apiClient.ts
import type { EventRequest, EventResponse } from "@stonefall/shared";

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  async generateEvent(context: EventRequest): Promise<EventResponse> {
    const res = await fetch(`${API_URL}/events/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
    });
    return res.json();
  },

  async generateNarrative(chronicle: ChronicleEntry[]): Promise<string> {
    const res = await fetch(`${API_URL}/narrative/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chronicle }),
    });
    const data = await res.json();
    return data.narrative;
  },
};
```

### Routes (Backend)

```typescript
// apps/api/src/routes/events.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eventRequestSchema } from "@stonefall/shared";
import { aiService } from "../services/ai.service";

const events = new Hono();

events.post("/generate", zValidator("json", eventRequestSchema), async (c) => {
  const context = c.req.valid("json");
  const event = await aiService.generateEvent(context);
  return c.json(event);
});

export default events;
```

## Game Loop

```typescript
// apps/web/src/game/scenes/GameScene.ts
update(time: number, delta: number) {
  // 1. Atualizar tempo do jogo
  this.timeManager.update(delta);

  // 2. Se tick passou
  if (this.timeManager.shouldTick()) {
    // 3. Produção de recursos
    this.resourceManager.processTick();

    // 4. Consumo de população
    this.populationManager.processTick();

    // 5. Verificar eventos (pode chamar API)
    this.eventManager.checkTriggers();

    // 6. IA do rival (pode chamar API)
    this.rivalManager.processTick();
  }

  // 7. Atualizar renderização
  this.map.update(delta);
}
```

## Performance

### Frontend

- Object pooling para sprites
- Culling de tiles fora da câmera
- Lazy loading de assets
- Debounce em chamadas de API

### Backend

- Cache de respostas da IA
- Rate limiting por IP/sessão
- Response compression
- Connection pooling (futuro DB)

### Métricas Alvo

| Métrica      | Target     |
| ------------ | ---------- |
| FPS do jogo  | 60 estável |
| Resposta UI  | < 100ms    |
| Resposta API | < 500ms    |
| Resposta IA  | < 2s       |
