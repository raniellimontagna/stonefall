# MVP 2 - População e Tempo

> **Status:** Não iniciado  
> **Tempo estimado:** 2-3 dias  
> **Pré-requisito:** MVP 1

## Objetivo

Adicionar gestão de população e controle do ciclo de tempo do jogo.

## User Stories

- [ ] Como jogador, quero ver minha população atual
- [ ] Como jogador, quero que a população consuma comida
- [ ] Como jogador, quero construir casas para aumentar o limite
- [ ] Como jogador, quero controlar a velocidade do jogo
- [ ] Como jogador, quero pausar o jogo

## Tasks Técnicas

### 1. Sistema de População

- [ ] Criar PopulationManager
- [ ] Adicionar população ao store
- [ ] População máxima baseada em casas
- [ ] Crescimento populacional

### 2. Consumo de Recursos

- [ ] População consome comida por tick
- [ ] Penalidade se comida < 0
- [ ] Morte por fome

### 3. Controle de Tempo

- [ ] Criar TimeManager
- [ ] Botões de velocidade (1x, 2x, 3x)
- [ ] Botão de pausa
- [ ] Indicador de tempo/tick

### 4. Nova Construção: Mina

- [ ] Implementar Mina
- [ ] Produz pedra ou ouro (baseado no tile)
- [ ] Tile válido: Mountain

### 5. UI de População

- [ ] Indicador de população (atual/max)
- [ ] Indicador de consumo
- [ ] Alertas de fome

## Mecânicas de População

```
População máxima = 5 + (casas × 5)
Consumo de comida = população × 0.5 / tick
Crescimento = +1 população a cada 10 ticks (se comida > 0)
```

## Penalidades por Fome

| Comida | Efeito            |
| ------ | ----------------- |
| > 0    | Normal            |
| = 0    | Sem crescimento   |
| < -10  | -1 população/tick |
| < -50  | Derrota           |

## Construção: Mina

- **Custo:** 40 madeira, 20 pedra
- **Produção em Mountain:** +2 pedra/tick
- **Produção em Mountain (ouro):** +0.5 ouro/tick
- **Tile válido:** Mountain apenas

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

- [ ] População aparece na UI
- [ ] Casas aumentam limite de população
- [ ] Comida é consumida pela população
- [ ] Posso pausar o jogo
- [ ] Posso acelerar o jogo
- [ ] Mina funciona em montanhas
- [ ] Alerta aparece quando comida está baixa
- [ ] Game over se ficar sem comida por muito tempo

## Próximo MVP

Após concluir, seguir para `mvp-3.md` (Eventos com IA)
