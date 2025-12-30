# Prompts para Geração de Construções

> **Ferramenta:** Nanobanana/Gemini Image Generation
> **Formato Final:** PNG com transparência

## Instruções Gerais

Construções são mais complexas que tiles e precisam de:

- Perspectiva consistente (3/4 view isométrica)
- Sombra projetada (opcional, pode adicionar em código)
- Visual icônico e reconhecível
- Compatibilidade com os tiles do mapa

## Template Base

```
[ESTILO] pixel art, isometric view (3/4 perspective), game building sprite
[TAMANHO] [WxH] pixels
[ERA] [stone age / bronze age / iron age] architecture style
[COR] using color palette [HEX CODES]
[OBJETO] [descrição da construção]
[EXTRA] transparent background, clean edges, simple but detailed
```

---

## Construções por Tipo

### 🏛️ Centro da Vila (Town Center)

**Tamanho:** 128x128 pixels

**Prompt - Idade da Pedra:**

```
Pixel art game building, 128x128 pixels, isometric 3/4 view.
Primitive town center / chieftain hut, stone age architecture.
Large wooden structure with thatched straw roof, wooden poles supporting.
Stone foundation visible, animal skins/furs decorating entrance.
Colors: #795548 (wood), #D4A574 (straw), #9E9E9E (stones), #8D6E63 (leather).
Central fire pit or totem visible, important tribal building appearance.
Pixel art style, clean edges, transparent background.
```

**Prompt - Idade do Bronze:**

```
Pixel art game building, 128x128 pixels, isometric 3/4 view.
Bronze age town hall / palace, ancient Mediterranean style.
Mud brick or adobe construction, flat roof with wooden beams.
Columns at entrance, bronze decorations, impressive but not huge.
Colors: #D4A574 (adobe), #CD7F32 (bronze accents), #795548 (wood), #ECEFF1 (whitewash).
Two floors, central entrance, market/gathering area feel.
Pixel art style, detailed but clean, transparent background.
```

**Prompt - Idade do Ferro:**

```
Pixel art game building, 128x128 pixels, isometric 3/4 view.
Iron age fortress / citadel center, ancient civilization style.
Stone construction with iron reinforcements, imposing structure.
Watchtower element, large wooden doors, banners/flags.
Colors: #757575 (stone), #71797E (iron), #795548 (wood), #D32F2F (banner).
Military and administrative center feel, powerful appearance.
Pixel art style, detailed architecture, transparent background.
```

---

### 🏠 Casa (House)

**Tamanho:** 64x64 pixels

**Prompt - Idade da Pedra:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Primitive hut / dwelling, stone age house, simple shelter.
Round or oval shape, wooden frame covered with animal skins or mud.
Thatched roof, small entrance, smoke hole on top.
Colors: #795548 (wood), #8D6E63 (mud/leather), #D4A574 (straw).
Cozy primitive home, fits single family, humble appearance.
Pixel art style, simple but recognizable, transparent background.
```

**Prompt - Idade do Bronze:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Bronze age house, ancient dwelling, mud brick construction.
Rectangular shape, flat roof, small windows, wooden door.
Colors: #D4A574 (mud brick), #795548 (wood), #ECEFF1 (whitewash details).
Simple residential building, one story, modest but solid.
Pixel art style, clean design, transparent background.
```

---

### 🌾 Fazenda (Farm)

**Tamanho:** 64x64 pixels

**Prompt - Campo de Cultivo:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Farm field with small hut, agricultural plot, ancient farming.
Tilled soil rows with growing crops (wheat/grain), small storage hut.
Wooden fence on edges, farming tools visible.
Colors: #5D4037 (soil), #FFC107 (wheat), #795548 (wood), #7CB342 (green crops).
Productive farm appearance, organized rows, humble farmer's plot.
Pixel art style, detailed crops, transparent background.
```

**Prompt - Variação com Animais:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Small farm with animal pen, pastoral scene, ancient agriculture.
Fenced area with 1-2 small livestock (sheep/goats), feeding trough.
Small shelter for animals, hay storage.
Colors: #795548 (wood), #D4A574 (hay), #ECEFF1 (sheep), #7CB342 (grass).
Peaceful pastoral scene, productive farm, pixel art game asset.
```

**Prompt - Idade do Ferro:**

```text
Pixel art game sprite, 64x64 pixels, isometric 3/4 view.
Iron Age high-yield farm. A dense field of golden wheat covers 75% of the tile area in organized, tight rows.
In the back corner, a small barn with stone foundations, dark timber walls, and a slate-grey roof.
A tiny dark iron plow and pitchfork lean against the barn door.
The entire field is enclosed by a rugged wooden fence reinforced with prominent dark iron bands.
Colors: #FFC107 (golden wheat), #71797E (iron), #757575 (stone), #795548 (wood), #5D4037 (tilled soil).
Transparent background, clean pixel edges, top-left lighting, no cast shadow.
```

---

### ⛏️ Mina (Mine)

**Tamanho:** 64x64 pixels

**Prompt - Mina de Pedra:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Stone quarry / mine entrance, ancient mining operation.
Hole/cave entrance in rocky ground, wooden support beams.
Pile of extracted stones nearby, mining tools, cart or basket.
Colors: #757575 (rock), #616161 (cave shadow), #795548 (wood), #9E9E9E (stones).
Active mining site, industrious feel, resource extraction.
Pixel art style, depth in cave entrance, transparent background.
```

**Prompt - Mina de Ouro:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Gold mine entrance, precious metal extraction site.
Cave entrance with wooden supports, gold vein visible in rocks.
Small pile of gold ore, mining equipment, valuable appearance.
Colors: #757575 (rock), #FFD700 (gold veins/ore), #795548 (wood).
Rich mine, sparkle effects on gold, prosperous site.
Pixel art style, valuable resource feel, transparent background.
```

---

### ⚔️ Quartel (Barracks)

**Tamanho:** 96x96 pixels

**Prompt - Idade do Bronze:**

```
Pixel art game building, 96x96 pixels, isometric 3/4 view.
Bronze age barracks / military training ground, warrior quarters.
Long rectangular building, open training area, weapon racks visible.
Shields and spears displayed, tough military architecture.
Colors: #D4A574 (walls), #CD7F32 (bronze weapons), #795548 (wood), #D32F2F (cloth).
Military headquarters feel, disciplined appearance, strong structure.
Pixel art style, detailed but clean, transparent background.
```

**Prompt - Idade do Ferro:**

```
Pixel art game building, 96x96 pixels, isometric 3/4 view.
Iron age barracks / fortress garrison, military stronghold.
Stone construction, iron-reinforced, training dummies visible.
Armory section, soldier quarters, imposing military building.
Colors: #757575 (stone), #71797E (iron), #795548 (wood), #D32F2F (banners).
Powerful military structure, intimidating presence, battle-ready.
Pixel art style, fortified appearance, transparent background.
```

---

### 🗼 Torre de Defesa (Defense Tower)

**Tamanho:** 64x96 pixels (mais alta que larga)

**Prompt - Idade do Bronze:**

```
Pixel art game building, 64x96 pixels, isometric 3/4 view.
Bronze age watchtower / guard tower, defensive structure.
Tall wooden tower with stone base, platform on top for lookout.
Ladder access, simple roof, torches or beacon.
Colors: #795548 (wood), #9E9E9E (stone base), #CD7F32 (bronze details).
Defensive outpost, vigilant appearance, strategic position.
Pixel art style, vertical emphasis, transparent background.
```

**Prompt - Idade do Ferro:**

```
Pixel art game building, 64x96 pixels, isometric 3/4 view.
Iron age defense tower / fortified tower, stone construction.
Circular or square stone tower, arrow slits, battlements on top.
Iron reinforcements, banners, imposing height.
Colors: #757575 (stone), #71797E (iron), #795548 (wood door), #D32F2F (banner).
Strong defensive structure, castle tower feel, protective.
Pixel art style, solid construction, transparent background.
```

---

## Dicas Específicas para Construções

1. **Perspectiva:** Mantenha sempre o mesmo ângulo isométrico (30-45 graus)
2. **Luz:** Fonte de luz consistente (topo-esquerda)
3. **Base:** Adicione uma pequena sombra ou base para "assentar" no tile
4. **Escala:** Mantenha proporções consistentes entre construções
5. **Detalhes:** Inclua elementos que mostrem a função (ferramentas, pessoas pequenas)

## Checklist de Qualidade

- [ ] Perspectiva isométrica correta
- [ ] Paleta de cores da era correspondente
- [ ] Fundo transparente
- [ ] Escala adequada para o tile
- [ ] Função reconhecível à primeira vista
- [ ] Sombra consistente
- [ ] Bordas limpas (sem pixels soltos)
