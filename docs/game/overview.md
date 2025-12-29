# Visão Geral do Jogo

> **Codinome:** Project Stonefall  
> **Nome:** [A definir]

## Conceito

Jogo de estratégia histórica para navegador onde o jogador desenvolve uma civilização desde eras primitivas, tomando decisões estratégicas que moldam uma narrativa única gerada por IA.

## Pilares de Design

### 1. Simplicidade Acessível

- Sem microgerenciamento de unidades
- Mecânicas intuitivas
- Sessões de 10-20 minutos

### 2. Narrativa Emergente

- Eventos dinâmicos gerados por IA
- Cada partida conta uma história diferente
- Crônica da civilização ao final

### 3. Decisões Significativas

- Escolhas com consequências
- Trade-offs estratégicos
- Múltiplos caminhos para vitória

## Inspirações

| Jogo           | Elemento Inspirado                 |
| -------------- | ---------------------------------- |
| Age of Empires | Eras, recursos, construções        |
| Civilization   | Progressão tecnológica, turnos     |
| Crusader Kings | Eventos narrativos, personalidades |
| Reigns         | Decisões com cards                 |

## Loop de Jogo

```
┌─────────────────────────────────────────┐
│                                         │
│   ┌─────────┐    ┌─────────────────┐   │
│   │ Coletar │───▶│    Construir    │   │
│   │Recursos │    │   Edificações   │   │
│   └─────────┘    └────────┬────────┘   │
│        ▲                  │            │
│        │                  ▼            │
│   ┌────┴────┐    ┌─────────────────┐   │
│   │ Lidar   │◀───│    Expandir     │   │
│   │c/Eventos│    │   População     │   │
│   └────┬────┘    └─────────────────┘   │
│        │                  ▲            │
│        ▼                  │            │
│   ┌─────────┐    ┌────────┴────────┐   │
│   │ Avançar │───▶│   Conflitar/    │   │
│   │  de Era │    │    Negociar     │   │
│   └─────────┘    └─────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## Sessão Típica

1. **Início (0-2 min):** Setup inicial, primeiras construções
2. **Crescimento (2-8 min):** Expansão, eventos iniciais
3. **Conflito (8-15 min):** Interação com rival, decisões críticas
4. **Conclusão (15-20 min):** Vitória/derrota, crônica final

## Condições de Fim

### Vitória

- Chegar à Idade do Ferro
- Derrotar o rival
- (Futuro: Vitória cultural, econômica)

### Derrota

- Centro da Vila destruído
- População zerada
- Economia colapsada (comida negativa prolongada)

## Tom e Atmosfera

- **Visual:** Pixel art estilizado, paleta terrosa
- **Som:** Ambiente medieval, música suave
- **Texto:** Narrativo mas conciso
- **Humor:** Leve, não sério demais
