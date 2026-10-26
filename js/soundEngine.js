/**
 * PlacedOrPanic - Web Audio API Synthesizer (Zero External Audio Files Needed)
 * Pure synthesized tactile audio for switches, clicks, panic heartbeats,
 * victory placement chimes, and panic buzzers.
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.heartbeatTimer = null;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
  }

  ensureContextRunning() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopHeartbeat();
    }
    return this.isMuted;
  }

  // Tactile Mechanical Click (Options, Navigation, Buttons)
  playClick() {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      this.ensureContextRunning();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.045);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Tactile Heavy Switch Click (Review Tag toggle)
  playSwitch() {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      this.ensureContextRunning();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(650, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.055);
    } catch (e) {}
  }

  // Panic Mode Heartbeat Audio Loop (Synthesized lub-dub)
  startHeartbeat() {
    if (this.isMuted || this.heartbeatTimer) return;
    this.initAudioContext();
    this.ensureContextRunning();

    const beat = () => {
      if (this.isMuted || !this.heartbeatTimer) return;
      try {
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;

        // Lub (First thud)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.09);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.095);

        // Dub (Second higher thud)
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(95, now + 0.16);
        osc2.frequency.exponentialRampToValueAtTime(45, now + 0.25);
        gain2.gain.setValueAtTime(0.4, now + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now + 0.16);
        osc2.stop(now + 0.255);
      } catch (e) {}
    };

    beat();
    this.heartbeatTimer = setInterval(beat, 850);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Placement Chime (Major triad arpeggio: C5 - E5 - G5 - C6)
  playVictory() {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      this.ensureContextRunning();
      if (!this.audioCtx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + i * 0.12);

        gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + i * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + i * 0.12);
        osc.stop(this.audioCtx.currentTime + i * 0.12 + 0.45);
      });
    } catch (e) {}
  }

  // Panic / Low Score Buzzer
  playPanicBuzzer() {
    if (this.isMuted) return;
    try {
      this.initAudioContext();
      this.ensureContextRunning();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, this.audioCtx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.55);
    } catch (e) {}
  }
}

const soundEngine = new SoundEngine();
