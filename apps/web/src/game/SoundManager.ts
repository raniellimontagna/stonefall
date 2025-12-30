import { Howl, Howler } from 'howler';

class SoundManager {
  private static instance: SoundManager;

  private sounds: Record<string, Howl> = {};
  private music: Howl | null = null;
  private muted: boolean = false;
  private sfxVolume: number = 0.3; // Reduced from 0.7 for less intrusive clicks
  private musicVolume: number = 0.4; // Slightly higher for ambient music

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
      click: '/assets/audio/sfx/click.mp3',
      build: '/assets/audio/sfx/build.mp3',
      success: '/assets/audio/sfx/success.mp3',
      error: '/assets/audio/sfx/error.mp3',
      collect: '/assets/audio/sfx/collect.mp3',
      battle: '/assets/audio/sfx/battle.mp3',
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

  // Available music tracks
  private musicTracks: string[] = [
    '/assets/audio/music/ambient_village.mp3',
    '/assets/audio/music/ambient_forest.mp3',
    '/assets/audio/music/ambient_dawn.mp3',
    '/assets/audio/music/ambient_peaceful.mp3',
    '/assets/audio/music/ambient_journey.mp3',
    '/assets/audio/music/ambient_kingdom.mp3',
    '/assets/audio/music/ambient_ancient.mp3',
    '/assets/audio/music/ambient_twilight.mp3',
  ];

  /**
   * Get a random music track
   */
  private getRandomTrack(): string {
    const index = Math.floor(Math.random() * this.musicTracks.length);
    return this.musicTracks[index]!;
  }

  /**
   * Start background music with random track selection
   */
  public playMusic() {
    if (this.music) {
      this.music.play();
      return;
    }

    this.playRandomTrack();
  }

  /**
   * Play a random track and queue the next one when it ends
   */
  private playRandomTrack() {
    const track = this.getRandomTrack();

    try {
      this.music = new Howl({
        src: [track],
        loop: false, // Don't loop single track, play next random instead
        volume: this.musicVolume,
        onend: () => {
          // Play another random track when current ends
          this.music = null;
          if (!this.muted) {
            this.playRandomTrack();
          }
        },
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
