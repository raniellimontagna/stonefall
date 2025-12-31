# Sistema de Combate

> ⚠️ **V1 Simplificado:** Na V1, apenas Atacar e Defender estão implementados. Cerco, diplomacia e moral estão planejados para V2.

> ⚠️ **Valores numéricos:** Consulte [`balance.md`](./balance.md) para força, defesa e custos atualizados.

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

## Cálculo de Batalha (MVP)

No MVP atual, o combate foca no desgaste da população do rival.

### Fórmula de Dano
```
Militar (Jogador) = (Quartéis × 20) + (População × 0.1)
Defesa (Rival) = Base da Era × Modificador de Defesa

População Morta (Rival) = Max(1, Floor((Poder Ataque - Defesa Rival / 2) / 10))
```

### Consequências
- **Ataque:** Diminui a população do rival. Vitória ocorre quando a população do rival chega a 0.
- **Defesa:** O jogador fica protegido de ataques do rival por um período.
- **Sons:** Reproduz o som `battle` em ataques e defesas.

## Registro e Crônicas
Batalhas significativas (morte de 3+ civis ou derrota do rival) são registradas automaticamente na **Crônica da Civilização**.

### Sons de Combate
- `battle`: Toca ao realizar uma ação de combate (Ataque/Defesa).
- `success`: Toca na vitória final sobre o rival.
- `error`: Toca em caso de derrota em combate.

## UI de Combate
O jogador gerencia o combate através do **Painel do Rival**, onde pode ver a população de ambos os lados e enviar ataques/defesas conforme o cooldown permitir.

