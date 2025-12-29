# Sistema de Combate

## Filosofia

O combate é **estratégico**, não tático. O jogador não controla unidades individuais, mas toma decisões de alto nível.

## Conceito

```
Jogador escolhe ESTRATÉGIA
        ↓
Sistema calcula RESULTADO
        ↓
IA narra o CONFLITO
        ↓
Consequências aplicadas
```

## Atributos de Combate

### Força Militar

```
Força = Base da Era + (Quartéis × 20) + Bônus
```

### Defesa

```
Defesa = Base da Era + (Torres × 15) + Bônus
```

### Moral

```
Moral = 50 + (Comida > 0 ? 25 : 0) + (Vitórias × 5) - (Derrotas × 10)
```

## Estratégias do Jogador

### ⚔️ Ataque Direto

- **Custo:** 20 comida, 10 ouro
- **Chance de sucesso:** Alta se Força > Defesa inimiga
- **Risco:** Alto
- **Recompensa:** Grande (recursos, território)

### 🛡️ Defesa

- **Custo:** 10 comida
- **Efeito:** +50% defesa por 5 ticks
- **Uso:** Quando esperando ataque

### 🏰 Cerco

- **Custo:** 30 comida, 20 ouro
- **Duração:** 10 ticks
- **Efeito:** Reduz recursos do inimigo gradualmente
- **Risco:** Médio
- **Recompensa:** Média

### 🕊️ Diplomacia

- **Custo:** 30 ouro
- **Efeito:** Tenta acordo de paz
- **Chance:** Baseada em relação prévia

## Cálculo de Batalha

### Fórmula Base

```
Poder de Ataque = Força × (Moral / 100) × Random(0.8, 1.2)
Poder de Defesa = Defesa × (Moral / 100) × Random(0.8, 1.2)

Se Ataque > Defesa:
  Vitória do atacante
  Dano = (Ataque - Defesa) × 0.5
Senão:
  Vitória do defensor
  Dano = (Defesa - Ataque) × 0.3
```

### Consequências

| Resultado        | Vencedor ganha        | Perdedor perde        |
| ---------------- | --------------------- | --------------------- |
| Vitória decisiva | 50% recursos inimigos | 30% força militar     |
| Vitória marginal | 20% recursos inimigos | 10% força militar     |
| Empate           | Nada                  | 5% força militar cada |

## Narrativa de Combate (IA)

A IA gera uma descrição única do conflito:

**Input para IA:**

```json
{
  "attacker": "Jogador",
  "defender": "Rival",
  "strategy": "Ataque Direto",
  "attackerForce": 80,
  "defenderForce": 60,
  "result": "Vitória do atacante",
  "era": "Bronze"
}
```

**Output esperado:**

> "As forças do seu reino marcharam ao amanhecer contra as muralhas de [Rival]. Após uma batalha feroz que durou até o meio-dia, suas tropas romperam as defesas orientais. O inimigo recuou, deixando para trás suprimentos valiosos. Uma vitória que será lembrada nas canções de sua civilização."

## Condições de Guerra

### Início de conflito

- Rival declara guerra (evento)
- Jogador ataca primeiro
- Disputa por território

### Fim de conflito

- Um lado é derrotado
- Acordo de paz
- Pagamento de tributo

## UI de Combate

```
┌─────────────────────────────────────┐
│         CONFLITO COM [RIVAL]        │
├─────────────────────────────────────┤
│  Sua Força: ████████░░ 80           │
│  Sua Defesa: ██████░░░░ 60          │
│  Moral: ████████░░ 80%              │
├─────────────────────────────────────┤
│  Rival Força: ██████░░░░ 60         │
│  Rival Defesa: ████░░░░░░ 40        │
├─────────────────────────────────────┤
│  Escolha sua estratégia:            │
│                                     │
│  [⚔️ Atacar]  [🛡️ Defender]        │
│  [🏰 Cerco]   [🕊️ Negociar]        │
└─────────────────────────────────────┘
```
