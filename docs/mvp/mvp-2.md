# MVP 2 - População e Tempo

> **Status:** ✅ Concluído  
> **Tempo estimado:** 2-3 dias  
> **Pré-requisito:** MVP 1
>
> ⚠️ **Valores:** Consulte [`../game/balance.md`](../game/balance.md) para valores atualizados.

## Objetivo

Adicionar gestão de população e controle do ciclo de tempo do jogo.

## User Stories

- [x] Como jogador, quero ver minha população atual
- [x] Como jogador, quero que a população consuma comida
- [x] Como jogador, quero construir casas para aumentar o limite
- [x] Como jogador, quero controlar a velocidade do jogo
- [x] Como jogador, quero pausar o jogo

## Tasks Técnicas

### 1. Sistema de População

- [x] Criar PopulationManager (integrado no gameStore)
- [x] Adicionar população ao store
- [x] População máxima baseada em casas
- [x] Crescimento populacional

### 2. Consumo de Recursos

- [x] População consome comida por tick
- [x] Penalidade se comida < 0
- [x] Morte por fome

### 3. Controle de Tempo

- [x] Criar TimeManager (integrado no GameScene)
- [x] Botões de velocidade (1x, 2x, 4x)
- [x] Botão de pausa
- [x] Indicador de tempo/tick

### 4. Nova Construção: Mina

- [ ] Implementar Mina
- [ ] Produz pedra ou ouro (baseado no tile)
- [ ] Tile válido: Mountain

### 5. UI de População

- [x] Indicador de população (atual/max)
- [x] Indicador de consumo
- [x] Alertas de fome

## Mecânicas de População

> Valores de referência - ver `balance.md` para valores finais

```
População inicial = 5
População máxima = 10 + (casas × 5)
Consumo de comida = população × 0.3 / tick
Crescimento = +1 população a cada 20 ticks (se comida > 0)
```

## Penalidades por Fome

| Comida | Efeito              |
| ------ | ------------------- |
| > 0    | Normal              |
| = 0    | Sem crescimento     |
| < -20  | -1 população/5 tick |
| < -50  | Derrota             |

## Construção: Mina

- **Custo:** 30 madeira, 15 pedra
- **Produção em Mountain:** +2 pedra/tick
- **Tile válido:** Mountain apenas

> **Nota:** Mina de Ouro é construção separada, disponível na Era do Bronze

## Velocidades de Jogo

| Velocidade | Ticks/segundo |
| ---------- | ------------- |
| Pausado    | 0             |
| 1x         | 1             |
| 2x         | 2             |
| 3x         | 4             |

## UI de Tempo

```
[⏸] [▶] [▶▶] [▶▶▶]    Tick: 142
```

## Critérios de Aceite

- [x] População aparece na UI
- [x] Casas aumentam limite de população
- [x] Comida é consumida pela população
- [x] Posso pausar o jogo
- [x] Posso acelerar o jogo
- [ ] Mina funciona em montanhas
- [x] Alerta aparece quando comida está baixa
- [x] Game over se ficar sem comida por muito tempo

## Próximo MVP

Após concluir, seguir para `mvp-3.md` (Eventos com IA)
