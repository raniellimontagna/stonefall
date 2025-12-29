# MVP 5 - Rival e Combate

> **Status:** Não iniciado  
> **Tempo estimado:** 4-5 dias  
> **Pré-requisito:** MVP 4
>
> ⚠️ **Valores:** Consulte [`../game/balance.md`](../game/balance.md), [`../game/rivals.md`](../game/rivals.md) e [`../game/combat.md`](../game/combat.md)

## Objetivo

Adicionar uma civilização rival controlada por IA e sistema de combate estratégico.

## User Stories

- [ ] Como jogador, quero enfrentar uma civilização rival
- [ ] Como jogador, quero ver a força militar do meu rival
- [ ] Como jogador, quero escolher estratégias de combate
- [ ] Como jogador, quero receber narrativas de batalhas geradas por IA
- [ ] Como jogador, quero ganhar ou perder o jogo baseado em conflito

## Tasks Técnicas

### 1. Sistema de Rival (Shared + Backend)

- [ ] Criar tipos `Rival`, `RivalPersonality`, `RivalMemory`
- [ ] Criar endpoint `/api/rival/generate` (gerar rival via IA)
- [ ] Criar sistema de memória do rival (lembra ações do jogador)
- [ ] Implementar lógica de progressão do rival (recursos/força por tick)

### 2. Atributos Militares (Store)

- [ ] Adicionar `military: { strength, defense, moral }` ao state
- [ ] Criar selectors `selectMilitary`, `selectRival`
- [ ] Calcular força baseado em construções (Quartel = +25, Torre = +20)
- [ ] Adicionar moral (baseado em comida, vitórias, derrotas)

### 3. Sistema de Combate

- [ ] Criar tipos `CombatStrategy`, `CombatResult`
- [ ] Implementar fórmula de combate
- [ ] Criar actions: `attack`, `defend`, `siege`, `negotiate`
- [ ] Implementar cooldowns de ações
- [ ] Criar endpoint `/api/combat/narrate` (IA narra batalha)

### 4. IA do Rival

- [ ] Implementar tomada de decisão (a cada X ticks)
- [ ] Personalidades: aggressive, defensive, diplomatic, expansionist
- [ ] Sistema de relação (-100 a +100)
- [ ] Ações: propor comércio, ameaçar, atacar, fortificar

### 5. UI de Combate

- [ ] Criar componente `MilitaryStatus`
- [ ] Criar componente `RivalPanel`
- [ ] Criar componente `CombatModal`
- [ ] Mostrar resultado de batalha com narrativa

### 6. Condições de Vitória/Derrota

- [ ] Vitória: Derrotar rival ou domínio total
- [ ] Derrota: Perder Town Center ou população = 0
- [ ] Criar tela de fim de jogo

## Estrutura de Dados

```typescript
interface Rival {
  id: string;
  name: string;
  leaderName: string;
  personality: 'aggressive' | 'defensive' | 'diplomatic' | 'expansionist';
  motto: string;
  colors: { primary: string; secondary: string };
  resources: Resources;
  military: MilitaryStatus;
  relation: number; // -100 a +100
  memory: RivalMemory[];
  isDefeated: boolean;
}

interface MilitaryStatus {
  strength: number;
  defense: number;
  moral: number;
}

interface RivalMemory {
  tick: number;
  action: string;
  impact: number;
}

type CombatStrategy = 'attack' | 'defend' | 'siege' | 'negotiate';

interface CombatResult {
  strategy: CombatStrategy;
  attacker: 'player' | 'rival';
  winner: 'player' | 'rival' | 'draw';
  playerLosses: Partial<Resources>;
  rivalLosses: Partial<Resources>;
  narrative: string; // Gerado por IA
  relationChange: number;
}
```

## Fórmula de Combate

```typescript
function calculateCombat(
  attackerStrength: number,
  defenderDefense: number,
  attackerMoral: number,
  defenderMoral: number
): CombatResult {
  const attackPower = attackerStrength * (attackerMoral / 100) * random(0.8, 1.2);
  const defensePower = defenderDefense * (defenderMoral / 100) * random(0.8, 1.2);
  
  if (attackPower > defensePower * 1.2) {
    return 'decisive_victory';
  } else if (attackPower > defensePower) {
    return 'marginal_victory';
  } else if (defensePower > attackPower * 1.2) {
    return 'decisive_defeat';
  } else if (defensePower > attackPower) {
    return 'marginal_defeat';
  }
  return 'draw';
}
```

## Estratégias de Combate

| Estratégia | Custo            | Cooldown | Efeito                    |
| ---------- | ---------------- | -------- | ------------------------- |
| Atacar     | 15 food, 5 gold  | 10 ticks | Ataque direto             |
| Defender   | 10 food          | 5 ticks  | +50% defesa por 5 ticks   |
| Cerco      | 25 food, 15 gold | 20 ticks | Drena recursos do inimigo |
| Negociar   | 20 gold          | 15 ticks | Tenta acordo de paz       |

## Comportamento do Rival por Era

### Idade da Pedra
- Rival inativo (se desenvolvendo)
- Sem interações diretas

### Idade do Bronze
- Primeiro contato (evento especial)
- Proposta de comércio ou ameaça
- Conflitos menores possíveis

### Idade do Ferro
- Conflitos frequentes
- Caminho para vitória/derrota
- Ações mais agressivas

## UI de Status Militar

```
┌─────────────────────────────────────┐
│  ⚔️ FORÇA MILITAR                   │
├─────────────────────────────────────┤
│  Força:  ████████░░ 80              │
│  Defesa: ██████░░░░ 60              │
│  Moral:  ████████░░ 80%             │
├─────────────────────────────────────┤
│  Quartéis: 2/3  Torres: 1/4         │
└─────────────────────────────────────┘
```

## UI do Rival

```
┌─────────────────────────────────────┐
│  🏛️ [NOME DO RIVAL]                 │
│  Líder: [Nome do Líder]             │
│  "{Motto}"                          │
├─────────────────────────────────────┤
│  Relação: ████░░░░░░ Hostil (-40)   │
│  Força:   ██████░░░░ 60             │
├─────────────────────────────────────┤
│  [⚔️ Atacar] [🛡️ Defender]          │
│  [🏰 Cerco]  [🕊️ Negociar]          │
└─────────────────────────────────────┘
```

## Prompt para Gerar Rival

```
Gere uma civilização rival para um jogo de estratégia histórica.

Inclua:
1. Nome da civilização (criativo, inspirado em história antiga)
2. Nome do líder
3. Personalidade (aggressive/defensive/diplomatic/expansionist)
4. Uma frase característica (motto)
5. Cores (primária, secundária em hex)

Formato JSON:
{
  "civName": "...",
  "leaderName": "...",
  "personality": "...",
  "motto": "...",
  "colors": { "primary": "#...", "secondary": "#..." }
}
```

## Prompt para Narrar Batalha

```
Narre uma batalha entre duas civilizações.

Atacante: {attacker} (força: {attackerStrength})
Defensor: {defender} (defesa: {defenderDefense})
Estratégia: {strategy}
Resultado: {result}
Era: {era}

Escreva uma narrativa épica de 2-3 frases sobre a batalha.
```

## Critérios de Aceite

- [ ] Rival é gerado com nome/personalidade únicos
- [ ] Status militar aparece na UI
- [ ] Quartel e Torre aumentam força/defesa
- [ ] Posso atacar rival (com cooldown)
- [ ] Resultado de combate é calculado e narrado
- [ ] Relação com rival muda baseado em ações
- [ ] Rival toma ações próprias na Idade do Bronze+
- [ ] Condições de vitória/derrota funcionam

## Arquivos a Criar/Modificar

```
packages/shared/src/
├── types/
│   ├── rival.ts           # Tipos do rival
│   └── combat.ts          # Tipos de combate
└── constants/
    └── combat.ts          # Constantes de combate

apps/api/src/
├── services/
│   ├── rivalGenerator.ts  # Gerador de rival
│   └── combatNarrator.ts  # Narrador de batalhas
└── routes/
    ├── rival.ts           # Endpoints do rival
    └── combat.ts          # Endpoints de combate

apps/web/src/
├── components/ui/
│   ├── MilitaryStatus.tsx # Status militar
│   ├── RivalPanel.tsx     # Painel do rival
│   └── CombatModal.tsx    # Modal de combate
└── store/
    └── gameStore.ts       # Adicionar militar + rival
```

## Próximo MVP

Após concluir, seguir para `mvp-6.md` (Narrativa e Polish)
