# Prompts para Geração de UI

> **Ferramenta:** Nanobanana/Gemini Image Generation
> **Formato Final:** PNG com transparência (ou 9-slice ready)

## Instruções Gerais

Elementos de UI precisam:

- Ser escaláveis (9-slice quando possível)
- Ter aparência consistente
- Combinar com a estética do jogo
- Ser legíveis sobre qualquer fundo

## Estilo de UI

**Tema:** Medieval/Rústico com toques de pergaminho e madeira
**Cores Base:**

- Fundo: `#2C2416` (marrom escuro)
- Borda: `#8B7355` (marrom médio)
- Texto: `#F5F5DC` (bege claro)
- Destaque: `#CD7F32` (bronze)

---

## Painéis e Fundos

### Painel Principal

**Para diálogos, menus, cards de evento**

```
Pixel art game UI panel, medieval fantasy style.
Rectangular panel with wooden frame and parchment/leather interior.
Ornate corners with metal rivets or studs, aged wood texture.
Colors: #2C2416 (dark bg), #8B7355 (wood frame), #D4A574 (parchment inner).
Suitable for 9-slice scaling, clean edges, transparent outside.
Fantasy RPG / strategy game aesthetic, readable text area.
```

**Variação - Painel Pequeno (tooltip):**

```
Pixel art game UI tooltip panel, small info box.
Simple wooden frame with dark interior, minimal decoration.
Colors: #2C2416 (bg), #8B7355 (border), 2-3 pixel border.
Compact design for hover information, 9-slice ready.
Transparent background, clean pixel edges.
```

---

### Barra de Recursos (Top Bar)

```
Pixel art game UI resource bar, horizontal header panel.
Long rectangular bar, stone/wood texture, medieval style.
Divided sections for different resources, slightly raised appearance.
Colors: #3E2723 (main), #5D4037 (sections), #8B7355 (border).
Fits at top of screen, important information display.
Width: scalable, Height: ~48-64 pixels fixed.
```

---

## Botões

### Botão Principal

**Tamanho Base:** 120x40 pixels (escalável)

```
Pixel art game UI button, medieval style, three states.
Wooden button with metal/bronze accents, raised appearance.

State 1 - Normal:
Colors: #5D4037 (wood), #8B7355 (highlight), #3E2723 (shadow).
Raised 3D effect, ready to click.

State 2 - Hover:
Colors: #795548 (lighter wood), brighter overall.
Slight glow or highlight.

State 3 - Pressed:
Colors: #3E2723 (darker), inverted shadow.
Pressed down effect.

Clean edges, 9-slice ready, transparent background.
```

### Botão de Ação (Circular)

**Tamanho:** 48x48 pixels

```
Pixel art game UI circular button, action button style.
Round wooden/metal button, raised with border.
Colors: #5D4037 (main), #CD7F32 (bronze ring), #8B7355 (highlight).
For toolbar actions, icon goes in center.
Transparent background, clean circular shape.
```

### Botões de Velocidade

**Tamanho:** 32x32 pixels cada

```
Pixel art game UI speed control buttons set, 4 buttons.
1. Pause (two vertical bars)
2. Play/1x speed (single triangle)
3. Fast/2x speed (double triangle)
4. Faster/3x speed (triple triangle)

Style: Simple stone/metal buttons, consistent look.
Colors: #5D4037 (bg), #F5F5DC (symbols).
Compact media control style, game UI aesthetic.
```

---

## Cards de Evento

### Card de Evento Principal

**Tamanho:** 400x500 pixels (ou similar ratio)

```
Pixel art game UI event card, large dialog panel.
Medieval parchment/scroll style card, decorative border.
Top section for title, middle for illustration, bottom for text/choices.
Colors: #D4A574 (parchment), #8B7355 (border), #5D4037 (accents).
Ornate corners, aged paper texture, important announcement feel.
Transparent background, complete card design.
```

### Área de Escolhas (dentro do card)

```
Pixel art game UI choice buttons, event card options.
Three horizontal button slots stacked vertically.
Simple wooden/leather buttons, clickable appearance.
Colors: #5D4037 (button), #3E2723 (shadow), #8B7355 (border).
Each button ~300x40 pixels, fits text description.
Hover state: slightly lighter color.
```

---

## Barras de Progresso

### Barra de Progresso de Era

**Tamanho:** 200x24 pixels

```
Pixel art game UI progress bar, era advancement tracker.
Horizontal bar with stone/metal frame, fill area inside.
Empty: dark interior. Fill: bronze/gold gradient.
Colors: Frame #757575, Empty #2C2416, Fill #CD7F32 to #FFD700.
Notches or markers at 25%, 50%, 75%.
Medieval strategy game style, important milestone tracker.
```

### Barra de Saúde/Status

**Tamanho:** 100x12 pixels

```
Pixel art game UI health/status bar, small indicator.
Simple rectangular bar, thin profile.
Empty: dark red. Full: bright green.
Colors: Border #5D4037, Empty #5D0000, Full #4CAF50.
Clean minimal design, fits next to unit/building info.
```

---

## Elementos Decorativos

### Divisor Horizontal

```
Pixel art game UI horizontal divider line.
Decorative line to separate content sections.
Simple design with small ornaments at ends or center.
Colors: #8B7355 (main), #CD7F32 (ornament).
Width: scalable, Height: 8-12 pixels.
Medieval document style, subtle but elegant.
```

### Cantos Decorativos

```
Pixel art game UI corner decorations set, 4 corners.
Ornate corner pieces for panels and frames.
Celtic knot or medieval scroll style.
Colors: #8B7355 (main), #CD7F32 (accent).
Each corner 32x32 pixels, mirrors for all four corners.
Transparent background, overlay on panels.
```

---

## Cursor

### Cursor Padrão

**Tamanho:** 32x32 pixels

```
Pixel art game cursor, medieval/fantasy style.
Gauntlet hand pointing, armored finger cursor.
Metal/leather glove appearance, pointing gesture.
Colors: #9E9E9E (metal), #795548 (leather), #71797E (shadow).
Clear hotspot at fingertip, game-appropriate style.
Transparent background.
```

### Cursor de Construção

```
Pixel art game cursor, building mode indicator.
Hammer or trowel tool cursor.
Construction tool being held, build mode active.
Colors: #795548 (handle), #9E9E9E (metal head).
Clear indication of building/placement mode.
Transparent background.
```

---

## Dicas para UI

1. **9-Slice:** Desenhe bordas que podem ser esticadas sem distorção
2. **Estados:** Sempre crie Normal, Hover, Pressed para botões
3. **Contraste:** UI deve ser legível sobre o jogo
4. **Consistência:** Mesma espessura de borda, mesmos cantos arredondados
5. **Espaçamento:** Deixe margem interna para texto

## Checklist de UI

- [ ] Bordas consistentes (mesma espessura)
- [ ] Cores da paleta definida
- [ ] Estados de interação (hover, pressed)
- [ ] Transparência correta
- [ ] Escalável ou 9-slice ready
- [ ] Legível em diferentes resoluções
