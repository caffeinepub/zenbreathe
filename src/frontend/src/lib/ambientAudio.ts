export class AmbientAudioController {
  private rainAudio: HTMLAudioElement | null = null;
  private wavesAudio: HTMLAudioElement | null = null;
  private currentVolume: number = 0.5;

  constructor() {
    this.rainAudio = new Audio('/assets/ambient/rain.mp3');
    this.wavesAudio = new Audio('/assets/ambient/waves.mp3');
    
    if (this.rainAudio) {
      this.rainAudio.loop = true;
      this.rainAudio.volume = this.currentVolume;
    }
    
    if (this.wavesAudio) {
      this.wavesAudio.loop = true;
      this.wavesAudio.volume = this.currentVolume;
    }
  }

  setVolume(volume: number): void {
    // Volume should be between 0 and 1
    this.currentVolume = Math.max(0, Math.min(1, volume));
    
    if (this.rainAudio) {
      this.rainAudio.volume = this.currentVolume;
    }
    
    if (this.wavesAudio) {
      this.wavesAudio.volume = this.currentVolume;
    }
  }

  playRain(): void {
    // Stop waves first (exclusive playback)
    this.stopWaves();
    
    if (this.rainAudio) {
      this.rainAudio.play().catch(() => {
        // Silent fail if autoplay is blocked
      });
    }
  }

  stopRain(): void {
    if (this.rainAudio) {
      this.rainAudio.pause();
      this.rainAudio.currentTime = 0;
    }
  }

  playWaves(): void {
    // Stop rain first (exclusive playback)
    this.stopRain();
    
    if (this.wavesAudio) {
      this.wavesAudio.play().catch(() => {
        // Silent fail if autoplay is blocked
      });
    }
  }

  stopWaves(): void {
    if (this.wavesAudio) {
      this.wavesAudio.pause();
      this.wavesAudio.currentTime = 0;
    }
  }

  stopAll(): void {
    this.stopRain();
    this.stopWaves();
  }
  
  isRainPlaying(): boolean {
    return this.rainAudio ? !this.rainAudio.paused : false;
  }
  
  isWavesPlaying(): boolean {
    return this.wavesAudio ? !this.wavesAudio.paused : false;
  }
}
