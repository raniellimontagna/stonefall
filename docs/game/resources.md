# Sistema de Recursos

> ⚠️ **Valores numéricos:** Consulte [`balance.md`](./balance.md) para valores atualizados.

## Visão Geral

Recursos são a base da economia do jogo. São coletados automaticamente e gastos em construções e progressão.

## Tipos de Recursos

### 🌾 Comida (Food)

- **Fonte:** Fazendas, tiles de planície
- **Uso:** Sustento da população
- **Inicial:** 100
- **Crítico:** Recurso mais importante para sobrevivência

### 🪵 Madeira (Wood)

- **Fonte:** Tiles de floresta
- **Uso:** Construções básicas
- **Inicial:** 50
- **Crítico:** Recurso mais usado no early game

### 🪨 Pedra (Stone)

- **Fonte:** Minas em montanhas
- **Uso:** Construções defensivas, estruturas avançadas
- **Inicial:** 25
- **Crítico:** Necessário para avançar de era

### 💰 Ouro (Gold)

- **Fonte:** Minas especiais, comércio
- **Uso:** Evolução de era, diplomacia
- **Inicial:** 0
- **Crítico:** Recurso de late game

## Produção

### Por Tick

| Fonte           | Comida | Madeira | Pedra | Ouro |
| --------------- | ------ | ------- | ----- | ---- |
| Centro da Vila  | +1     | +1      | +0.5  | -    |
| Fazenda         | +3     | -       | -     | -    |
| Mina (montanha) | -      | -       | +2    | -    |
| Mina (ouro)     | -      | -       | -     | +0.5 |

### Consumo

| Consumidor    | Comida    |
| ------------- | --------- |
| Por habitante | -0.5/tick |

## Cálculo de Produção

```
Produção Líquida = Produção Bruta - Consumo

Exemplo:
- 2 Fazendas = +6 comida
- 1 Centro = +1 comida
- 10 habitantes = -5 comida
- Líquido = +2 comida/tick
```

## Storage (futuro)

Atualmente sem limite. Futuro:

- Armazéns aumentam capacidade
- Recursos em excesso são perdidos

## Balanceamento

### Early Game (Idade da Pedra)

- Foco em comida e madeira
- Ouro não disponível
- Pedra limitada

### Mid Game (Idade do Bronze)

- Pedra se torna importante
- Ouro começa a aparecer
- Comida deve estar estável

### Late Game (Idade do Ferro)

- Ouro é crítico
- Produção alta de todos recursos
- Foco em eficiência
