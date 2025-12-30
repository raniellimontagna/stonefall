import { Howl, Howler } from 'howler';

class SoundManager {
  private static instance: SoundManager;

  private sounds: Record<string, Howl> = {};
  private music: Howl | null = null;
  private muted: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.3;

  private constructor() {
    // Don't preload sounds, load on demand
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /**
   * Lazy load a sound effect
   */
  private loadSound(key: string): Howl | null {
    if (this.sounds[key]) {
      return this.sounds[key];
    }

    const soundMap: Record<string, string> = {
      click: '/assets/audio/sfx/click.m4a',
      build: '/assets/audio/sfx/build.wav',
      success: '/assets/audio/sfx/success.wav',
      error: '/assets/audio/sfx/error.wav',
      collect: '/assets/audio/sfx/collect.wav',
      battle: '/assets/audio/sfx/battle.wav',
    };

    const src = soundMap[key];
    if (!src) {
      console.warn(`Sound key "${key}" not found in soundMap`);
      return null;
    }

    try {
      this.sounds[key] = new Howl({
        src: [src],
        volume: this.sfxVolume,
        onloaderror: (_id, error) => {
          console.warn(`Failed to load sound: ${key}`, error);
        },
      });
      return this.sounds[key];
    } catch (e) {
      console.warn(`Error creating Howl for ${key}:`, e);
      return null;
    }
  }

  /**
   * Play a sound effect
   */
  public play(key: string) {
    if (this.muted) return;

    try {
      const sound = this.loadSound(key);
      if (sound) {
        sound.play();
      }
    } catch (e) {
      console.warn('Sound play failed', e);
    }
  }

  /**
   * Start background music loop
   */
  public playMusic(loop: boolean = true) {
    if (this.music) {
      this.music.play();
      return;
    }

    try {
      this.music = new Howl({
        src: ['/assets/audio/music/ambient_loop.mp3'],
        loop,
        volume: this.musicVolume,
        onloaderror: (_id, error) => {
          console.warn('Failed to load background music', error);
        },
      });

      if (!this.muted) {
        this.music.play();
      }
    } catch (e) {
      console.warn('Music play failed', e);
    }
  }

  /**
   * Stop background music
   */
  public stopMusic() {
    if (this.music) {
      this.music.stop();
    }
  }

  /**
   * Toggle global mute
   */
  public toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    return this.muted;
  }

  /**
   * Set SFX volume (0.0 to 1.0)
   */
  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume(this.sfxVolume);
    });
  }

  /**
   * Set music volume (0.0 to 1.0)
   */
  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume(this.musicVolume);
    }
  }

  /**
   * Get current mute state
   */
  public isMuted(): boolean {
    return this.muted;
  }
}

export const soundManager = SoundManager.getInstance();
