# MVP 3 - Eventos com IA

> **Status:** Não iniciado  
> **Tempo estimado:** 3-4 dias  
> **Pré-requisito:** MVP 2
>
> ⚠️ **Valores:** Consulte [`../game/balance.md`](../game/balance.md) e [`../game/events.md`](../game/events.md)

## Objetivo

Integrar IA (Gemini) para gerar eventos dinâmicos que afetam o gameplay.

## User Stories

- [ ] Como jogador, quero receber eventos aleatórios durante o jogo
- [ ] Como jogador, quero ler descrições narrativas únicas
- [ ] Como jogador, quero fazer escolhas com consequências
- [ ] Como jogador, quero que eventos afetem meus recursos

## Tasks Técnicas

### 1. Integração com Gemini API

- [ ] Configurar variável de ambiente `GEMINI_API_KEY`
- [ ] Criar cliente HTTP para Gemini no backend
- [ ] Criar endpoint `/api/events/generate`
- [ ] Implementar rate limiting (evitar spam de requests)
- [ ] Criar fallback para eventos offline

### 2. Sistema de Eventos (Backend)

- [ ] Criar tipos `GameEvent`, `EventChoice`, `EventEffect`
- [ ] Criar EventGenerator service
- [ ] Implementar prompt template para geração
- [ ] Validar/sanitizar resposta da IA
- [ ] Criar pool de eventos fallback (JSON estático)

### 3. Sistema de Eventos (Frontend)

- [ ] Criar EventManager no game
- [ ] Adicionar eventos ao store (pendingEvent, eventHistory)
- [ ] Implementar trigger de eventos por tick
- [ ] Criar action `triggerEvent`, `resolveEvent`

### 4. UI de Eventos

- [ ] Criar componente `EventCard`
- [ ] Mostrar título, descrição, escolhas
- [ ] Exibir efeitos de cada escolha (preview)
- [ ] Animação de entrada/saída
- [ ] Pausar jogo enquanto evento está ativo

### 5. Aplicar Efeitos

- [ ] Processar efeitos de recursos
- [ ] Processar efeitos de população
- [ ] Adicionar ao histórico (para crônica futura)

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

- [ ] Eventos aparecem a cada ~40 ticks
- [ ] Descrições são únicas (geradas por IA)
- [ ] Escolhas afetam recursos corretamente
- [ ] UI pausa o jogo durante evento
- [ ] Funciona offline com fallback
- [ ] Eventos são registrados no histórico

## Arquivos a Criar

```
apps/api/src/
├── services/
│   ├── gemini.ts          # Cliente Gemini
│   └── eventGenerator.ts  # Gerador de eventos
├── routes/
│   └── events.ts          # Endpoints de eventos
└── data/
    └── fallbackEvents.json # Eventos offline

apps/web/src/
├── components/ui/
│   └── EventCard.tsx      # Card de evento
├── game/managers/
│   └── EventManager.ts    # Gerenciador de eventos
└── store/
    └── gameStore.ts       # (atualizar com eventos)

packages/shared/src/
└── types/
    └── events.ts          # Tipos de eventos
```

## Próximo MVP

Após concluir, seguir para `mvp-4.md` (Eras e Progressão)
