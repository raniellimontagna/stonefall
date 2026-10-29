# ⛏️ Project Stonefall

> [!WARNING]
> **Descontinuado.** Este projeto não é mais mantido e o repositório está arquivado (somente leitura). A demo na Vercel saiu do ar e o workflow de release está desligado.

> Jogo de estratégia histórica para navegador, inspirado em Age of Empires, com eventos gerados por IA.

**Status:** ✅ V1.0 Concluída

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev
```

## 📋 Comandos

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Roda web + api em paralelo |
| `pnpm build` | Build de produção |
| `pnpm check` | Lint + format (Biome) |
| `pnpm test` | Rodar testes |

## 📚 Documentação

- [Visão geral do projeto](./docs/ai-context/project-summary.md)
- [V1 Release & Visão V2](./docs/ai-context/v1-release.md)
- [Roadmap de MVPs](./docs/mvp/roadmap.md)
- [Stack técnica](./docs/technical/stack.md)
- [Balanceamento](./docs/game/balance.md)

## 🎮 Mecânicas

- **Recursos:** Comida, Madeira, Pedra, Ouro
- **Mapa:** Grid 2D (20x20), tiles com biomas
- **Construções:** Centro da Vila, Casa, Fazenda, Serraria, Mina, Quartel, Torre
- **Eras:** Pedra → Bronze → Ferro
- **Eventos:** Gerados por IA (Gemini)
- **Combate:** Estratégico baseado em população

## 🏗️ Status

### V1.0 ✅ Concluída

- [x] MVP 0 - Fundação (monorepo + mapa)
- [x] MVP 1 - Recursos e Construções
- [x] MVP 2 - População e Tempo
- [x] MVP 3 - Eventos com IA
- [x] MVP 4 - Eras e Progressão
- [x] MVP 5 - Rival e Combate
- [x] MVP 6 - Narrativa, Crônica e Polish

### V2.0 🚧 Planejada

- Múltiplas civilizações no mapa
- Territórios visuais
- Multiplayer (futuro)

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).

## 🤝 Contribuições

Contribuições são bem-vindas! Veja o [Guia de Contribuição](./CONTRIBUTING.md) para começar.
