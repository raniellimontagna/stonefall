# Sistema de Eras

> ⚠️ **Valores numéricos:** Consulte [`balance.md`](./balance.md) para requisitos de progressão atualizados.

## Visão Geral

O jogo progride através de eras históricas. Cada era desbloqueia novas construções, aumenta a produção e introduz novos desafios.

## Eras do MVP

### ⚱️ Idade da Pedra (Stone Age)

**Era inicial**

| Aspecto                 | Valor                              |
| ----------------------- | ---------------------------------- |
| Construções             | Centro, Casa, Fazenda, Mina        |
| Modificador de produção | 1.0x                               |
| Eventos                 | Primitivos (fome, doenças simples) |
| Rival                   | Inativo                            |

**Características:**

- Foco em sobrevivência
- Estabelecer economia básica
- Sem conflitos externos

---

### 🗡️ Idade do Bronze (Bronze Age)

| Aspecto                 | Valor                        |
| ----------------------- | ---------------------------- |
| Custo para avançar      | 100 pedra, 50 ouro           |
| Requisitos              | 20 população, Centro nível 1 |
| Novas construções       | Quartel, Torre               |
| Modificador de produção | 1.5x                         |
| Eventos                 | Conflitos iniciais, comércio |
| Rival                   | Ativo (diplomacia básica)    |

**Características:**

- Introdução de conflito
- Necessidade de defesa
- Primeiros contatos com rival

---

### ⚔️ Idade do Ferro (Iron Age)

| Aspecto                 | Valor                            |
| ----------------------- | -------------------------------- |
| Custo para avançar      | 200 pedra, 150 ouro              |
| Requisitos              | 50 população, Quartel construído |
| Novas construções       | (futuro)                         |
| Modificador de produção | 2.0x                             |
| Eventos                 | Guerra, política, traições       |
| Rival                   | Agressivo                        |

**Características:**

- Era final do MVP
- Conflitos decisivos
- Caminho para vitória

---

## Progressão de Era

### Fluxo

```
┌────────────────────────────────┐
│  Verificar Requisitos          │
│  - Recursos suficientes        │
│  - População mínima            │
│  - Construções necessárias     │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Botão "Avançar Era" ativo     │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Jogador confirma              │
│  - Recursos são gastos         │
│  - Nova era é ativada          │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Evento de transição           │
│  - Registro na Crônica         │
│  - Som de sucesso (`success`)  │
│  - Narrativa da mudança        │
│  - Novas construções           │
└────────────────────────────────┘
```

### UI de Progresso

```
Era Atual: Idade da Pedra
[████████░░░░░░░░] 45%

Para avançar:
✅ 100 pedra (120/100)
❌ 50 ouro (30/50)
✅ 20 população (22/20)

[Avançar para Idade do Bronze] (desabilitado)
```

## Eventos por Era

### Idade da Pedra

- Seca (reduz comida)
- Descoberta de recursos
- Migração de animais
- Doença simples

### Idade do Bronze

- Comerciantes passam
- Rival faz contato
- Rebelião interna
- Descoberta tecnológica

### Idade do Ferro

- Guerra declarada
- Traição de conselheiro
- Grande festival
- Epidemia
- Aliança proposta

## Modificadores por Era

| Era    | Produção | Consumo | Força Base |
| ------ | -------- | ------- | ---------- |
| Pedra  | 1.0x     | 1.0x    | 10         |
| Bronze | 1.5x     | 1.2x    | 50         |
| Ferro  | 2.0x     | 1.5x    | 100        |

## Futuras Eras (pós-MVP)

1. Idade Clássica
2. Idade Medieval
3. Renascimento
4. Era Industrial
5. Era Moderna
