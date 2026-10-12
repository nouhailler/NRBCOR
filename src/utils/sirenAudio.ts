// Synthesize the official French civil protection siren (Signal National d'Alerte RNA)
// Frequency modulates between ~380 Hz and ~450 Hz in undulating cycles, or continuous 380 Hz for "Fin d'alerte".

let audioCtx: AudioContext | null = null;
let currentOsc: OscillatorNode | null = null;
let currentGain: GainNode | null = null;
let sirenInterval: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playRNASiren(type: 'alerte' | 'fin', onEnd?: () => void) {
  stopSiren();
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Base frequency
    osc.frequency.setValueAtTime(380, ctx.currentTime);

    // Filter to give that authentic outdoor horn/pneumatic horn acoustic
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    currentOsc = osc;
    currentGain = gain;

    osc.start();

    if (type === 'alerte') {
      // Modulate frequency up and down every 4 seconds
      let cycle = 0;
      const duration = 12; // 12 seconds preview simulation
      const startTime = ctx.currentTime;

      sirenInterval = setInterval(() => {
        if (!currentOsc) return;
        const now = ctx.currentTime;
        if (now - startTime >= duration) {
          stopSiren();
          if (onEnd) onEnd();
          return;
        }

        cycle++;
        if (cycle % 2 === 1) {
          // Ascending pitch
          currentOsc.frequency.linearRampToValueAtTime(450, now + 2);
        } else {
          // Descending pitch
          currentOsc.frequency.linearRampToValueAtTime(380, now + 2);
        }
      }, 2000);
    } else {
      // Continuous 30s sound for fin d'alerte (preview 6s)
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      setTimeout(() => {
        stopSiren();
        if (onEnd) onEnd();
      }, 6000);
    }
  } catch (e) {
    console.warn('Audio synthesis not supported or blocked by user gesture', e);
  }
}

export function stopSiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (currentGain && audioCtx) {
    try {
      currentGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    } catch (e) {}
  }
  setTimeout(() => {
    if (currentOsc) {
      try {
        currentOsc.stop();
        currentOsc.disconnect();
      } catch (e) {}
      currentOsc = null;
    }
  }, 350);
}
