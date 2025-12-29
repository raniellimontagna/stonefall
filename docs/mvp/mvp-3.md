# MVP 3 - Eventos com IA

> **Status:** ✅ Concluído (29/12/2024)  
> **Tempo real:** 1 dia  
> **Pré-requisito:** MVP 2
>
> ⚠️ **Valores:** Consulte [`../game/balance.md`](../game/balance.md) e [`../game/events.md`](../game/events.md)

## Objetivo

Integrar IA (Gemini) para gerar eventos dinâmicos que afetam o gameplay.

## User Stories

- [x] Como jogador, quero receber eventos aleatórios durante o jogo
- [x] Como jogador, quero ler descrições narrativas únicas
- [x] Como jogador, quero fazer escolhas com consequências
- [x] Como jogador, quero que eventos afetem meus recursos

## Tasks Técnicas

### 1. Integração com Gemini API

- [x] Configurar variável de ambiente `GEMINI_API_KEY`
- [x] Criar cliente HTTP para Gemini no backend
- [x] Criar endpoint `/api/events/generate`
- [x] Implementar rate limiting (evitar spam de requests)
- [x] Criar fallback para eventos offline

### 2. Sistema de Eventos (Backend)

- [x] Criar tipos `GameEvent`, `EventChoice`, `EventEffect`
- [x] Criar EventGenerator service
- [x] Implementar prompt template para geração
- [x] Validar/sanitizar resposta da IA
- [x] Criar pool de eventos fallback (JSON estático)

### 3. Sistema de Eventos (Frontend)

- [x] Criar EventManager no game
- [x] Adicionar eventos ao store (pendingEvent, eventHistory)
- [x] Implementar trigger de eventos por tick
- [x] Criar action `triggerEvent`, `resolveEvent`

### 4. UI de Eventos

- [x] Criar componente `EventCard`
- [x] Mostrar título, descrição, escolhas
- [x] Exibir efeitos de cada escolha (preview)
- [x] Animação de entrada/saída
- [x] Pausar jogo enquanto evento está ativo

### 5. Aplicar Efeitos

- [x] Processar efeitos de recursos
- [x] Processar efeitos de população
- [x] Adicionar ao histórico (para crônica futura)

## Tipos de Eventos (MVP)

### Econômicos
- Seca / Abundância
- Descoberta de recursos
- Praga nas plantações

### Sociais  
- Festival
- Migração de pessoas
- Doença

### Naturais
- Tempestade
- Incêndio
- Terremoto menor

## Estrutura de Dados

```typescript
interface GameEvent {
  id: string;
  type: 'economic' | 'social' | 'natural';
  title: string;
  description: string;
  choices: EventChoice[];
  triggeredAt: number;
}

interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
}

interface EventEffect {
  type: 'resource' | 'population';
  target: string;
  value: number;
}
```

## Endpoint API

```typescript
// POST /api/events/generate
Request: {
  era: Era;
  resources: Resources;
  population: number;
  lastEventType?: string;
}

Response: {
  event: GameEvent;
}
```

## Prompt Template

```
Você é um narrador de um jogo de estratégia histórica na {era}.

Estado atual da civilização:
- População: {population}
- Comida: {food}, Madeira: {wood}, Pedra: {stone}, Ouro: {gold}

Gere um evento do tipo "{eventType}" com:
1. Título curto (máx 5 palavras)
2. Descrição narrativa (2-3 frases, tom épico)
3. Duas escolhas com consequências diferentes

Formato JSON:
{
  "title": "...",
  "description": "...",
  "choices": [
    {"text": "...", "effects": [{"type": "resource", "target": "food", "value": -20}]},
    {"text": "...", "effects": [...]}
  ]
}
```

## Frequência de Eventos

| Era    | Intervalo (ticks) |
| ------ | ----------------- |
| Pedra  | 30-50             |

## UI de Evento

```
┌─────────────────────────────────────┐
│  🌾 [TÍTULO DO EVENTO]              │
├─────────────────────────────────────┤
│                                     │
│  [Descrição narrativa gerada       │
│   pela IA com 2-3 frases]           │
│                                     │
├─────────────────────────────────────┤
│  [Escolha A]     -20🌾 +5👥         │
│  [Escolha B]     +10🪵 -10🌾        │
└─────────────────────────────────────┘
```

## Fallback (Offline)

Se a API falhar, usar eventos pré-definidos:

```json
{
  "fallbackEvents": [
    {
      "type": "economic",
      "title": "Colheita Abundante",
      "description": "Os campos produziram mais do que o esperado este ciclo.",
      "choices": [
        {"text": "Celebrar com um festival", "effects": [{"type": "resource", "target": "food", "value": 30}]},
        {"text": "Armazenar para o futuro", "effects": [{"type": "resource", "target": "food", "value": 20}]}
      ]
    }
  ]
}
```

## Critérios de Aceite

- [x] Eventos aparecem a cada ~40 ticks
- [x] Descrições são únicas (geradas por IA)
- [x] Escolhas afetam recursos corretamente
- [x] UI pausa o jogo durante evento
- [x] Funciona offline com fallback
- [x] Eventos são registrados no histórico

## Arquivos Criados

```
apps/api/src/
├── services/
│   ├── gemini.ts          # Cliente Gemini ✅
│   └── eventGenerator.ts  # Gerador de eventos ✅
│   └── index.ts           # Exports ✅
├── routes/
│   └── events.ts          # Endpoints de eventos ✅

apps/web/src/
├── components/ui/
│   └── EventCard.tsx      # Card de evento ✅
│   └── EventCard.module.css # Estilos ✅
└── store/
    └── gameStore.ts       # (atualizado com eventos) ✅

packages/shared/src/
├── types/
│   └── events.ts          # Tipos de eventos ✅
└── constants/
    └── events.ts          # Fallback events + config ✅
    └── events.ts          # Fallback events + config ✅
```

## Melhorias Implementadas

### 🔧 Fix de Truncamento do Gemini (29/12/2024)

**Problema:** Respostas da API eram cortadas devido ao limite de tokens muito baixo.

**Solução:**
- Aumentado `maxOutputTokens` de 500 para 2000 em `apps/api/src/services/gemini.ts`
- Adicionado log de aviso quando `finishReason === 'MAX_TOKENS'`

**Impacto:** Eventos agora são gerados completamente sem erros de parsing.

---

### 🔧 Fix de Race Condition (29/12/2024)

**Problema:** Múltiplas requisições simultâneas à API devido ao game loop rápido.

**Solução:**
- Adicionado flag `isGeneratingEvent` ao `GameState` (`packages/shared/src/types/game.ts`)
- Implementado sistema de bloqueio em `apps/web/src/store/gameStore.ts`
- Requisições agora são bloqueadas enquanto uma está em andamento

**Impacto:** Apenas uma requisição por vez, eliminando erros 429 e duplicações.

---

### 🛠️ Ferramentas Adicionadas (29/12/2024)

**Script de Atualização de Modelos:**
- Criado `scripts/update-models.sh` para atualizar lista de modelos Gemini
- Adicionado comando `pnpm models:update` ao `package.json`

**Postman Collection:**
- Criado `docs/stonefall.postman_collection.json` com todos os endpoints
- Documentado regra de manutenção em `docs/technical/api.md`

## Próximo MVP

Após concluir, seguir para `mvp-4.md` (Eras e Progressão)
