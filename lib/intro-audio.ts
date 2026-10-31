/** A quiet, original two-tone signal. No audio asset or network request is involved. */
export class IntroAudio {
  private context: AudioContext | null = null;
  private output: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  async enable(): Promise<boolean> {
    if (typeof window === "undefined" || !window.AudioContext) return false;
    try {
      if (!this.context) {
        const context = new AudioContext();
        const output = context.createGain();
        const filter = context.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 420;
        output.gain.value = 0;
        filter.connect(output);
        output.connect(context.destination);
        for (const [frequency, level] of [[110, 0.62], [164.81, 0.38]]) {
          const oscillator = context.createOscillator();
          const voice = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          voice.gain.value = level;
          oscillator.connect(voice);
          voice.connect(filter);
          oscillator.start();
          this.oscillators.push(oscillator);
        }
        this.context = context;
        this.output = output;
      }
      await this.context.resume();
      this.output?.gain.setTargetAtTime(0.012, this.context.currentTime, 0.18);
      return this.context.state === "running";
    } catch {
      this.dispose();
      return false;
    }
  }

  async mute() {
    if (!this.context) return;
    if (this.output) this.output.gain.value = 0;
    try { await this.context.suspend(); } catch { /* The page may be unloading. */ }
  }

  async resume() {
    if (!this.context) return;
    try {
      await this.context.resume();
      this.output?.gain.setTargetAtTime(0.012, this.context.currentTime, 0.18);
    } catch { /* Browsers can require another explicit gesture. */ }
  }

  dispose() {
    for (const oscillator of this.oscillators) {
      try { oscillator.stop(); } catch { /* It may already be stopped. */ }
      oscillator.disconnect();
    }
    this.oscillators = [];
    this.output?.disconnect();
    void this.context?.close().catch(() => undefined);
    this.context = null;
    this.output = null;
  }
}
