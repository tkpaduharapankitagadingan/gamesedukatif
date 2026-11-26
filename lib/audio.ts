// Web Audio API sound effects, musical note synthesizer, and Indonesian voice synthesis helper

class SoundSystem {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    if (mute && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isMuted() {
    return this.muted;
  }

  // Play a musical xylophone / piano note at a specific frequency (Hz)
  public playNote(frequency: number, duration: number = 0.45) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();
      const harmonicGain = ctx.createGain();

      // Warm bell/xylophone timbre
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(frequency * 2, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      harmonicGain.gain.setValueAtTime(0.1, now);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);

      osc.connect(gain);
      harmonic.connect(harmonicGain);
      gain.connect(ctx.destination);
      harmonicGain.connect(ctx.destination);

      osc.start(now);
      harmonic.start(now);
      osc.stop(now + duration);
      harmonic.stop(now + duration);
    } catch {
      // ignore audio errors
    }
  }

  // Play click / pop sound
  public playPop() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore audio errors
    }
  }

  // Play success chime (correct match)
  public playSuccess() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // ignore audio errors
    }
  }

  // Play celebration fanfare (game win)
  public playCelebration() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
      const times = [0, 0.15, 0.3, 0.45, 0.6, 0.8];
      const durations = [0.12, 0.12, 0.12, 0.12, 0.12, 0.5];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + times[idx]);

        gain.gain.setValueAtTime(0.3, now + times[idx]);
        gain.gain.exponentialRampToValueAtTime(0.001, now + times[idx] + durations[idx]);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + times[idx]);
        osc.stop(now + times[idx] + durations[idx]);
      });
    } catch {
      // ignore audio errors
    }
  }

  // Speak Indonesian encouragement or instruction
  public speak(text: string) {
    if (this.muted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // stop previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9; // slightly slower for young children
      utterance.pitch = 1.2; // friendly warm pitch
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore speech errors
    }
  }
}

export const soundManager = new SoundSystem();
