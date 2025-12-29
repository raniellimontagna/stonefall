# Roadmap de MVPs

## Filosofia

Cada MVP deve ser:

- **Jogável** - Algo funcional ao final
- **Testável** - Possível validar a mecânica
- **Incremental** - Construir sobre o anterior

---

## MVP 0 - Fundação ✅

**Status:** Concluído (29/12/2024)

### Objetivo

Setup técnico e mapa básico renderizável.

### Entregáveis

- Projeto configurado (Phaser + TS + Vite)
- Mapa grid renderizado
- Câmera funcional (pan/zoom)
- Tiles básicos (4 tipos)

### Resultado

> Tela com um mapa 2D navegável

---

## MVP 1 - Recursos e Construções ✅

**Status:** Concluído (29/12/2024)

### Objetivo

Loop básico de gameplay: coletar e construir.

### Entregáveis

- Sistema de recursos (4 tipos)
- UI de recursos
- 5 construções (Centro, Casa, Fazenda, Serraria, Mina)
- Produção automática por tick
- Colocação de construções no mapa

### Resultado

> Jogo onde você coleta recursos e constrói

---

## MVP 2 - População e Tempo ✅

**Status:** Concluído (29/12/2024)

### Objetivo

Adicionar gestão de população e ciclo de tempo.

### Entregáveis

- Sistema de população
- Consumo de comida
- Limite populacional (casas)
- Controle de velocidade do jogo (1x, 2x, 4x)
- Alertas de fome e Game Over

### Resultado

> Jogo com economia básica funcionando

---

## MVP 3 - Eventos (IA) ✅

**Status:** Concluído (29/12/2024)
**Tempo estimado:** 3-4 dias

### Objetivo

Integrar IA para gerar eventos dinâmicos.

### Entregáveis

- Integração com Gemini API
- Sistema de eventos
- 25+ tipos de eventos fallback
- UI de eventos (cards)
- Impacto nos recursos e população

### Resultado

> Eventos aleatórios gerados por IA (ou fallback offline)

**Detalhes:** Ver `mvp-3.md`

---

## MVP 4 - Eras e Progressão ⏳

**Status:** Próximo
**Tempo estimado:** 2-3 dias

### Objetivo

Sistema de evolução através das eras.

### Entregáveis

- 3 eras (Pedra, Bronze, Ferro)
- Requisitos para avançar
- Desbloqueio de construções por era
- Quartel, Torre, Mina de Ouro (novas construções)
- UI de progresso

### Resultado

> Progressão de era funcional

**Detalhes:** Ver `mvp-4.md`

---

## MVP 5 - Rival e Combate

**Tempo estimado:** 4-5 dias

### Objetivo

Adicionar oponente e sistema de conflito.

### Entregáveis

- 1 civilização rival (IA)
- Sistema de combate estratégico
- Força militar e defesa
- Ações: Atacar, Defender, Cerco, Negociar
- Condições de vitória/derrota

### Resultado

> Jogo completo com início, meio e fim

**Detalhes:** Ver `mvp-5.md`

---

## MVP 6 - Narrativa e Polish

**Tempo estimado:** 3-4 dias

### Objetivo

Crônica da civilização e refinamentos.

### Entregáveis

- Sistema de crônica (linha do tempo)
- Tela de vitória/derrota
- Resumo da partida gerado por IA
- Ajustes de balanceamento
- Melhorias visuais e UX

### Resultado

> Versão 1.0 jogável e apresentável

**Detalhes:** Ver `mvp-6.md`

### Entregáveis

- Sistema de crônica (linha do tempo)
- Tela de vitória/derrota
- Resumo da partida gerado por IA
- Ajustes de balanceamento
- Melhorias visuais

### Resultado

> Versão 1.0 jogável e apresentável

---

## Visão de Futuro (pós-MVP)

- Mais eras (Medieval, Renascimento...)
- Múltiplos rivais
- Árvore tecnológica
- Multiplayer assíncrono
- Salvamento em nuvem
- Customização de mapas
- Mobile responsivo
