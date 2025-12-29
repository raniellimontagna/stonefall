# MVP 6 - Narrativa e Polish

> **Status:** Não iniciado  
> **Tempo estimado:** 3-4 dias  
> **Pré-requisito:** MVP 5
>
> Este é o MVP final - prepara o jogo para versão 1.0 jogável.

## Objetivo

Criar sistema de crônica da civilização, telas de vitória/derrota e refinamentos gerais.

## User Stories

- [ ] Como jogador, quero ver uma linha do tempo da minha civilização
- [ ] Como jogador, quero receber um resumo narrativo ao final do jogo
- [ ] Como jogador, quero uma tela de vitória épica
- [ ] Como jogador, quero poder reiniciar facilmente
- [ ] Como jogador, quero uma experiência visual polida

## Tasks Técnicas

### 1. Sistema de Crônica

- [ ] Criar tipo `ChronicleEntry`
- [ ] Registrar eventos importantes (construções, eras, batalhas, eventos)
- [ ] Armazenar no store
- [ ] Criar componente `ChronicleTimeline`
- [ ] Permitir visualizar crônica durante o jogo

### 2. Resumo Final (IA)

- [ ] Criar endpoint `/api/chronicle/summarize`
- [ ] Enviar histórico completo para IA
- [ ] Receber narrativa épica da civilização
- [ ] Exibir na tela de fim de jogo

### 3. Telas de Fim de Jogo

- [ ] Criar componente `VictoryScreen`
- [ ] Criar componente `DefeatScreen`
- [ ] Mostrar estatísticas (duração, população máx, construções, etc)
- [ ] Exibir resumo narrativo
- [ ] Botões: "Jogar Novamente", "Ver Crônica"

### 4. Polish Visual

- [ ] Melhorar animações de UI
- [ ] Adicionar feedback visual para ações
- [ ] Refinar cores e tipografia
- [ ] Adicionar ícones para construções
- [ ] Melhorar responsividade

### 5. Polish de UX

- [ ] Tutorial básico (primeiro jogo)
- [ ] Tooltips informativos
- [ ] Atalhos de teclado
- [ ] Confirmações para ações importantes
- [ ] Mensagens de erro amigáveis

### 6. Balanceamento Final

- [ ] Playtest completo
- [ ] Ajustar valores de balance.md conforme necessário
- [ ] Garantir que jogo é completável em ~15min

## Sistema de Crônica

### Estrutura

```typescript
interface ChronicleEntry {
  id: string;
  tick: number;
  era: Era;
  type: 'building' | 'era' | 'event' | 'combat' | 'milestone';
  title: string;
  description: string;
  icon?: string;
}

interface Chronicle {
  civilizationName: string;
  startedAt: Date;
  entries: ChronicleEntry[];
  finalSummary?: string; // Gerado pela IA no fim
}
```

### Eventos Registrados

| Tipo      | Quando Registrar                    |
| --------- | ----------------------------------- |
| building  | Primeira construção de cada tipo    |
| era       | Mudança de era                      |
| event     | Evento importante (escolha do jogo) |
| combat    | Batalhas significativas             |
| milestone | População 20, 50, etc               |

## Prompt para Resumo Final

```
Você é um historiador narrando a saga de uma civilização.

Nome da civilização: {civName}
Duração: {duration} ciclos (ticks)
Era final: {finalEra}
Resultado: {victory/defeat}

Eventos importantes:
{chronileEntries}

Escreva um resumo épico de 3-4 parágrafos sobre a ascensão 
(e possível queda) desta civilização. Use um tom grandioso 
e poético, como um livro de história antiga.
```

## UI - Tela de Vitória

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│               🏆 VITÓRIA! 🏆                        │
│                                                     │
│    Sua civilização triunfou sobre os rivais        │
│    e ergueu-se como o maior império da era!        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│    [Resumo narrativo gerado pela IA aqui]          │
│    ...                                              │
│    ...                                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  📊 ESTATÍSTICAS                                   │
│  ─────────────────────────────                     │
│  Duração: 847 ticks (~14 minutos)                  │
│  Era final: Idade do Ferro                         │
│  População máxima: 42                              │
│  Construções: 23                                   │
│  Batalhas vencidas: 5                              │
│  Eventos enfrentados: 12                           │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [🔄 Jogar Novamente]  [📜 Ver Crônica Completa]   │
└─────────────────────────────────────────────────────┘
```

## UI - Linha do Tempo

```
┌─────────────────────────────────────────────────────┐
│  📜 CRÔNICA DA CIVILIZAÇÃO                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  IDADE DA PEDRA                                    │
│  ○───────────────────────────────────○              │
│  │                                                  │
│  ├─ Tick 1: Fundação do Centro da Vila             │
│  ├─ Tick 45: Primeira Fazenda construída           │
│  ├─ Tick 82: Evento: "Migração de Animais"         │
│  │                                                  │
│  IDADE DO BRONZE                                   │
│  ○───────────────────────────────────○              │
│  │                                                  │
│  ├─ Tick 180: Avanço para Idade do Bronze          │
│  ├─ Tick 195: Primeiro contato com [Rival]         │
│  ├─ Tick 250: Quartel construído                   │
│  │                                                  │
│  IDADE DO FERRO                                    │
│  ○───────────────────────────────────○              │
│  │                                                  │
│  └─ Tick 420: Vitória sobre [Rival]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Polish - Atalhos de Teclado

| Tecla    | Ação                     |
| -------- | ------------------------ |
| Space    | Pausar/Continuar         |
| 1, 2, 3  | Velocidade 1x, 2x, 4x    |
| B        | Abrir painel de build    |
| C        | Abrir crônica            |
| Escape   | Cancelar modo construção |
| M        | Ver status militar       |
| R        | Ver rival                |

## Polish - Feedback Visual

- [ ] Flash nos recursos quando mudam
- [ ] Animação de construção (fade in)
- [ ] Shake na câmera em eventos dramáticos
- [ ] Partículas de celebração na vitória
- [ ] Overlay vermelho em game over

## Estatísticas do Jogo

```typescript
interface GameStatistics {
  duration: number; // ticks
  realTimePlayed: number; // segundos
  finalEra: Era;
  maxPopulation: number;
  totalBuildings: number;
  totalBattles: number;
  battlesWon: number;
  eventsEncountered: number;
  resourcesGathered: Resources;
}
```

## Critérios de Aceite

- [ ] Crônica registra eventos automaticamente
- [ ] Posso ver crônica durante o jogo
- [ ] Tela de vitória aparece ao derrotar rival
- [ ] Tela de derrota aparece ao perder
- [ ] Resumo narrativo é gerado pela IA
- [ ] Estatísticas são calculadas corretamente
- [ ] Posso reiniciar o jogo facilmente
- [ ] Atalhos de teclado funcionam
- [ ] UI está polida e responsiva

## Arquivos a Criar/Modificar

```
packages/shared/src/
└── types/
    └── chronicle.ts       # Tipos da crônica

apps/api/src/
├── services/
│   └── chronicleSummarizer.ts  # Gerador de resumo
└── routes/
    └── chronicle.ts       # Endpoint de resumo

apps/web/src/
├── components/ui/
│   ├── ChronicleTimeline.tsx   # Linha do tempo
│   ├── VictoryScreen.tsx       # Tela de vitória
│   ├── DefeatScreen.tsx        # Tela de derrota
│   └── GameStats.tsx           # Estatísticas
├── store/
│   └── gameStore.ts       # Adicionar crônica + stats
└── styles/
    └── polish.css         # Animações e refinamentos
```

## Pós-MVP 6 (Futuro)

Após MVP 6, o jogo está completo para versão 1.0. Melhorias futuras:

- [ ] Salvar/carregar partidas
- [ ] Mais eras (Medieval, Renascimento)
- [ ] Múltiplos rivais
- [ ] Árvore tecnológica
- [ ] Customização de mapas
- [ ] Modo mobile responsivo
- [ ] Leaderboard online
- [ ] Multiplayer assíncrono

---

## 🎉 Parabéns!

Se você chegou até aqui, Stonefall está pronto para jogar!

**Versão 1.0 completa:**
- ✅ Mapa e câmera
- ✅ Recursos e construções
- ✅ População e economia
- ✅ Eventos gerados por IA
- ✅ Progressão de eras
- ✅ Rival e combate
- ✅ Crônica e narrativa
