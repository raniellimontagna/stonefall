# ⛏️ Project Stonefall

> Jogo de estratégia histórica para navegador, inspirado em Age of Empires, com eventos gerados por IA.

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Web: http://localhost:3000
# API: http://localhost:3001
```

## 📦 Estrutura

```
stonefall/
├── apps/
│   ├── web/          # Frontend (React + Phaser + Vite)
│   └── api/          # Backend (Hono + Node.js)
├── packages/
│   └── shared/       # Types e constantes compartilhados
└── docs/             # Documentação completa
```

## 🛠️ Comandos

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Roda web + api em paralelo |
| `pnpm build` | Build de produção |
| `pnpm check` | Lint + format (Biome) |
| `pnpm check:fix` | Auto-fix lint issues |

## 📚 Documentação

- [Visão geral do projeto](./docs/ai-context/project-summary.md)
- [Sprint atual](./docs/ai-context/current-sprint.md)
- [Roadmap de MVPs](./docs/mvp/roadmap.md)
- [Stack técnica](./docs/technical/stack.md)
- [Balanceamento](./docs/game/balance.md)

## 🎮 Mecânicas

- **Recursos:** Comida, Madeira, Pedra, Ouro, Fé
- **Mapa:** Grid 2D (20x20), tiles com biomas
- **Construções:** Centro da Vila, Casa, Fazenda, Serraria, Mina, etc.
- **Eras:** Pedra → Bronze → Ferro
- **Eventos:** Gerados por IA dinamicamente

## 🏗️ Status

- [x] MVP 0 - Fundação (monorepo + mapa)
- [ ] MVP 1 - Recursos e Construções
- [ ] MVP 2 - Sistema de Eras
- [ ] MVP 3 - Eventos com IA
- [ ] MVP 4 - Combate
- [ ] MVP 5 - Vitória/Derrota
- [ ] MVP 6 - Polish

## 📄 Licença

Private - All rights reserved
