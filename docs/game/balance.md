# Balanceamento do Jogo

> **Este documento é a fonte única de verdade para todos os valores numéricos do jogo.**
> Use-o para contexto de IA e implementação.

## 📅 Última Revisão: 29/12/2025

---

## ⏱️ Tempo e Ticks

| Configuração       | Valor   | Notas           |
| ------------------ | ------- | --------------- |
| Ticks por segundo  | 1       | Velocidade 1x   |
| Duração alvo       | 15min   | ~900 ticks      |
| Tick de early game | 0-200   | Idade da Pedra  |
| Tick de mid game   | 200-500 | Idade do Bronze |
| Tick de late game  | 500+    | Idade do Ferro  |

---

## 🌾 Recursos Iniciais

| Recurso | Quantidade | Justificativa                      |
| ------- | ---------- | ---------------------------------- |
| Comida  | 150        | Buffer para primeiros 50 ticks     |
| Madeira | 60         | Suficiente para 1 Casa + 1 Fazenda |
| Pedra   | 30         | Suficiente para 1 Fazenda          |
| Ouro    | 0          | Recurso de mid-game                |

---

## 👥 População

| Configuração          | Valor      | Notas                            |
| --------------------- | ---------- | -------------------------------- |
| População inicial     | 5          | Começa com 5 habitantes          |
| Pop máxima inicial    | 10         | Sem casas                        |
| Pop por casa          | +5         | Cada casa adiciona 5             |
| Consumo por habitante | 0.3/tick   | Reduzido de 0.5 para viabilidade |
| Crescimento           | +1/20 tick | Se comida > 0                    |
| Morte por fome        | -1/5 tick  | Se comida < -20                  |

### Cálculos de Viabilidade

```
Pop inicial: 5
Consumo: 5 × 0.3 = 1.5 comida/tick

Centro produz: +1.5 comida/tick (aumentado)
Resultado: 0 (neutro)

Com 1 Fazenda (+3): +1.5/tick (crescimento sustentável)
```

---

## 🏗️ Construções

### Centro da Vila

| Atributo | Valor                               |
| -------- | ----------------------------------- |
| Custo    | Gratuito (1 no início)              |
| Limite   | 1                                   |
| Era      | Pedra                               |
| Produção | +1.5 comida, +1 madeira, +0.5 pedra |
| HP       | 500                                 |
| Pop base | +10 população máxima                |

### Casa

| Atributo | Valor         |
| -------- | ------------- |
| Custo    | 25 madeira    |
| Limite   | Ilimitado     |
| Era      | Pedra         |
| Efeito   | +5 pop máxima |
| HP       | 100           |

### Fazenda

| Atributo | Valor               |
| -------- | ------------------- |
| Custo    | 15 madeira, 5 pedra |
| Limite   | Ilimitado           |
| Era      | Pedra               |
| Tile     | Plains              |
| Produção | +3 comida/tick      |
| HP       | 50                  |

### Serraria (NOVO - substituir produção de madeira)

| Atributo | Valor           |
| -------- | --------------- |
| Custo    | 20 pedra        |
| Limite   | Ilimitado       |
| Era      | Pedra           |
| Tile     | Forest          |
| Produção | +2 madeira/tick |
| HP       | 75              |

### Mina

| Atributo | Valor                |
| -------- | -------------------- |
| Custo    | 30 madeira, 15 pedra |
| Limite   | Ilimitado            |
| Era      | Pedra                |
| Tile     | Mountain             |
| Produção | +2 pedra/tick        |
| HP       | 100                  |

### Mina de Ouro (tile especial)

| Atributo | Valor                |
| -------- | -------------------- |
| Custo    | 40 madeira, 30 pedra |
| Limite   | 1 por tile de ouro   |
| Era      | Bronze               |
| Tile     | Mountain (gold)      |
| Produção | +1 ouro/tick         |
| HP       | 100                  |

### Quartel

| Atributo | Valor                         |
| -------- | ----------------------------- |
| Custo    | 50 madeira, 30 pedra, 10 ouro |
| Limite   | 3                             |
| Era      | Bronze                        |
| Efeito   | +25 força militar             |
| HP       | 200                           |

### Torre de Defesa

| Atributo | Valor             |
| -------- | ----------------- |
| Custo    | 40 pedra, 15 ouro |
| Limite   | 4                 |
| Era      | Bronze            |
| Efeito   | +20 defesa        |
| HP       | 300               |

---

## ⚔️ Combate

### Força Base por Era

| Era    | Força Base | Defesa Base |
| ------ | ---------- | ----------- |
| Pedra  | 10         | 10          |
| Bronze | 30         | 30          |
| Ferro  | 60         | 60          |

### Cálculo de Poder Militar

```
Força Total = Força Base (Era) + (Quartéis × 25)
Defesa Total = Defesa Base (Era) + (Torres × 20)

Máximo possível:
- Força: 60 + (3 × 25) = 135
- Defesa: 60 + (4 × 20) = 140

Proporção Força/Defesa: ~1:1 (balanceado)
```

### Custos de Ações

| Ação     | Custo              | Cooldown |
| -------- | ------------------ | -------- |
| Atacar   | 15 comida, 5 ouro  | 10 ticks |
| Defender | 10 comida          | 5 ticks  |
| Cerco    | 25 comida, 15 ouro | 20 ticks |
| Negociar | 20 ouro            | 15 ticks |

---

## 🏛️ Progressão de Eras

### Idade da Pedra → Bronze

| Requisito   | Valor  |
| ----------- | ------ |
| Pedra       | 80     |
| Ouro        | 30     |
| População   | 15     |
| Construções | 1 Mina |

**Tempo estimado:** ~150-200 ticks

### Idade do Bronze → Ferro

| Requisito   | Valor     |
| ----------- | --------- |
| Pedra       | 150       |
| Ouro        | 100       |
| População   | 30        |
| Construções | 1 Quartel |

**Tempo estimado:** ~300-400 ticks

---

## 📍 Tiles do Mapa

### Tipos de Tile

| Tipo     | Código   | Cor Placeholder | Frequência |
| -------- | -------- | --------------- | ---------- |
| Plains   | plains   | #90EE90         | 50%        |
| Forest   | forest   | #228B22         | 25%        |
| Mountain | mountain | #808080         | 15%        |
| Water    | water    | #4169E1         | 8%         |
| Gold     | gold     | #FFD700         | 2%         |

### Restrições de Construção

| Construção   | Tiles Válidos            |
| ------------ | ------------------------ |
| Centro       | plains, forest           |
| Casa         | plains, forest           |
| Fazenda      | plains                   |
| Serraria     | forest                   |
| Mina         | mountain                 |
| Mina de Ouro | gold                     |
| Quartel      | plains, forest           |
| Torre        | plains, forest, mountain |

---

## 🎲 Eventos

### Frequência

| Era    | Intervalo (ticks) | Chance por tick |
| ------ | ----------------- | --------------- |
| Pedra  | 30-50             | 2.5%            |
| Bronze | 20-40             | 4%              |
| Ferro  | 15-30             | 5%              |

### Peso por Tipo (baseado em estado)

```typescript
function getEventWeights(state: GameState): EventWeights {
  return {
    economic: state.resources.food < 50 ? 3 : 1,
    social: state.population > 20 ? 2 : 1,
    military: state.era !== "stone" ? 2 : 0,
    political: state.rivalRelation < 0 ? 2 : 1,
    natural: 1, // sempre igual
  };
}
```

### Impacto por Categoria

| Categoria  | Impacto Mínimo | Impacto Máximo |
| ---------- | -------------- | -------------- |
| Positivo   | +10%           | +30%           |
| Neutro     | -5%            | +5%            |
| Negativo   | -10%           | -30%           |
| Catástrofe | -30%           | -50%           |

---

## 🤖 Rival

### Recursos do Rival (espelho do jogador)

```typescript
function calculateRivalResources(
  tick: number,
  difficulty: Difficulty
): Resources {
  const base = {
    easy: 0.7,
    normal: 1.0,
    hard: 1.3,
  };

  return {
    food: 100 + tick * 2 * base[difficulty],
    wood: 50 + tick * 1 * base[difficulty],
    stone: 25 + tick * 0.5 * base[difficulty],
    gold: tick > 200 ? tick * 0.3 * base[difficulty] : 0,
  };
}
```

### Força Militar do Rival

| Tick    | Força (Normal) |
| ------- | -------------- |
| 0-100   | 10-20          |
| 100-200 | 20-40          |
| 200-400 | 40-80          |
| 400+    | 80-120         |

---

## ✅ Checklist de Balanceamento

Ao adicionar novo conteúdo, verifique:

- [ ] Custo é proporcional ao benefício?
- [ ] Jogador consegue alcançar em tempo razoável?
- [ ] Não quebra curva de progressão?
- [ ] Tem contrapartida (trade-off)?
- [ ] Funciona em todas as eras?
- [ ] IA consegue usar/entender?

---

## 📝 Notas de Design

### Filosofia de Balanceamento

1. **Jogador deve ter escolhas difíceis** - Não deve ser óbvio o que fazer
2. **Curva de aprendizado suave** - Primeiros minutos são gentis
3. **Pressão crescente** - Dificuldade aumenta com o tempo
4. **Múltiplos caminhos** - Não há "build order" única perfeita
5. **Catchup mechanics** - Eventos ajudam quem está atrás

### Ajustes Futuros

Este documento será atualizado após playtests. Valores atuais são estimativas baseadas em:

- Jogos similares (Age of Empires, Civilization)
- Cálculos matemáticos de viabilidade
- Duração alvo de 15-20 minutos
