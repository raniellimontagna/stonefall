/**
 * Gemini AI Client
 * Handles communication with Google's Gemini API
 */

import type { EventGenerationContext, EventType, GeneratedEventResponse } from '@stonefall/shared';
import { geminiLogger as log } from '../lib/logger';

// Using gemini-2.5-flash (stable, released June 2025)
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/** Get the API key from environment */
function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

/** Check if Gemini API is available */
export function isGeminiAvailable(): boolean {
  return !!getApiKey();
}

/** Build the prompt for event generation */
function buildEventPrompt(context: EventGenerationContext, eventType: EventType): string {
  const eraNames: Record<string, string> = {
    stone: 'Idade da Pedra',
    bronze: 'Idade do Bronze',
    iron: 'Idade do Ferro',
  };

  const eventTypeNames: Record<EventType, string> = {
    economic: 'econômico (relacionado a recursos, comida, produção)',
    social: 'social (relacionado a população, festividades, migrações)',
    natural: 'natural (clima, desastres, fenômenos)',
    military: 'militar (conflitos, defesa, ameaças)',
    political: 'político (liderança, decisões, diplomacia)',
  };

  return `Você é um narrador de um jogo de estratégia histórica ambientado na ${eraNames[context.era]}.

Estado atual da civilização do jogador:
- Era: ${eraNames[context.era]}
- Tick (ciclo de jogo): ${context.tick}
- População: ${context.population}
- Recursos: Comida ${context.resources.food}, Madeira ${context.resources.wood}, Pedra ${context.resources.stone}, Ouro ${context.resources.gold}

Gere um evento ${eventTypeNames[eventType]} único e interessante.

REGRAS IMPORTANTES:
1. O título deve ter no MÁXIMO 4 palavras
2. A descrição deve ter 2-3 frases, em tom épico e narrativo
3. Cada escolha deve ter consequências DIFERENTES e significativas
4. Os valores de efeito devem ser entre -50 e +50
5. Sempre inclua duas escolhas distintas
6. Use português brasileiro

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem código):
{
  "title": "Título Curto",
  "description": "Descrição narrativa em 2-3 frases...",
  "choices": [
    {
      "text": "Texto da primeira escolha",
      "effects": [{"type": "resource", "target": "food", "value": -20}]
    },
    {
      "text": "Texto da segunda escolha", 
      "effects": [{"type": "resource", "target": "wood", "value": 15}]
    }
  ]
}

Tipos de efeito válidos:
- {"type": "resource", "target": "food|wood|stone|gold", "value": número}
- {"type": "population", "target": "current", "value": número}`;
}

/** Parse and validate AI response */
function parseResponse(text: string): GeneratedEventResponse | null {
  try {
    let jsonStr = text.trim();

    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }

    jsonStr = jsonStr.trim();
    const parsed = JSON.parse(jsonStr);

    // Validate structure
    if (!parsed.title || !parsed.description || !Array.isArray(parsed.choices)) {
      log.warn({ parsed }, 'Invalid event structure');
      return null;
    }

    if (parsed.choices.length < 2) {
      log.warn('Event must have at least 2 choices');
      return null;
    }

    // Validate each choice
    for (const choice of parsed.choices) {
      if (!choice.text || !Array.isArray(choice.effects)) {
        log.warn({ choice }, 'Invalid choice structure');
        return null;
      }
    }

    return parsed as GeneratedEventResponse;
  } catch (error) {
    log.error({ error, rawResponse: text }, 'Failed to parse AI response');
    return null;
  }
}

/** Generate an event using Gemini AI */
export async function generateEvent(
  context: EventGenerationContext,
  eventType: EventType
): Promise<GeneratedEventResponse | null> {
  const apiKey = getApiKey();

  if (!apiKey) {
    log.warn('GEMINI_API_KEY not set, using fallback events');
    return null;
  }

  log.debug({ eventType }, 'Calling Gemini API');
  const prompt = buildEventPrompt(context, eventType);

  try {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 429) {
        log.warn('Quota exceeded - falling back to static events');
      } else {
        log.error({ status: response.status, error: errorText }, 'API error');
      }

      return null;
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = data.candidates?.[0]?.finishReason;

    if (finishReason === 'MAX_TOKENS') {
      log.warn('Response truncated due to token limit');
    }

    if (!text) {
      log.error('No text in response');
      return null;
    }

    const parsed = parseResponse(text);
    if (parsed) {
      log.info({ title: parsed.title }, 'Generated event successfully');
    }

    return parsed;
  } catch (error) {
    log.error({ error }, 'Exception during API call');
    return null;
  }
}
