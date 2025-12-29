# Prompts para Geração de Tiles

> **Ferramenta:** Nanobanana/Gemini Image Generation
> **Formato Final:** PNG 64x64 pixels

## Instruções Gerais

Ao gerar tiles com IA, siga estas diretrizes:

1. **Sempre especificar:** pixel art, 64x64, top-down view
2. **Incluir:** paleta de cores específica
3. **Pedir:** fundo transparente ou cor sólida para recortar
4. **Evitar:** muitos detalhes (não cabem em 64px)
5. **Gerar múltiplas variações** e escolher a melhor

## Template Base

```
[ESTILO] pixel art, 64x64 pixels, top-down view, game asset
[COR] using colors [HEX CODES]
[OBJETO] [descrição do tile]
[EXTRA] clean edges, tileable, simple shading, no background
```

---

## Prompts por Tipo de Tile

### 🌾 Planície (Plains)

**Prompt Principal:**

```
Pixel art game tile, 64x64 pixels, top-down view, grass plains terrain.
Colors: #7CB342 (main grass), #8BC34A (light), #689F38 (dark).
Simple grass texture with subtle variation, seamless tileable pattern.
Clean pixel art style, 2-3 shades only, transparent background.
```

**Variação com Flores:**

```
Pixel art game tile, 64x64 pixels, top-down view, grass plains with small wildflowers.
Colors: #7CB342 grass, #FFC107 and #E91E63 small flowers scattered.
Subtle detail, not too busy, seamless edges, pixel art style.
```

**Variação Seca:**

```
Pixel art game tile, 64x64 pixels, top-down view, dry grassland terrain.
Colors: #D4A574 (dry grass), #C4A484 (light), #A08060 (dark).
Sparse vegetation, cracked earth hints, tileable, pixel art.
```

---

### 🌲 Floresta (Forest)

**Prompt Principal:**

```
Pixel art game tile, 64x64 pixels, top-down/isometric view, dense forest terrain.
Colors: #2E7D32 (dark trees), #388E3C (medium), #4CAF50 (highlights).
Tree canopy viewed from above, clustered trees, dark shadows between.
Seamless tileable edges, pixel art style, simple but recognizable.
```

**Variação - Floresta Esparsa:**

```
Pixel art game tile, 64x64 pixels, top-down view, light forest with visible ground.
Colors: #388E3C trees, #7CB342 grass beneath, #795548 tree trunks visible.
Fewer trees, can see some ground, tileable, pixel art game asset.
```

**Variação - Floresta de Outono:**

```
Pixel art game tile, 64x64 pixels, top-down view, autumn forest terrain.
Colors: #FF8F00 (orange), #D84315 (red), #8D6E63 (brown leaves).
Fall colored trees from above, warm palette, tileable, pixel art style.
```

---

### ⛰️ Montanha (Mountain)

**Prompt Principal:**

```
Pixel art game tile, 64x64 pixels, top-down/isometric view, rocky mountain terrain.
Colors: #757575 (main rock), #9E9E9E (light), #616161 (shadow).
Rocky surface with cliff edges, rugged terrain, visible stone texture.
Pixel art style, tileable edges, simple geometric shapes.
```

**Variação - Montanha com Neve:**

```
Pixel art game tile, 64x64 pixels, top-down view, snowy mountain peak.
Colors: #ECEFF1 (snow), #B0BEC5 (shadow), #757575 (rock showing through).
Snow-capped rocky terrain, cold appearance, pixel art, tileable.
```

**Variação - Montanha com Minério:**

```
Pixel art game tile, 64x64 pixels, top-down view, mountain with visible ore deposits.
Colors: #757575 rock, #FFD700 gold veins or #795548 copper veins showing.
Sparkle hints on ore, rocky base terrain, pixel art game asset.
```

---

### 💧 Água (Water)

**Prompt Principal:**

```
Pixel art game tile, 64x64 pixels, top-down view, calm water surface.
Colors: #1976D2 (main), #2196F3 (light ripples), #1565C0 (deep).
Simple wave pattern, reflective surface hints, animated-ready.
Pixel art style, tileable in all directions, clean edges.
```

**Variação - Rio:**

```
Pixel art game tile, 64x64 pixels, top-down view, flowing river water.
Colors: #1976D2, #42A5F5 (foam), #0D47A1 (deep center).
Directional flow pattern (left to right), river current visible.
Pixel art, 3-4 frame animation ready, tileable horizontally.
```

**Variação - Costa:**

```
Pixel art game tile, 64x64 pixels, top-down view, beach shoreline transition.
Colors: #D4A574 sand, #1976D2 water, #FFFFFF foam line.
Half sand half water, wave foam at edge, seamless blend.
Pixel art coastal tile, game asset style.
```

---

## Tiles de Transição

Para criar transições suaves entre biomas:

**Template de Transição:**

```
Pixel art game tile, 64x64 pixels, top-down view, terrain transition tile.
[BIOMA A] on left/top side transitioning to [BIOMA B] on right/bottom.
Colors: [CORES DO BIOMA A] blending into [CORES DO BIOMA B].
Seamless edges for both terrains, diagonal or straight blend, pixel art.
```

**Exemplo - Grama para Floresta:**

```
Pixel art game tile, 64x64 pixels, top-down view, grass to forest transition.
#7CB342 grass on bottom half, #2E7D32 forest on top half.
Trees gradually appearing, grass thinning out, natural blend.
Tileable with both grass and forest tiles, pixel art game asset.
```

---

## Dicas para Melhores Resultados

1. **Gere em lote:** Peça 4-6 variações e escolha as melhores
2. **Refine:** Se a primeira geração não ficar boa, ajuste o prompt
3. **Pós-processamento:** Pode ser necessário ajustar manualmente em editor de pixel art
4. **Consistência:** Use sempre as mesmas cores hex para manter uniformidade
5. **Teste tileable:** Coloque os tiles lado a lado para ver se funcionam juntos

## Ferramentas de Apoio

- **Aseprite:** Para ajustes finos de pixel art
- **Piskel:** Editor online gratuito
- **Photoshop/GIMP:** Para recorte e ajuste de cores
- **TexturePacker:** Para criar spritesheets
