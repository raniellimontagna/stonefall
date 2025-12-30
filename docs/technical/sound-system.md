# Sistema de Som e Música

## Visão Geral

O jogo utiliza **Howler.js** para gerenciar efeitos sonoros e música ambiente, proporcionando feedback auditivo para ações do jogador e criando uma atmosfera imersiva.

## Arquitetura

### SoundManager (Singleton)

Localizado em: `apps/web/src/game/SoundManager.ts`

```typescript
class SoundManager {
  private sounds: Record<string, Howl> = {};
  private music: Howl | null = null;
  private currentTrackName: string | null = null;
  private sfxVolume: number = 0.3;
  private musicVolume: number = 0.4;
}
```

## Efeitos Sonoros (SFX)

### Sons Disponíveis

| Som | Arquivo | Usado Em | Volume |
|-----|---------|----------|--------|
| `click` | click.mp3 | Cliques em botões | 0.3 |
| `build` | build.mp3 | Construir edifícios | 0.3 |
| `success` | success.mp3 | Avanço de era, vitória | 0.3 |
| `error` | error.mp3 | Derrota (fome/combate) | 0.3 |
| `collect` | collect.mp3 | Resolver eventos | 0.3 |
| `battle` | battle.mp3 | Atacar ou defender | 0.3 |

### Integração

Os sons são tocados automaticamente nas seguintes ações:

```typescript
// gameStore.ts
placeBuilding() {
  // ... lógica de construção
  soundManager.play('build');
}

advanceEra() {
  // ... lógica de avanço
  soundManager.play('success');
}

attack() {
  // ... lógica de ataque
  soundManager.play('battle');
}
```

## Sistema de Música

### Músicas Disponíveis

8 faixas ambiente que tocam aleatoriamente:

1. `ambient_village.mp3`
2. `ambient_forest.mp3`
3. `ambient_dawn.mp3`
4. `ambient_peaceful.mp3`
5. `ambient_journey.mp3`
6. `ambient_kingdom.mp3`
7. `ambient_ancient.mp3`
8. `ambient_twilight.mp3`

### Comportamento

- **Reprodução aleatória**: Cada música é selecionada aleatoriamente
- **Transição automática**: Quando uma música termina, outra aleatória começa
- **Volume**: 0.4 (40%)
- **Loop**: Não (para permitir variação)

### Controles

#### TickDisplay

Botão de música no painel de controles:
- Ícone 🎵 quando tocando
- Ícone 🎶 quando parado
- Toggle on/off

#### Debug Menu

- **Próxima Música**: Pula para outra música aleatória
- Útil para testar diferentes faixas

## API Pública

### SoundManager

```typescript
// Tocar efeito sonoro
soundManager.play('click');

// Iniciar música
soundManager.playMusic();

// Parar música
soundManager.stopMusic();

// Pular para próxima música
soundManager.skipToNextTrack();

// Obter nome da música atual
const trackName = soundManager.getCurrentTrackName(); // "Village"

// Controlar volume
soundManager.setSfxVolume(0.5);    // 0.0 - 1.0
soundManager.setMusicVolume(0.3);  // 0.0 - 1.0

// Mute global
soundManager.toggleMute();
const isMuted = soundManager.isMuted();
```

## Estrutura de Arquivos

```
apps/web/public/assets/audio/
├── sfx/
│   ├── click.mp3
│   ├── build.mp3
│   ├── success.mp3
│   ├── error.mp3
│   ├── collect.mp3
│   └── battle.mp3
└── music/
    ├── ambient_village.mp3
    ├── ambient_forest.mp3
    ├── ambient_dawn.mp3
    ├── ambient_peaceful.mp3
    ├── ambient_journey.mp3
    ├── ambient_kingdom.mp3
    ├── ambient_ancient.mp3
    └── ambient_twilight.mp3
```

## Implementação Técnica

### Lazy Loading

Sons são carregados sob demanda para melhor performance:

```typescript
private loadSound(key: string): Howl | null {
  if (this.sounds[key]) {
    return this.sounds[key];
  }
  
  this.sounds[key] = new Howl({
    src: [soundMap[key]],
    volume: this.sfxVolume,
  });
  
  return this.sounds[key];
}
```

### Reprodução Aleatória de Música

```typescript
private playRandomTrack() {
  const track = this.getRandomTrack();
  
  this.music = new Howl({
    src: [track],
    loop: false,
    volume: this.musicVolume,
    onend: () => {
      this.music = null;
      if (!this.muted) {
        this.playRandomTrack(); // Próxima música
      }
    },
  });
  
  this.music.play();
}
```

## Considerações de UX

### Volumes Balanceados

- **SFX (0.3)**: Baixo o suficiente para não ser intrusivo em cliques repetidos
- **Música (0.4)**: Presente mas não dominante, permite foco no gameplay

### Interação do Usuário

- Navegadores modernos requerem interação do usuário para tocar áudio
- Música só inicia quando o jogador clica no botão de música
- SFX funcionam imediatamente após primeira interação

### Feedback Auditivo

Cada ação importante tem feedback sonoro apropriado:
- ✅ **Positivo**: `success`, `collect`
- ❌ **Negativo**: `error`
- ⚔️ **Ação**: `battle`, `build`
- 🖱️ **Interface**: `click`

## Performance

### Otimizações

1. **Lazy loading**: Sons carregados apenas quando necessários
2. **Singleton pattern**: Uma única instância do SoundManager
3. **Object pooling**: Howl instances reutilizadas
4. **Formato MP3**: Compatibilidade universal com boa compressão

### Tamanho dos Assets

- SFX: ~20-70KB cada (~300KB total)
- Música: ~2.6-3.5MB cada (~24MB total)
- Total: ~24.3MB de áudio

## Futuras Melhorias

- [ ] Música específica por era
- [ ] Efeitos sonoros posicionais (3D audio)
- [ ] Playlist customizável
- [ ] Fade in/out entre músicas
- [ ] Configurações de áudio persistentes
- [ ] Indicador visual da música atual
