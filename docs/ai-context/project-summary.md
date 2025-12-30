# Project Stonefall - Resumo do Projeto

> **Use este arquivo como contexto inicial para a IA**
> **Status:** MVP 6 ✅ Concluído

## O que é

Jogo de estratégia histórica para navegador, inspirado em Age of Empires, com foco em:

- Gestão de recursos
- Construção de civilização
- Eventos gerados por IA
- Sessões curtas (10-20 min)

## Arquitetura

**Monorepo** com pnpm + Turborepo:

```
stonefall/
├── apps/
│   ├── web/      # Frontend (React + Phaser + Vite)
│   └── api/      # Backend (Hono + Node.js)
└── packages/
    └── shared/   # Types e constantes compartilhados
```

## Stack

| App        | Tecnologias                                 |
| ---------- | ------------------------------------------- |
| **web**    | React, Phaser.js, Vite, TypeScript, Zustand |
| **api**    | Hono, Node.js, TypeScript, Gemini API       |
| **shared** | TypeScript, Zod                             |
| **infra**  | pnpm, Turborepo, Biome, Knip                |
| **futuro** | Drizzle ORM, PostgreSQL                     |

## Mecânicas Core

1. **Recursos:** Comida, Madeira, Pedra, Ouro
2. **Mapa:** Grid 2D (20x20), tiles com biomas (plains, forest, mountain, water, gold)
3. **Construções:** Centro da Vila, Casa, Fazenda, Serraria, Mina, Mina de Ouro, Quartel, Torre
4. **Eras:** Pedra → Bronze → Ferro
5. **Combate:** Estratégico (sem controle de unidades)
6. **Eventos:** Gerados por IA dinamicamente (via API)

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────┐
│                    React App                         │
│  (UI Components, Modais, Menus)                     │
│                       │                             │
│                       ▼                             │
│                    Zustand                          │
│                (Estado Global)                      │
│                       │                             │
│                       ▼                             │
│                    Phaser                           │
│               (Game Canvas)                         │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
              API (Hono) → Gemini AI
                        │
                        ▼
                    Response
```

## Diferencial

> Cada partida gera uma história única através de eventos e narrativas criadas por IA.

## Comandos Principais

```bash
pnpm dev      # Roda web + api
pnpm build    # Build de produção
pnpm check    # Lint + format (Biome)
```

## MVP Atual

Ver: `current-sprint.md`
