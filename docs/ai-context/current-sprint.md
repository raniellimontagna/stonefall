# Sprint Atual - MVP 6

> **Última atualização:** 30/12/2024
> **MVP 0:** ✅ Concluído
> **MVP 1:** ✅ Concluído
> **MVP 2:** ✅ Concluído
> **MVP 3:** ✅ Concluído
> **MVP 4:** ✅ Concluído
> **MVP 5:** ✅ Concluído
> **MVP 6:** ✅ Concluído

## Objetivo do MVP 6

Narrativa e Polish.

## Concluído no MVP 6

### Sistema de Crônica ✅

- [x] Chronicle store com civilizationName e entries
- [x] Registro automático de eventos importantes
- [x] ChronicleTimeline UI com agrupamento por era
- [x] Estatísticas de jogo (duração, tempo real, batalhas, eventos)
- [x] GameStats component para exibição
- [x] Integração com telas de vitória/derrota

### Sistema de Som e Música ✅

- [x] SoundManager com Howler.js
- [x] 6 efeitos sonoros (click, build, success, error, collect, battle)
- [x] 8 músicas ambiente (reprodução aleatória)
- [x] Integração de sons em ações do jogo
- [x] Controle de volume (SFX: 0.3, Music: 0.4)
- [x] Botão de música no TickDisplay
- [x] Skip para próxima música

### Debug Menu (Dev Only) ✅

- [x] Menu de debug acessível via F9 ou botão
- [x] Ações para testar telas (Vitória, Derrota, Eventos, Crônica)
- [x] Manipulação de recursos (+500, +100, zerar)
- [x] Controle de estado (Avançar Era, Derrotar Rival)
- [x] Skip de música
- [x] Reset do jogo
- [x] Ícones Solar Icons (UI clean)

### Polish e Melhorias ✅

- [x] Substituição de emojis por ícones Solar Icons
- [x] Z-index corrigido (Crônica sobre Vitória/Derrota)
- [x] Scroll corrigido na modal de Crônica
- [x] Estatísticas calculadas automaticamente no game over
- [x] Volumes balanceados (SFX menos intrusivo)

### Evolução Visual por Era ✅

- [x] Sistema de troca automática de texturas de construções ao avançar de era
- [x] Gestão de assets organizada por pastas (`buildings/stone`, `bronze`, `iron`)
- [x] Geração de novas artes via IA para `Town Center`, `House` e `Farm` nas eras Bronze e Ferro
- [x] Documentação técnica do sistema de assets (`docs/technical/assets.md`)

## Concluído no MVP 5

### Sistema de Rival e Combate ✅

- [x] RivalState com população
- [x] Progressão do rival (era + população)
- [x] Ações: Atacar, Defender
- [x] Força militar (Quartéis) e Defesa (Torres)
- [x] Ataque mata população rival
- [x] Rival ataca e mata população do jogador
- [x] Vitória: pop. rival = 0
- [x] Derrota: sua pop. = 0
- [x] RivalPanel com população
- [x] GameOverScreen com vitória/derrota

## Concluído no MVP 3

### Sistema de Eventos ✅

- [x] Integração com Gemini API
- [x] Endpoint `/api/events/generate`
- [x] Sistema de fallback events
- [x] UI de eventos (EventCard)
- [x] Aplicação de efeitos
- [x] Fix de `maxOutputTokens` (500 → 2000)
- [x] Fix de race condition (isGeneratingEvent)
- [x] Script `update-models.sh`
- [x] Postman collection

## Concluído no MVP 2

### Sistema de População ✅

- [x] Consumo de comida por tick
- [x] Crescimento populacional
- [x] Morte por fome
- [x] Limite populacional (casas)
- [x] Game Over por fome

### Controles de Tempo ✅

- [x] Velocidade do jogo (1x, 2x, 4x)
- [x] Pause/Resume
- [x] UI de controles

## Concluído no MVP 1

### Sistema de Recursos ✅

- [x] Store Zustand para game state
- [x] UI de recursos (barra superior)
- [x] Tick system (1 tick/segundo)
- [x] Cálculo de produção/consumo

### Construções Básicas ✅

- [x] Town Center (único, inicial)
- [x] House (aumenta população)
- [x] Farm (produz comida)
- [x] Sawmill (produz madeira)
- [x] Mine (produz pedra)

### UI de Construção ✅

- [x] Painel lateral com buildings disponíveis
- [x] Preview de construção no mapa
- [x] Validação de tile/recursos
- [x] Feedback visual de construção

### Integração ✅

- [x] Consumo de recursos ao construir
- [x] Produção baseada em buildings
- [x] Limite de população por casas

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
