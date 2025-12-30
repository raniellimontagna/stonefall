# Sistema de Assets e Evolução Visual

## Visão Geral

O sistema permite que construções evoluam visualmente à medida que a civilização avança através das eras. Cada era (Stone, Bronze, Iron) possui seu próprio conjunto de texturas para as mesmas construções.

## Estrutura de Diretórios

Os assets de construções estão organizados por era no diretório `apps/web/public/assets/buildings/`:

```
assets/buildings/
├── stone/        # Estilo primitivo (palha, madeira bruta)
│   ├── town_center.png
│   ├── house.png
│   └── ...
├── bronze/       # Estilo intermediário (telhas de barro, madeira refinada)
│   ├── town_center.png
│   ├── house.png
│   └── ...
└── iron/         # Estilo avançado (pedra, reforços de ferro, castelos)
    ├── town_center.png
    ├── house.png
    └── ...
```

## Convenção de Nomes (Texture Keys)

No Phaser, as texturas são carregadas usando a seguinte convenção:
`building_{building_type}_{era}`

Exemplos:
- `building_house_stone`
- `building_town_center_bronze`
- `building_farm_iron`

## Ciclo de Vida da Evolução

### 1. Carregamento (`BootScene.ts`)
Todas as variações de era são carregadas durante o boot do jogo:

```typescript
const eras = ['stone', 'bronze', 'iron'];
const buildingTypes = ['town_center', 'house', 'farm', ...];

for (const era of eras) {
  for (const type of buildingTypes) {
    this.load.image(`building_${type}_${era}`, `assets/buildings/${era}/${type}.png`);
  }
}
```

### 2. Renderização Inicial (`BuildingManager.ts`)
Ao colocar uma construção, o `BuildingManager` consulta a era atual no `useGameStore` para escolher a textura correta.

### 3. Atualização de Era
O `BuildingManager` se inscreve para mudanças na era. Quando o jogador avança (ex: Stone -> Bronze), o sistema percorre todas as construções existentes no mapa e troca suas texturas instantaneamente.

```typescript
private updateAllBuildingsEra(era: string): void {
  this.buildings.forEach((sprite) => {
    const type = sprite.getData('buildingType');
    const textureKey = `building_${type}_${era}`;
    if (this.scene.textures.exists(textureKey)) {
      sprite.setTexture(textureKey);
      sprite.setDisplaySize(TILE_SIZE, TILE_SIZE);
    }
  });
}
```

## Guia para Criação de Assets

Para manter a consistência visual, siga estas diretrizes:

| Era | Materiais Dominantes | Estilo Visual |
|-----|----------------------|---------------|
| **Pedra** | Palha, Troncos, Pedras brutas | Primitivo, fogo de acampamento próximo, aparência frágil. |
| **Bronze** | Madeiras tratadas, Tijolos, Telhas de barro | Refinado, estruturado, introdução de cores quentes (telhados). |
| **Ferro** | Pedra talhada, Blocos de rocha, Reforços metálicos | Imponente, defensivo, aparência de castelo ou forte. |

### Especificações Técnicas
- **Formato**: PNG com transparência
- **Resolução Recomendada**: 256x256 ou 512x512 (o Phaser escala para o tamanho do tile)
- **Perspectiva**: Isométrica (aprox. 30 graus)
- **Tamanho do Tile**: 64x64px no grid
