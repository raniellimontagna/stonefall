# Project Stonefall - Documentação

> **Codinome:** Project Stonefall
> **Nome do Jogo:** [A definir] > **Versão:** 0.1.0 (MVP-0)

## 🏗️ Arquitetura

**Monorepo** com pnpm + Turborepo:

```
stonefall/
├── apps/
│   ├── web/           # Frontend (Phaser + Vite)
│   └── api/           # Backend (Hono + Node.js)
├── packages/
│   └── shared/        # Types e constantes
└── docs/              # Esta documentação
```

## 📁 Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo - índice geral
├── game/                        # Documentação do jogo
│   ├── overview.md              # Visão geral e conceito
│   ├── glossary.md              # 📖 Glossário de termos (PT→EN)
│   ├── balance.md               # ⚖️ BALANCEAMENTO (fonte de verdade)
│   ├── eras.md                  # Sistema de eras
│   ├── combat.md                # Sistema de combate
│   ├── events.md                # Sistema de eventos (IA)
│   └── rivals.md                # Sistema de rivais (IA)
├── technical/                   # Documentação técnica
│   ├── architecture.md          # Arquitetura do monorepo
│   ├── stack.md                 # Stack tecnológica
│   ├── api.md                   # Integrações de IA
│   ├── testing.md               # 🧪 Estratégia de testes
│   ├── error-handling.md        # 🛡️ Tratamento de erros
│   ├── cicd.md                  # 🚀 Pipeline CI/CD
│   ├── feature-flags.md         # 🚩 Feature flags e config
│   ├── sound-system.md          # 🔊 Sistema de som e música
│   ├── debug-menu.md            # ⚙️ Manual do Debug Menu
│   ├── assets.md                # 🎨 Gestão de Assets e Evolução
│   └── longevity.md             # 📈 Análise de longevidade
├── mvp/                         # Roadmap de MVPs
│   ├── roadmap.md               # Visão geral dos MVPs
│   └── mvp-0.md ... mvp-7.md    # Detalhes de cada MVP
├── art/                         # Guia de arte e prompts
│   ├── style-guide.md           # Guia de estilo visual
│   ├── ai-generation-guide.md   # Como gerar arte com IA
│   └── prompts/                 # Prompts para geração
│       ├── tiles.md
│       ├── buildings.md
│       ├── ui.md
│       └── icons.md
└── ai-context/                  # Contextos para IA
    ├── project-summary.md       # Resumo do projeto
    ├── v1-release.md            # Status V1 e visão V2
    └── code-conventions.md      # Convenções de código
```

## 🎯 Objetivo da Documentação

1. **Facilitar o desenvolvimento** - Documentação clara para cada sistema
2. **Economizar tokens de IA** - Contextos resumidos e focados
3. **Escalabilidade** - Fácil adicionar novas features
4. **Histórico** - Registro de decisões e progresso

## 🚀 Quick Start

Para começar a trabalhar no projeto, leia:

1. `ai-context/project-summary.md` - Entender o projeto
2. `technical/architecture.md` - Entender a estrutura
3. `mvp/roadmap.md` - Ver o plano de desenvolvimento
4. `ai-context/current-sprint.md` - Ver o que está sendo feito agora

## 📊 Para Desenvolvedores Sênior/PO

Documentos estratégicos:

- `technical/longevity.md` - Análise de gaps e roadmap estendido
- `technical/testing.md` - Estratégia completa de testes
- `technical/error-handling.md` - Padrões de erro e recovery
- `technical/cicd.md` - Pipeline de CI/CD
- `game/balance.md` - Fonte de verdade para valores numéricos

## 📝 Convenções

- Documentação em Português (Brasil)
- Código e comentários em Inglês
- Nomes de arquivos em kebab-case
- Markdown para toda documentação
- **Package Manager:** pnpm
- **Build System:** Turborepo
- **Linting/Format:** Biome
- **Versões:** Sempre usar as mais recentes estáveis
