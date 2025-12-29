# MVP 4 - Eras e Progressão

> **Status:** Não iniciado  
> **Tempo estimado:** 2-3 dias  
> **Pré-requisito:** MVP 3
>
> ⚠️ **Valores:** Consulte [`../game/balance.md`](../game/balance.md) e [`../game/eras.md`](../game/eras.md)

## Objetivo

Implementar sistema de evolução através das eras históricas.

## User Stories

- [ ] Como jogador, quero ver minha era atual
- [ ] Como jogador, quero ver requisitos para avançar de era
- [ ] Como jogador, quero desbloquear novas construções ao avançar
- [ ] Como jogador, quero receber um evento narrativo ao mudar de era

## Tasks Técnicas

### 1. Sistema de Eras (Shared)

- [ ] Criar constantes de requisitos por era
- [ ] Criar tipos `EraRequirements`, `EraProgress`
- [ ] Definir construções desbloqueadas por era

### 2. Lógica de Progressão (Store)

- [ ] Criar função `checkEraRequirements`
- [ ] Criar action `advanceEra`
- [ ] Criar selector `selectEraProgress`
- [ ] Aplicar modificadores de produção por era

### 3. Novas Construções

- [ ] Implementar Gold Mine (Mina de Ouro) - Era Bronze
- [ ] Implementar Barracks (Quartel) - Era Bronze
- [ ] Implementar Defense Tower (Torre) - Era Bronze
- [ ] Adicionar ao BuildPanel com filtro de era

### 4. UI de Progressão

- [ ] Criar componente `EraProgress`
- [ ] Mostrar barra de progresso visual
- [ ] Listar requisitos (✅ ou ❌)
- [ ] Botão "Avançar Era" (quando disponível)
- [ ] Modal de confirmação

### 5. Evento de Transição

- [ ] Gerar evento especial ao avançar de era (via IA)
- [ ] Aplicar bônus/efeitos de transição
- [ ] Registrar na crônica

## Eras

### Idade da Pedra (Stone Age) - Inicial
- Construções: Town Center, House, Farm, Sawmill, Mine
- Modificador de produção: 1.0x

### Idade do Bronze (Bronze Age)
- **Requisitos:** 80 stone, 30 gold, 15 pop, 1 mine
- Novas construções: Gold Mine, Barracks, Defense Tower
- Modificador de produção: 1.5x

### Idade do Ferro (Iron Age)
- **Requisitos:** 150 stone, 100 gold, 30 pop, 1 barracks
- Novas construções: (futuro)
- Modificador de produção: 2.0x

## Estrutura de Dados

```typescript
interface EraRequirements {
  resources: Partial<Resources>;
  population: number;
  buildings: BuildingType[];
}

interface EraProgress {
  currentEra: Era;
  nextEra: Era | null;
  requirements: EraRequirements;
  progress: {
    resources: Record<string, { current: number; required: number; met: boolean }>;
    population: { current: number; required: number; met: boolean };
    buildings: { type: BuildingType; met: boolean }[];
  };
  canAdvance: boolean;
}

const ERA_REQUIREMENTS: Record<Era, EraRequirements | null> = {
  [Era.Stone]: null, // Inicial
  [Era.Bronze]: {
    resources: { stone: 80, gold: 30 },
    population: 15,
    buildings: [BuildingType.Mine],
  },
  [Era.Iron]: {
    resources: { stone: 150, gold: 100 },
    population: 30,
    buildings: [BuildingType.Barracks],
  },
};
```

## Novas Construções (Bronze Age)

### Gold Mine (Mina de Ouro)
| Atributo | Valor             |
| -------- | ----------------- |
| Custo    | 40 wood, 30 stone |
| Tile     | gold              |
| Produção | +1 gold/tick      |

### Barracks (Quartel)
| Atributo | Valor                      |
| -------- | -------------------------- |
| Custo    | 50 wood, 30 stone, 10 gold |
| Efeito   | +25 força militar          |
| Limite   | 3                          |

### Defense Tower (Torre de Defesa)
| Atributo | Valor             |
| -------- | ----------------- |
| Custo    | 40 stone, 15 gold |
| Efeito   | +20 defesa        |
| Limite   | 4                 |

## UI de Progresso de Era

```
┌─────────────────────────────────────┐
│  Era: Idade da Pedra                │
│  ────────────────────────           │
│                                     │
│  Próxima Era: Idade do Bronze       │
│  [████████░░░░░░░░] 60%             │
│                                     │
│  Requisitos:                        │
│  ✅ 80 pedra (120/80)               │
│  ❌ 30 ouro (15/30)                 │
│  ✅ 15 população (18/15)            │
│  ✅ 1 mina construída               │
│                                     │
│  [Avançar Era] (desabilitado)       │
└─────────────────────────────────────┘
```

## Modificadores de Era

```typescript
const ERA_MODIFIERS: Record<Era, EraModifier> = {
  [Era.Stone]: {
    production: 1.0,
    consumption: 1.0,
  },
  [Era.Bronze]: {
    production: 1.5,
    consumption: 1.2,
  },
  [Era.Iron]: {
    production: 2.0,
    consumption: 1.5,
  },
};
```

## Critérios de Aceite

- [ ] Era atual aparece na UI
- [ ] Progresso de era é calculado corretamente
- [ ] Botão de avançar era funciona quando requisitos são atendidos
- [ ] Recursos são consumidos ao avançar
- [ ] Novas construções aparecem no BuildPanel após avançar
- [ ] Modificadores de produção são aplicados
- [ ] Evento de transição é gerado (se MVP 3 completo)

## Arquivos a Modificar/Criar

```
packages/shared/src/
├── constants/
│   └── game.ts            # Adicionar ERA_REQUIREMENTS
└── types/
    └── game.ts            # Adicionar EraProgress, EraRequirements

apps/web/src/
├── components/ui/
│   └── EraProgress.tsx    # Novo componente
├── store/
│   └── gameStore.ts       # Adicionar lógica de era
└── components/game/
    └── GameCanvas.tsx     # Integrar EraProgress
```

## Próximo MVP

Após concluir, seguir para `mvp-5.md` (Rival e Combate)
