# Sistema de Rivais (IA)

> ⚠️ **V1 Simplificado:** Na V1, o rival é abstrato (não visível no mapa). Features como memória, personalidades funcionais, e diplomacia estão planejadas para V2.

## Visão Geral

O rival é uma civilização controlada por IA que compete com o jogador. No MVP, há apenas 1 rival com personalidade única gerada no início da partida.

## Atributos do Rival

```typescript
interface Rival {
  id: string;
  name: string; // Gerado por IA
  personality: Personality;
  strategy: Strategy;
  resources: Resources;
  military: number;
  relation: number; // -100 a 100
  memory: RivalMemory[];
}

type Personality = "aggressive" | "defensive" | "diplomatic" | "expansionist";
type Strategy = "rush" | "turtle" | "economic" | "balanced";
```

## Personalidades

### ⚔️ Agressivo (Aggressive)

- Prioriza força militar
- Ataca frequentemente
- Difícil de negociar
- Respeita força

### 🛡️ Defensivo (Defensive)

- Prioriza defesa
- Raramente ataca primeiro
- Aceita acordos de paz
- Retalia se atacado

### 🕊️ Diplomático (Diplomatic)

- Prioriza relações
- Propõe alianças
- Comércio frequente
- Evita conflito direto

### 🌍 Expansionista (Expansionist)

- Prioriza território
- Conflita por recursos
- Acordos temporários
- Sempre quer mais

## Sistema de Memória

O rival lembra das ações do jogador:

```typescript
interface RivalMemory {
  tick: number;
  action: string;
  impact: number; // -10 a +10 na relação
}
```

### Ações que afetam a relação

| Ação do Jogador  | Impacto |
| ---------------- | ------- |
| Atacar rival     | -30     |
| Aceitar acordo   | +20     |
| Recusar acordo   | -10     |
| Ajudar em evento | +15     |
| Roubar recursos  | -25     |
| Enviar presente  | +10     |

## Comportamento por Era

### Idade da Pedra

- Rival está em desenvolvimento
- Sem interações diretas
- Preparando-se

### Idade do Bronze

- Primeiro contato
- Proposta de comércio ou ameaça (baseado em personalidade)
- Conflitos menores possíveis

### Idade do Ferro

- Conflito ou aliança definidos
- Ações mais frequentes
- Caminho para conclusão

## IA do Rival

### Tomada de Decisão

```
A cada 5 ticks:
1. Avaliar estado próprio (recursos, militar)
2. Avaliar relação com jogador
3. Considerar personalidade
4. Escolher ação

Ações possíveis:
- Nada (continuar desenvolvendo)
- Propor comércio
- Propor aliança
- Enviar ameaça
- Atacar
- Fortificar defesas
```

### Prompt para Gerar Rival

```
Gere uma civilização rival para um jogo de estratégia histórica.

Inclua:
1. Nome da civilização (criativo, inspirado em história antiga)
2. Nome do líder
3. Personalidade (aggressive/defensive/diplomatic/expansionist)
4. Uma frase característica
5. Cores da civilização (primária, secundária)

Formato JSON:
{
  "civName": "...",
  "leaderName": "...",
  "personality": "...",
  "motto": "...",
  "colors": {
    "primary": "#...",
    "secondary": "#..."
  }
}
```

## Interações

### Proposta do Rival

```
┌─────────────────────────────────────┐
│  📜 MENSAGEM DE [RIVAL]             │
├─────────────────────────────────────┤
│                                     │
│  "Líder de terras distantes,        │
│  propomos uma troca: 50 de nossa    │
│  madeira por 30 de seu ouro."       │
│                                     │
│  - [Líder], dos [Civilização]       │
│                                     │
├─────────────────────────────────────┤
│  [Aceitar]  [Recusar]  [Contra-proposta]
└─────────────────────────────────────┘
```

### Declaração de Guerra

```
┌─────────────────────────────────────┐
│  ⚔️ DECLARAÇÃO DE GUERRA            │
├─────────────────────────────────────┤
│                                     │
│  "[Rival] declarou guerra contra    │
│  sua civilização!"                  │
│                                     │
│  "Suas terras serão nossas antes    │
│  que a lua complete seu ciclo."     │
│                                     │
├─────────────────────────────────────┤
│  [Preparar Defesas]  [Contra-atacar]│
└─────────────────────────────────────┘
```

## Escalada de Conflito

```
Relação > 50:  Aliados (bônus de comércio)
Relação 20-50: Amigáveis (comércio possível)
Relação -20-20: Neutros
Relação -50--20: Tensão (ameaças)
Relação < -50: Hostis (guerra iminente)
Relação < -80: Guerra declarada
```

## Vitória/Derrota do Rival

### Jogador vence quando:

- Centro da Vila do rival é destruído
- Rival aceita rendição

### Jogador perde quando:

- Centro da Vila próprio é destruído
- Aceita termos de rendição desfavoráveis

## Futuro (Múltiplos Rivais)

- 2-4 civilizações rivais
- Diplomacia entre rivais
- Alianças contra jogador
- Traições possíveis
