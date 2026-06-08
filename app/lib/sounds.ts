// Lightweight UI sound effects built with the Web Audio API.
// No audio files or libraries required. Tones are synthesized on the fly.

type WindowWithAudio = Window & { webkitAudioContext?: typeof AudioContext };

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

// A clean, pleasant two-tone "ding" played when a transfer succeeds.
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const tones = [
      { freq: 830, gain: 0.3, stop: 0.5 }, // G#5
      { freq: 1245, gain: 0.15, stop: 0.4 }, // E6 harmonic for richness
    ];

    for (const tone of tones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(tone.gain, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + tone.stop);
      osc.start(now);
      osc.stop(now + tone.stop);
    }
  } catch {
    // Audio unavailable or blocked. Fail silently.
  }
}

// A soft, low "thud" played when a transfer is blocked or rejected.
export function playRejectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
    osc.start(now);
    osc.stop(now + 0.32);
  } catch {
    // Fail silently.
  }
}
