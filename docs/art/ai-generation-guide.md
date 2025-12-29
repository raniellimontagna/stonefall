# Guia de Geração de Arte com IA

> Como usar Nanobanana/Gemini para gerar assets do Project Stonefall

## Princípios Gerais

### 1. Seja Específico

❌ **Ruim:**

```
Create a house for my game
```

✅ **Bom:**

```
Pixel art game building, 64x64 pixels, isometric 3/4 view.
Stone age primitive hut, round shape, thatched straw roof.
Colors: #795548 (wood), #D4A574 (straw), #9E9E9E (stones).
Transparent background, clean pixel edges.
```

### 2. Inclua Sempre

- **Estilo:** `pixel art`
- **Tamanho:** `64x64 pixels`
- **Perspectiva:** `top-down` ou `isometric 3/4 view`
- **Cores:** Códigos HEX específicos
- **Fundo:** `transparent background`

### 3. Use Referências Visuais

Quando possível, mencione referências:

```
Style reference: Age of Empires 1, Stardew Valley pixel art
```

## Estrutura de Prompt Ideal

```
[TIPO] + [TAMANHO] + [PERSPECTIVA]
[OBJETO] + [DETALHES VISUAIS]
[CORES] com códigos HEX
[ESTILO] + [QUALIDADE]
[FUNDO] + [EXTRAS]
```

### Exemplo Completo

```
Pixel art game tile, 64x64 pixels, top-down view.
Grass plains terrain with subtle texture variation and small rocks.
Main colors: #7CB342 (grass), #8BC34A (light grass), #689F38 (shadow).
Clean pixel art style, tileable seamless pattern, game-ready asset.
Transparent background, no anti-aliasing, crisp edges.
```

## Iteração e Refinamento

### Primeira Geração

Comece com um prompt básico e veja o resultado.

### Refinamentos Comuns

**Se muito detalhado:**

```
Add: "simple design, fewer details, bold shapes"
```

**Se cores erradas:**

```
Be more specific: "ONLY use these exact colors: #XXX, #YYY, #ZZZ"
```

**Se perspectiva errada:**

```
Clarify: "strictly top-down view, no angle, bird's eye view"
```

**Se muito realista:**

```
Add: "pixel art style, 8-bit aesthetic, retro game look"
```

## Geração em Lote

Para manter consistência, gere assets relacionados juntos:

```
Generate a consistent set of 4 resource icons, each 32x32 pixels pixel art:
1. Food icon - wheat sheaf
2. Wood icon - log stack
3. Stone icon - rock pile
4. Gold icon - coin stack

All must share:
- Same pixel art style
- Same lighting direction (top-left)
- Same level of detail
- Same edge treatment (no anti-aliasing)
- Transparent backgrounds

Color palette:
- Food: #FFC107, #FF8F00
- Wood: #795548, #5D4037
- Stone: #9E9E9E, #757575
- Gold: #FFD700, #FFA000
```

## Pós-Processamento

Após gerar com IA, você provavelmente precisará:

### 1. Ajuste de Tamanho

- Redimensionar para o tamanho exato (64x64, 32x32)
- Usar "nearest neighbor" para manter pixels nítidos

### 2. Correção de Cores

- Ajustar para a paleta exata do jogo
- Usar ferramentas como "replace color"

### 3. Limpeza

- Remover pixels soltos
- Corrigir bordas irregulares
- Garantir transparência correta

### 4. Teste In-Game

- Colocar o asset no jogo
- Ver se funciona com outros assets
- Ajustar se necessário

## Ferramentas Recomendadas

### Edição de Pixel Art

- **Aseprite** (pago, melhor opção)
- **Piskel** (grátis, online)
- **GraphicsGale** (grátis)

### Ajustes Gerais

- **Photoshop** / **GIMP** (grátis)
- **Figma** (para UI)

### Criação de Spritesheets

- **TexturePacker**
- **ShoeBox** (grátis)

## Problemas Comuns

| Problema             | Solução                                 |
| -------------------- | --------------------------------------- |
| Imagem muito grande  | Especificar tamanho no prompt           |
| Estilo inconsistente | Gerar em lote, usar mesmas descrições   |
| Cores diferentes     | Usar códigos HEX exatos                 |
| Muitos detalhes      | Pedir "simple", "bold shapes"           |
| Anti-aliasing        | Pedir "no anti-aliasing", "crisp edges" |
| Perspectiva errada   | Ser mais específico sobre ângulo        |

## Workflow Sugerido

```
1. Definir asset necessário
        ↓
2. Consultar docs/art/prompts/[tipo].md
        ↓
3. Adaptar prompt para sua necessidade
        ↓
4. Gerar 3-4 variações
        ↓
5. Escolher melhor resultado
        ↓
6. Pós-processar (tamanho, cores)
        ↓
7. Testar no jogo
        ↓
8. Ajustar se necessário
        ↓
9. Salvar na pasta correta
```

## Organização de Assets

```
assets/
├── tiles/
│   ├── plains_01.png
│   ├── plains_02.png
│   └── ...
├── buildings/
│   ├── stone_age/
│   │   ├── town_center.png
│   │   └── ...
│   └── bronze_age/
│       └── ...
├── icons/
│   ├── resources/
│   └── actions/
├── ui/
│   ├── panels/
│   └── buttons/
└── raw/
    └── (originais da IA antes de processar)
```

## Checklist Final de Asset

- [ ] Tamanho correto
- [ ] Cores da paleta
- [ ] Transparência OK
- [ ] Perspectiva consistente
- [ ] Nomeação correta
- [ ] Testado no jogo
- [ ] Original salvo em /raw
