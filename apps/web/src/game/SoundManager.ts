import { Howl, Howler } from 'howler';

class SoundManager {
  private static instance: SoundManager;

  private sounds: Record<string, Howl> = {};
  // private music: Howl | null = null; // Reserved for future use
  private muted: boolean = false;

  private constructor() {
    this.loadSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private loadSounds() {
    // Example placeholders
    this.sounds['click'] = new Howl({ src: ['/assets/audio/click.mp3'] });
    this.sounds['build'] = new Howl({ src: ['/assets/audio/build.mp3'] });
    this.sounds['success'] = new Howl({ src: ['/assets/audio/success.mp3'] });
    this.sounds['error'] = new Howl({ src: ['/assets/audio/error.mp3'] });
  }

  public play(key: string) {
    if (this.muted) return;
    try {
      if (this.sounds[key]) {
        this.sounds[key].play();
      }
    } catch (e) {
      console.warn('Sound play failed', e);
    }
  }

  public toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    return this.muted;
  }
}

export const soundManager = SoundManager.getInstance();
