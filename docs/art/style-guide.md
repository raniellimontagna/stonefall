# Guia de Estilo Visual

## Visão Geral

O estilo visual do jogo é **pixel art estilizado** com uma paleta terrosa e histórica, evocando a sensação de civilizações antigas.

## Estilo Artístico

### Características

- **Tipo:** Pixel Art
- **Resolução:** 64x64 pixels (tiles), 32x32 (ícones)
- **Perspectiva:** Top-down isométrico simplificado (3/4 view)
- **Contorno:** Linhas definidas, 1-2 pixels
- **Sombreamento:** Simples, 2-3 tons por cor

### Referências Visuais

- Age of Empires 1 (original)
- Realm Grinder
- Stardew Valley (simplicidade)
- Civilization 1-2 (mapa)

## Paleta de Cores

### Cores Primárias

| Nome     | Hex       | Uso                    |
| -------- | --------- | ---------------------- |
| Terra    | `#8B7355` | Base, caminhos         |
| Grama    | `#7CB342` | Planícies              |
| Floresta | `#2E7D32` | Áreas de madeira       |
| Água     | `#1976D2` | Rios, lagos            |
| Pedra    | `#757575` | Montanhas, construções |
| Areia    | `#D4A574` | Detalhes, deserto      |

### Cores de Recursos

| Recurso | Hex       | Complementar |
| ------- | --------- | ------------ |
| Comida  | `#FFC107` | `#FF8F00`    |
| Madeira | `#795548` | `#5D4037`    |
| Pedra   | `#9E9E9E` | `#616161`    |
| Ouro    | `#FFD700` | `#FFA000`    |

### Cores de Era

| Era    | Primária  | Secundária |
| ------ | --------- | ---------- |
| Pedra  | `#A1887F` | `#8D6E63`  |
| Bronze | `#CD7F32` | `#B87333`  |
| Ferro  | `#71797E` | `#36454F`  |

### Cores de UI

| Elemento | Hex                     |
| -------- | ----------------------- |
| Fundo UI | `#2C2416` (90% opacity) |
| Texto    | `#F5F5DC`               |
| Borda    | `#8B7355`               |
| Botão    | `#5D4037`               |
| Hover    | `#795548`               |
| Alerta   | `#D32F2F`               |
| Sucesso  | `#388E3C`               |

## Especificações de Assets

### Tiles (64x64)

```
┌────────────────┐
│                │
│   ÁREA ÚTIL    │  56x56 (4px margem)
│                │
└────────────────┘
```

- Margem de 4px para transições
- Variações: 2-3 por tipo de tile
- Cantos arredondados para blend

### Construções (64x64 a 128x128)

| Construção     | Tamanho | Tiles ocupados |
| -------------- | ------- | -------------- |
| Casa           | 64x64   | 1x1            |
| Fazenda        | 64x64   | 1x1            |
| Centro da Vila | 128x128 | 2x2            |
| Quartel        | 96x96   | 1.5x1.5        |
| Torre          | 64x96   | 1x1 (altura)   |

### Ícones (32x32)

- Recursos
- Botões de ação
- Indicadores de status
- Elementos de UI

### Ícones Pequenos (16x16)

- Indicadores de produção
- Badges
- Cursores

## Animações

### Construções

- **Idle:** 2-4 frames, loop lento (2s)
- **Produção:** Indicador visual (fumaça, movimento)
- **Destruição:** 4-6 frames

### Tiles

- **Água:** 3-4 frames, ondulação suave
- **Floresta:** Vento nas árvores (opcional)
- **Fazenda:** Crescimento de plantas (opcional)

### UI

- **Hover:** Scale 1.05, 100ms ease
- **Click:** Scale 0.95, 50ms
- **Notificação:** Fade in/out, slide

## Formato de Arquivos

```
assets/
├── tiles/
│   ├── plains_01.png
│   ├── plains_02.png
│   ├── forest_01.png
│   └── ...
├── buildings/
│   ├── town_center.png
│   ├── house.png
│   └── ...
├── icons/
│   ├── resources/
│   │   ├── food.png
│   │   └── ...
│   └── actions/
│       └── ...
├── ui/
│   ├── panel_bg.png
│   ├── button.png
│   └── ...
└── sprites/
    └── ... (animações em spritesheet)
```

## Consistência

### Checklist para Novos Assets

- [ ] Segue a paleta de cores
- [ ] Resolução correta
- [ ] Contornos consistentes
- [ ] Sombreamento da mesma direção (luz do topo-esquerda)
- [ ] Nomeação seguindo padrão
- [ ] Transparência correta (PNG)

## Exemplos de Direção

### Atmosfera Geral

> Sentimento de "construindo algo a partir do nada". Cores quentes e terrosas que evocam terra fértil e potencial de crescimento. Visual clean e legível, mesmo em telas pequenas.

### Tom Visual

- Não muito realista (é pixel art)
- Não muito cartunesco (é histórico)
- Equilibrado, icônico, reconhecível
