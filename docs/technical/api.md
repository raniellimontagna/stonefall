# Integração com APIs de IA

## Visão Geral

A IA é usada para gerar conteúdo dinâmico que torna cada partida única:

- Eventos
- Narrativas
- Personalidades de rivais
- Crônica final

## Configuração

### API Key

```typescript
// src/config/ai.ts
export const AI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  model: "gemini-pro",
  maxTokens: 500,
  temperature: 0.8, // Mais criativo
};
```

### Serviço Principal

```typescript
// src/ai/AIService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_CONFIG } from "../config/ai";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: AI_CONFIG.model,
    });
  }

  async generate(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}

export const aiService = new AIService();
```

## Economia de Tokens

### Estratégias

1. **Contexto Mínimo**

   - Enviar apenas dados relevantes
   - Usar abreviações padronizadas

2. **Cache de Respostas**

   - Guardar eventos gerados
   - Reutilizar quando apropriado

3. **Batch de Requisições**
   - Gerar múltiplos eventos de uma vez
   - Usar fila de geração

### Estrutura de Contexto Otimizada

```typescript
// Contexto completo (evitar)
const fullContext = {
  era: "Bronze Age",
  population: 25,
  resources: { food: 150, wood: 80, stone: 45, gold: 12 },
  buildings: [
    /* lista completa */
  ],
  events: [
    /* histórico completo */
  ],
  rival: {
    /* dados completos */
  },
};

// Contexto otimizado (preferir)
const optimizedContext = {
  e: "B", // Era: Bronze
  p: 25, // População
  r: "150/80/45/12", // Recursos (F/W/S/G)
  t: "low_food", // Trigger type
  l: "drought", // Last event
};
```

## Prompts

### Template Base

```typescript
const BASE_PROMPT = `
Você é um narrador de jogos de estratégia histórica.
Responda APENAS em JSON válido.
Seja conciso e criativo.
`;
```

### Geração de Eventos

```typescript
// src/ai/prompts/eventPrompts.ts
export function buildEventPrompt(context: GameContext): string {
  return `
${BASE_PROMPT}

Contexto: Era ${context.era}, Pop ${context.population}, 
Recursos: F${context.food}/W${context.wood}/S${context.stone}/G${context.gold}
Trigger: ${context.trigger}

Gere um evento com:
- title: string (max 5 palavras)
- desc: string (2 frases)
- choices: [{text, effects: [{t,v}]}] (2-3 opções)

Tipos de efeito (t): food, wood, stone, gold, pop, moral
Valores (v): número (positivo ou negativo)

JSON:`;
}
```

### Parsing de Resposta

```typescript
// src/ai/parsers.ts
export function parseEventResponse(response: string): GameEvent {
  try {
    // Extrair JSON da resposta
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");

    const data = JSON.parse(jsonMatch[0]);

    return {
      id: generateId(),
      title: data.title,
      description: data.desc,
      choices: data.choices.map((c) => ({
        text: c.text,
        effects: c.effects.map((e) => ({
          type: expandEffectType(e.t),
          value: e.v,
        })),
      })),
    };
  } catch (error) {
    // Fallback para evento padrão
    return getDefaultEvent();
  }
}
```

## Fallbacks

Sempre ter eventos padrão caso a IA falhe:

```typescript
// src/ai/fallbacks.ts
export const FALLBACK_EVENTS: GameEvent[] = [
  {
    id: "fallback_1",
    title: "Dia Comum",
    description:
      "Nada de especial acontece hoje. Sua civilização continua seu desenvolvimento.",
    choices: [{ text: "Continuar", effects: [] }],
  },
  // ... mais eventos fallback
];
```

## Rate Limiting

```typescript
// src/ai/RateLimiter.ts
class RateLimiter {
  private requests: number[] = [];
  private maxRequests = 10;
  private windowMs = 60000; // 1 minuto

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((t) => now - t < this.windowMs);
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}
```

## Modo Offline

Para desenvolvimento ou quando a API não está disponível:

```typescript
// src/ai/AIService.ts
class AIService {
  private offlineMode = false;

  async generateEvent(context: GameContext): Promise<GameEvent> {
    if (this.offlineMode || !this.rateLimiter.canMakeRequest()) {
      return this.getRandomFallbackEvent();
    }

    try {
      const response = await this.generate(buildEventPrompt(context));
      this.rateLimiter.recordRequest();
      return parseEventResponse(response);
    } catch {
      return this.getRandomFallbackEvent();
    }
  }
}
```

## Custos Estimados

| Operação  | Tokens (aprox) | Frequência |
| --------- | -------------- | ---------- |
| Evento    | ~200           | 1/min      |
| Narrativa | ~500           | 1/partida  |
| Rival     | ~150           | 1/partida  |

**Estimativa por partida (15 min):** ~3.500 tokens


**Com Gemini Free Tier:** Suficiente para desenvolvimento

## Ferramentas

### Postman

Mantemos uma collection do Postman atualizada com todos os endpoints da API.
O arquivo está localizado em `docs/stonefall.postman_collection.json`.

> [!IMPORTANT]
> Sempre atualize o arquivo `docs/stonefall.postman_collection.json` quando adicionar ou modificar endpoints da API.
