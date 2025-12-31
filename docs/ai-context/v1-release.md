# Project Stonefall - V1.0 Release

> **Última atualização:** 31/12/2024
> **Status:** ✅ V1.0 Concluída
> **Próximo:** V2.0 (Múltiplas Civilizações)

## 🎉 V1.0 - Completa

O jogo está funcional e jogável com todas as mecânicas core implementadas.

### Features da V1

| Feature | Status |
|---------|--------|
| Sistema de recursos (food, wood, stone, gold) | ✅ |
| 8 tipos de construção | ✅ |
| Sistema de população | ✅ |
| 3 eras (Pedra → Bronze → Ferro) | ✅ |
| Eventos gerados por IA (Gemini) | ✅ |
| Sistema de rival e combate | ✅ |
| Crônica da civilização | ✅ |
| Sistema de som e música | ✅ |
| Evolução visual de construções por era | ✅ |

---

## 🚀 V2.0 - Visão Futura

### Múltiplas Civilizações no Mapa

A V2 mudará fundamentalmente o sistema de rival:

- **N civilizações** visíveis no mapa (não apenas 1 rival abstrato)
- Cada civilização ocupa território no grid
- Interações visuais: fronteiras, expansão, conflitos
- Diplomacia entre múltiplas facções

### Multiplayer (Futuro)

- Multiplayer assíncrono (turn-based)
- Cada jogador controla uma civilização
- Interações via eventos e diplomacia

### Outras Melhorias

- Salvamento em nuvem
- Mais eras (Medieval, Renascimento...)
- Árvore tecnológica
- Customização de mapas

---

## Estrutura do Projeto

```
stonefall/
├── apps/
│   ├── web/       # Frontend (React + Phaser + Vite)
│   └── api/       # Backend (Hono + Node.js)
├── packages/
│   └── shared/    # Types e constantes
└── docs/          # Documentação
```

## Comandos

```bash
pnpm dev      # Desenvolvimento
pnpm build    # Build produção
pnpm check    # Lint + format
pnpm test     # Testes
```

## Documentação

| Doc | Descrição |
|-----|-----------|
| `game/balance.md` | Valores numéricos (fonte de verdade) |
| `game/overview.md` | Conceito e design |
| `technical/architecture.md` | Arquitetura do projeto |
| `technical/stack.md` | Tecnologias e versões |
| `mvp/` | Histórico de desenvolvimento |
