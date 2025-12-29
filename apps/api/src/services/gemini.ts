/**
 * Gemini AI Client
 * Handles communication with Google's Gemini API
 */

import type { EventGenerationContext, EventType, GeneratedEventResponse } from '@stonefall/shared';

// Using gemini-2.5-flash (stable, released June 2025)
// Supports: generateContent, countTokens, createCachedContent, batchGenerateContent
// Token limits: 1M input, 65K output
// Note: v1beta is needed for latest models
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/** Get the API key from environment */
function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

/** Check if Gemini API is available */
export function isGeminiAvailable(): boolean {
  const available = !!getApiKey();
  console.log(`🔑 [Gemini] API Key available: ${available}`);
  if (available) {
    const key = getApiKey();
    console.log(`🔑 [Gemini] API Key length: ${key?.length} chars`);
  }
  return available;
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
    // Try to extract JSON from the response
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
      console.error('Invalid event structure:', parsed);
      return null;
    }

    if (parsed.choices.length < 2) {
      console.error('Event must have at least 2 choices');
      return null;
    }

    // Validate each choice
    for (const choice of parsed.choices) {
      if (!choice.text || !Array.isArray(choice.effects)) {
        console.error('Invalid choice structure:', choice);
        return null;
      }
    }

    return parsed as GeneratedEventResponse;
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    console.error('Raw response:', text);
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
    console.warn('⚠️  [Gemini] GEMINI_API_KEY not set, using fallback events');
    return null;
  }

  console.log(`🌐 [Gemini] Calling API for ${eventType} event...`);
  const prompt = buildEventPrompt(context, eventType);
  console.log(`📝 [Gemini] Prompt length: ${prompt.length} chars`);

  try {
    const url = `${GEMINI_API_URL}?key=${apiKey}`;
    console.log(`🔗 [Gemini] Request URL: ${GEMINI_API_URL}?key=***`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        },
      }),
    });

    console.log(`📡 [Gemini] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();

      // Special handling for quota errors
      if (response.status === 429) {
        console.warn('⚠️  [Gemini] QUOTA EXCEEDED - Gemini API free tier limit reached');
        console.warn('💡 [Gemini] Solution: Wait for daily reset or create new API key');
        console.warn('📚 [Gemini] Falling back to static events (game will work normally)');
      } else {
        console.error('❌ [Gemini] API error:', response.status, errorText);
      }

      return null;
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
        finishReason?: string;
      }>;
    };

    console.log('🔍 [Gemini] Full API response:', JSON.stringify(data, null, 2));

    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = data.candidates?.[0]?.finishReason;

    console.log(`🏁 [Gemini] Finish reason: ${finishReason}`);

    if (finishReason === 'MAX_TOKENS') {
      console.warn('⚠️  [Gemini] WARNING: Response was truncated due to token limit!');
    }

    if (!text) {
      console.error('❌ [Gemini] No text in response');
      return null;
    }

    console.log(`📨 [Gemini] Received response (${text.length} chars)`);
    console.log(`📄 [Gemini] Full response:\n${text}`);

    const parsed = parseResponse(text);
    if (parsed) {
      console.log(`✅ [Gemini] Successfully parsed event: "${parsed.title}"`);
    } else {
      console.log(`❌ [Gemini] Failed to parse response`);
    }

    return parsed;
  } catch (error) {
    console.error('❌ [Gemini] Exception during API call:', error);
    return null;
  }
}
