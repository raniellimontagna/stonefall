# Balanceamento do Jogo

> **Este documento é a fonte única de verdade para todos os valores numéricos do jogo.**
> Use-o para contexto de IA e implementação.
>
> 📖 **Nomenclatura:** Ver [`glossary.md`](./glossary.md) para termos PT→EN

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

| Recurso | Código  | Quantidade | Justificativa                    |
| ------- | ------- | ---------- | -------------------------------- |
| Comida  | `food`  | 150        | Buffer para primeiros 50 ticks   |
| Madeira | `wood`  | 60         | Suficiente para 1 House + 1 Farm |
| Pedra   | `stone` | 30         | Suficiente para 1 Farm           |
| Ouro    | `gold`  | 0          | Recurso de mid-game              |

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

> Nomes de código em inglês - ver glossary.md

### Town Center (Centro da Vila)

| Atributo | Valor                          |
| -------- | ------------------------------ |
| Código   | `town_center`                  |
| Custo    | Gratuito (1 no início)         |
| Limite   | 1                              |
| Era      | stone                          |
| Produção | +0.8 food, +0.5 wood, +0.2 stone |
| HP       | 500                            |
| Pop base | +10 população máxima           |

### House (Casa)

| Atributo | Valor         |
| -------- | ------------- |
| Código   | `house`       |
| Custo    | 25 wood       |
| Limite   | Ilimitado     |
| Era      | stone         |
| Efeito   | +5 pop máxima |
| HP       | 100           |

### Farm (Fazenda)

| Atributo | Valor            |
| -------- | ---------------- |
| Código   | `farm`           |
| Custo    | 15 wood, 5 stone |
| Limite   | Ilimitado        |
| Era      | stone            |
| Tile     | plains           |
| Produção | +1.5 food/tick   |
| HP       | 50               |

### Sawmill (Serraria)

| Atributo | Valor        |
| -------- | ------------ |
| Código   | `sawmill`    |
| Custo    | 20 stone     |
| Limite   | Ilimitado    |
| Era      | stone        |
| Tile     | forest       |
| Produção | +1 wood/tick |
| HP       | 75           |

### Mine (Mina)

| Atributo | Valor             |
| -------- | ----------------- |
| Código   | `mine`            |
| Custo    | 30 wood, 15 stone |
| Limite   | Ilimitado         |
| Era      | stone             |
| Tile     | mountain          |
| Produção | +1 stone/tick     |
| HP       | 100               |

### Gold Mine (Mina de Ouro)

| Atributo | Valor             |
| -------- | ----------------- |
| Código   | `gold_mine`       |
| Custo    | 40 wood, 30 stone |
| Limite   | 1 por tile gold   |
| Era      | bronze            |
| Tile     | gold              |
| Produção | +0.2 gold/tick    |
| HP       | 100               |

### Barracks (Quartel)

| Atributo | Valor                      |
| -------- | -------------------------- |
| Código   | `barracks`                 |
| Custo    | 50 wood, 30 stone, 10 gold |
| Limite   | 3                          |
| Era      | bronze                     |
| Efeito   | +25 strength               |
| HP       | 200                        |

### Defense Tower (Torre de Defesa)

| Atributo | Valor             |
| -------- | ----------------- |
| Código   | `defense_tower`   |
| Custo    | 40 stone, 15 gold |
| Limite   | 4                 |
| Era      | bronze            |
| Efeito   | +20 defense       |
| HP       | 300               |

---

## ⚔️ Combate

### Força Militar do Jogador

| Construção     | Bônus     |
| -------------- | --------- |
| Quartel        | +25 força |
| Torre de Defesa | +20 defesa |

```
Força Total = Quartéis × 25
Defesa Total = Torres × 20

Máximo possível (Bronze Age):
- Força: 3 × 25 = 75
- Defesa: 4 × 20 = 80
```

### Rival

| Era    | Força | Defesa | HP  |
| ------ | ----- | ------ | --- |
| Pedra  | 15    | 10     | 100 |
| Bronze | 40    | 35     | 100 |
| Ferro  | 80    | 70     | 100 |

**Nomes possíveis:** Os Ferringos, Clã da Serpente, Tribo do Trovão, Povo das Sombras, Império Dourado

### Custos de Ações

| Ação     | Código   | Custo           | Cooldown |
| -------- | -------- | --------------- | -------- |
| Atacar   | `attack` | 15 food, 5 gold | 10 ticks |
| Defender | `defend` | 10 food         | 10 ticks |

### Fórmula de Dano

```
Dano ao Rival = max(5, floor(força × random(0.8-1.2) - defesaRival/2))
Dano ao Jogador = isDefending ? 0 : floor(defesaRival/4)
```

### Condições de Fim

- **Vitória:** População do rival = 0
- **Derrota:** Sua população = 0 (por fome ou ataque rival)

### Ataque do Jogador

```
População morta = max(1, floor((força - defesaRival/2) / 10))
Range: 1-5 população por ataque
```

### Ataque do Rival

```
População morta = max(1, floor((forçaRival - defesa) / 20))
Range: 1-3 população por ataque
Frequência: A cada 50 ticks (se não está defendendo)
```

### População do Rival

- Inicial: 10
- Cresce +1 a cada 30 ticks
- Máximo: 50

---

## 🏛️ Progressão de Eras

### Stone → Bronze

| Requisito  | Valor  |
| ---------- | ------ |
| stone      | 150    |
| population | 12     |
| buildings  | 1 mine |

**Tempo estimado:** ~200-300 ticks

### Bronze → Iron

| Requisito  | Valor      |
| ---------- | ---------- |
| stone      | 150        |
| gold       | 100        |
| population | 30         |
| buildings  | 1 barracks |

**Tempo estimado:** ~300-400 ticks

---

## 📍 Tiles do Mapa

### Tipos de Tile

| Português | Código     | Cor Placeholder | Frequência |
| --------- | ---------- | --------------- | ---------- |
| Planície  | `plains`   | #90EE90         | 50%        |
| Floresta  | `forest`   | #228B22         | 25%        |
| Montanha  | `mountain` | #808080         | 15%        |
| Água      | `water`    | #4169E1         | 8%         |
| Ouro      | `gold`     | #FFD700         | 2%         |

### Restrições de Construção

| Building      | Tiles Válidos            |
| ------------- | ------------------------ |
| town_center   | plains, forest           |
| house         | plains, forest           |
| farm          | plains                   |
| sawmill       | forest                   |
| mine          | mountain                 |
| gold_mine     | gold                     |
| barracks      | plains, forest           |
| defense_tower | plains, forest, mountain |

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
