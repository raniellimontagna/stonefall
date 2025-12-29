# Sistema de Eventos (IA)

## Visão Geral

Eventos são o coração da experiência narrativa. São gerados dinamicamente por IA e criam situações únicas a cada partida.

## Arquitetura

```
┌─────────────────┐
│  Event Trigger  │  (condições do jogo)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Generator│  (IA / Gemini)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Card     │  (UI para jogador)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Player Choice  │  (decisão)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Apply Effects  │  (consequências)
└─────────────────┘
```

## Tipos de Eventos

### 🌾 Econômicos

- Seca / Abundância
- Descoberta de recursos
- Rota comercial
- Praga nas plantações

### 👥 Sociais

- Revolta popular
- Festival
- Migração
- Nascimento importante

### ⚔️ Militares

- Ataque surpresa
- Espionagem
- Deserção
- Reforços

### 🏛️ Políticos

- Traição de conselheiro
- Aliança proposta
- Demanda de tributo
- Sucessão

### 🌋 Naturais

- Terremoto
- Inundação
- Incêndio
- Eclipse (presságio)

## Estrutura de Evento

```typescript
interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string; // Gerado por IA
  choices: EventChoice[];
  triggeredAt: number; // Tick
  era: Era;
}

interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  requirements?: ResourceCost;
}

interface EventEffect {
  type: "resource" | "population" | "military" | "moral" | "relation";
  target: string;
  value: number;
}
```

## Prompt Template para IA

```
Você é um narrador de um jogo de estratégia histórica.

Contexto atual:
- Era: {era}
- População: {population}
- Recursos: Comida {food}, Madeira {wood}, Pedra {stone}, Ouro {gold}
- Relação com rival: {rivalRelation}
- Último evento: {lastEvent}

Gere um evento do tipo "{eventType}" com:
1. Título curto (máx 5 palavras)
2. Descrição narrativa (2-3 frases)
3. Duas ou três escolhas com consequências diferentes

Formato de resposta (JSON):
{
  "title": "...",
  "description": "...",
  "choices": [
    {
      "text": "...",
      "effects": [{"type": "resource", "target": "food", "value": -20}]
    }
  ]
}
```

## Exemplos de Eventos

### Evento: Seca

```json
{
  "title": "Seca Devasta Plantações",
  "description": "O sol inclemente castiga suas terras há semanas. Os campos estão secos e as reservas de água diminuem a cada dia. Seu povo olha para você em busca de uma solução.",
  "choices": [
    {
      "text": "Racionar comida severamente",
      "effects": [
        { "type": "resource", "target": "food", "value": -30 },
        { "type": "moral", "value": -10 }
      ]
    },
    {
      "text": "Enviar exploradores para encontrar água",
      "effects": [
        { "type": "resource", "target": "food", "value": -50 },
        { "type": "population", "value": -2 }
      ]
    },
    {
      "text": "Fazer oferendas aos deuses",
      "effects": [
        { "type": "resource", "target": "gold", "value": -10 },
        { "type": "moral", "value": 5 }
      ]
    }
  ]
}
```

## Frequência de Eventos

| Era    | Eventos por 10 ticks |
| ------ | -------------------- |
| Pedra  | 1                    |
| Bronze | 1.5                  |
| Ferro  | 2                    |

## Sistema de Peso

Eventos são selecionados com base em:

- Estado atual do jogo (recursos baixos = eventos de crise)
- Era atual
- Histórico recente (evita repetição)
- Relação com rival

## UI de Eventos

Eventos aparecem como "cards" sobre o jogo:

```
┌─────────────────────────────────────┐
│  🌾 SECA DEVASTA PLANTAÇÕES         │
├─────────────────────────────────────┤
│                                     │
│  O sol inclemente castiga suas      │
│  terras há semanas. Os campos       │
│  estão secos e as reservas de água  │
│  diminuem a cada dia.               │
│                                     │
├─────────────────────────────────────┤
│  [Racionar comida]  -30🌾 -10😊     │
│  [Enviar exploradores] -50🌾 -2👥   │
│  [Fazer oferendas]  -10💰 +5😊      │
└─────────────────────────────────────┘
```

## Registro para Crônica

Todo evento e escolha é registrado:

```typescript
interface ChronicleEntry {
  tick: number;
  era: Era;
  eventTitle: string;
  choiceMade: string;
  effects: EventEffect[];
}
```

Ao final da partida, a IA usa esse registro para gerar a narrativa da civilização.
