# Sistema de Construções

> ⚠️ **Valores numéricos:** Consulte [`balance.md`](./balance.md) para custos e stats atualizados.

## Visão Geral

Construções são colocadas no mapa e fornecem benefícios ao jogador. Cada construção tem custo, efeito e restrições.

## Lista de Construções

### 🏛️ Centro da Vila (Town Center)

| Propriedade | Valor                             |
| ----------- | --------------------------------- |
| Custo       | Gratuito (inicial)                |
| Limite      | 1                                 |
| Era         | Pedra                             |
| Tile        | Qualquer (exceto água)            |
| Produção    | +1 comida, +1 madeira, +0.5 pedra |
| HP          | 500                               |

**Descrição:** Núcleo da civilização. Se destruído, é game over.

---

### 🏠 Casa (House)

| Propriedade | Valor                  |
| ----------- | ---------------------- |
| Custo       | 30 madeira             |
| Limite      | Ilimitado              |
| Era         | Pedra                  |
| Tile        | Qualquer (exceto água) |
| Efeito      | +5 população máxima    |
| HP          | 100                    |

**Descrição:** Aumenta o limite populacional.

---

### 🌾 Fazenda (Farm)

| Propriedade | Valor                |
| ----------- | -------------------- |
| Custo       | 20 madeira, 10 pedra |
| Limite      | Ilimitado            |
| Era         | Pedra                |
| Tile        | Plains apenas        |
| Produção    | +3 comida/tick       |
| HP          | 50                   |

**Descrição:** Produz comida para sustentar a população.

---

### ⛏️ Mina (Mine)

| Propriedade | Valor                                         |
| ----------- | --------------------------------------------- |
| Custo       | 40 madeira, 20 pedra                          |
| Limite      | Ilimitado                                     |
| Era         | Pedra                                         |
| Tile        | Mountain apenas                               |
| Produção    | +2 pedra/tick (ou +0.5 ouro se tile especial) |
| HP          | 100                                           |

**Descrição:** Extrai recursos de montanhas.

---

### ⚔️ Quartel (Barracks)

| Propriedade | Valor                         |
| ----------- | ----------------------------- |
| Custo       | 60 madeira, 40 pedra, 10 ouro |
| Limite      | 3                             |
| Era         | Bronze                        |
| Tile        | Qualquer (exceto água)        |
| Efeito      | +20 força militar             |
| HP          | 200                           |

**Descrição:** Aumenta poder militar e desbloqueia estratégias de ataque.

---

### 🗼 Torre de Defesa (Defense Tower)

| Propriedade | Valor                  |
| ----------- | ---------------------- |
| Custo       | 50 pedra, 20 ouro      |
| Limite      | 5                      |
| Era         | Bronze                 |
| Tile        | Qualquer (exceto água) |
| Efeito      | +15 defesa             |
| HP          | 300                    |

**Descrição:** Aumenta defesa contra ataques.

---

## Sistema de Construção

### Fluxo

1. Jogador seleciona construção no menu
2. Preview aparece no cursor
3. Tile válido é destacado (verde/vermelho)
4. Click para confirmar
5. Recursos são debitados
6. Construção aparece instantaneamente

### Validações

- Recursos suficientes
- Tile válido para o tipo
- Era desbloqueada
- Limite não atingido
- Tile não ocupado

### Código de Cores (Preview)

- 🟢 Verde: Pode construir
- 🔴 Vermelho: Não pode construir
- 🟡 Amarelo: Pode, mas não recomendado

## Desbloqueio por Era

| Era    | Construções                          |
| ------ | ------------------------------------ |
| Pedra  | Centro, Casa, Fazenda, Mina          |
| Bronze | Quartel, Torre                       |
| Ferro  | (futuro: Mercado, Templo, Fortaleza) |

## Destruição

- Construções podem ser destruídas por:
  - Ataque inimigo
  - Eventos (desastres)
  - Jogador (demolir - retorna 50% recursos)

## Upgrade (Futuro)

Sistema de melhorias para cada construção:

- Fazenda Lv2: +5 comida
- Casa Lv2: +8 população
- etc.
