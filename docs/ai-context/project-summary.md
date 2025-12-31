# Project Stonefall - Resumo do Projeto

> **Use este arquivo como contexto inicial para a IA**
> **Status:** ✅ V1.0 Concluída | V2.0 Planejada

## O que é

Jogo de estratégia histórica para navegador inspirado em Age of Empires:
- Gestão de recursos e construção de civilização
- Eventos gerados por IA (Gemini)
- Sessões curtas (10-20 min)

> 📖 Detalhes: ver `docs/game/overview.md`

## Arquitetura

**Monorepo** com pnpm + Turborepo:

```
stonefall/
├── apps/
│   ├── web/      # Frontend (React + Phaser + Vite)
│   └── api/      # Backend (Hono + Node.js)
└── packages/
    └── shared/   # Types e constantes
```

> 📖 Detalhes: ver `docs/technical/architecture.md`

## Stack

| App        | Tecnologias                                 |
| ---------- | ------------------------------------------- |
| **web**    | React, Phaser.js, Vite, TypeScript, Zustand |
| **api**    | Hono, Node.js, TypeScript, Gemini API       |
| **shared** | TypeScript, Zod                             |
| **infra**  | pnpm, Turborepo, Biome, Vitest              |

> 📖 Versões: ver `docs/technical/stack.md`

## Mecânicas Core

- **Recursos:** Comida, Madeira, Pedra, Ouro
- **Mapa:** Grid 20x20, 5 biomas (plains, forest, mountain, water, gold)
- **Eras:** Pedra → Bronze → Ferro
- **Combate:** Estratégico baseado em população

> 📖 Valores numéricos: ver `docs/game/balance.md`

## Comandos

```bash
pnpm dev      # Roda web + api
pnpm build    # Build de produção
pnpm check    # Lint + format (Biome)
pnpm test     # Rodar testes
```

## Próximos Passos

Ver `docs/ai-context/current-sprint.md` e `docs/technical/longevity.md`

