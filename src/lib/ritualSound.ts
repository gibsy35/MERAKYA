/**
 * Merakya "L'Écho des Rituels" Web Audio API Soundscape Generator.
 * Synthesizes 100% real-time ambient soundscapes:
 * 1. Moroccan Atlas Mountain Wind (Resonant filtered pink/white noise)
 * 2. Healing Tibetan Singing Bowls (Harmonic additive sines with organic beats/warbles)
 * 3. Warm crackling wood fire (Random high-pass impulse crackles and low thumps)
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let windNoiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
let windFilter: BiquadFilterNode | null = null;
let windLfo1: OscillatorNode | null = null;
let windLfo2: OscillatorNode | null = null;
let fireTimer: any = null;
let bowlInterval: any = null;
let isPlaying = false;
let updateCallback: ((active: boolean) => void) | null = null;

const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2; // 2 seconds of stereo noise
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Filter white noise to pink noise for a warmer, richer wind feel
      data[i] = (lastOut * 0.95 + white * 0.05);
      lastOut = data[i];
    }
  }
  return buffer;
};

export const startRitualSoundscape = (callback?: (active: boolean) => void) => {
  if (isPlaying) {
    stopRitualSoundscape();
    return;
  }

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 2.0); // Smooth 2s fade in
  masterGain.connect(audioCtx.destination);

  isPlaying = true;
  if (callback) {
    updateCallback = callback;
    callback(true);
  }

  // --- 1. MOROCCAN ATLAS WIND ---
  const windSource = audioCtx.createBufferSource();
  windSource.buffer = createNoiseBuffer(audioCtx);
  windSource.loop = true;

  windFilter = audioCtx.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.Q.setValueAtTime(2.5, audioCtx.currentTime);
  windFilter.frequency.setValueAtTime(280, audioCtx.currentTime);

  const windGain = audioCtx.createGain();
  windGain.gain.setValueAtTime(0.18, audioCtx.currentTime);

  // Modulate wind frequency for natural gusts using 2 LFOs
  windLfo1 = audioCtx.createOscillator();
  windLfo1.type = 'sine';
  windLfo1.frequency.setValueAtTime(0.05, audioCtx.currentTime); // 20s cycle

  windLfo2 = audioCtx.createOscillator();
  windLfo2.type = 'sine';
  windLfo2.frequency.setValueAtTime(0.08, audioCtx.currentTime); // 12s cycle

  const lfoGain1 = audioCtx.createGain();
  lfoGain1.gain.setValueAtTime(120, audioCtx.currentTime); // Gust amplitude

  const lfoGain2 = audioCtx.createGain();
  lfoGain2.gain.setValueAtTime(60, audioCtx.currentTime);

  windLfo1.connect(lfoGain1);
  lfoGain1.connect(windFilter.frequency);

  windLfo2.connect(lfoGain2);
  lfoGain2.connect(windFilter.frequency);

  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);

  windLfo1.start();
  windLfo2.start();
  windSource.start();

  // --- 2. THE TIBETAN SINGING BOWL SEQUENCE ---
  // Strike a beautiful multi-harmonic bowl right away and then every 12 seconds
  const strikeBowl = (freq: number) => {
    if (!audioCtx || !masterGain) return;
    const now = audioCtx.currentTime;

    // Define beautiful harmonic partials of a singing bowl
    const partials = [
      { f: freq, g: 0.18, d: 9.0 },     // Fundamental
      { f: freq * 1.88, g: 0.09, d: 7.0 }, // Harmonic 2
      { f: freq * 2.85, g: 0.06, d: 5.0 }, // Harmonic 3
      { f: freq * 3.98, g: 0.03, d: 3.5 }, // Harmonic 4
    ];

    partials.forEach((p) => {
      const osc = audioCtx!.createOscillator();
      const pGain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now);

      // Low frequency tremolo (vibrato) for organic warbling
      const tremolo = audioCtx!.createOscillator();
      const tremoloGain = audioCtx!.createGain();
      tremolo.frequency.setValueAtTime(4.5 + Math.random() * 2, now); // 4.5Hz - 6.5Hz
      tremoloGain.gain.setValueAtTime(0.012, now);
      tremolo.connect(tremoloGain);
      tremoloGain.connect(pGain.gain);

      pGain.gain.setValueAtTime(0, now);
      pGain.gain.linearRampToValueAtTime(p.g, now + 0.15); // gentle strike attack
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.d);

      osc.connect(pGain);
      pGain.connect(masterGain!);

      tremolo.start(now);
      osc.start(now);
      
      tremolo.stop(now + p.d + 0.1);
      osc.stop(now + p.d + 0.1);
    });
  };

  strikeBowl(216); // Direct deep initial bowl strike (G3 frequency - aligns with root/calm)
  
  const bowlFrequencies = [216, 288, 324, 432]; // Warm, healing ritual tones
  let bowlIndex = 1;

  bowlInterval = setInterval(() => {
    if (audioCtx && isPlaying) {
      const nextFreq = bowlFrequencies[bowlIndex % bowlFrequencies.length];
      strikeBowl(nextFreq);
      bowlIndex++;
    }
  }, 10000);

  // --- 3. WARM CRACKLING WOOD FIRE COZY ENERGY ---
  const fireGain = audioCtx.createGain();
  fireGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  fireGain.connect(masterGain);

  const makeFirePop = () => {
    if (!audioCtx || !isPlaying) return;
    const now = audioCtx.currentTime;

    // Fast tiny high-frequency crackle spark
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 5000, now); // high pop

    g.gain.setValueAtTime(0.015 + Math.random() * 0.035, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.02 + Math.random() * 0.05);

    osc.connect(g);
    g.connect(fireGain);

    osc.start(now);
    osc.stop(now + 0.08);

    // Randomly trigger low wooden muffled thumps of bursting logs
    if (Math.random() > 0.85) {
      const thump = audioCtx.createOscillator();
      const thumpGain = audioCtx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(55 + Math.random() * 45, now); // low bass thump

      thumpGain.gain.setValueAtTime(0.08 + Math.random() * 0.1, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15 + Math.random() * 0.2);

      thump.connect(thumpGain);
      thumpGain.connect(fireGain);

      thump.start(now);
      thump.stop(now + 0.4);
    }

    // Schedule next randomized crackle
    const nextInterval = 40 + Math.random() * 420; // spontaneous
    fireTimer = setTimeout(makeFirePop, nextInterval);
  };

  makeFirePop();

  // Auto shut-off after 5 minutes (300,000 milliseconds) as requested
  setTimeout(() => {
    stopRitualSoundscape();
  }, 300000);
};

export const stopRitualSoundscape = () => {
  if (!isPlaying) return;
  isPlaying = false;

  if (bowlInterval) {
    clearInterval(bowlInterval);
    bowlInterval = null;
  }
  if (fireTimer) {
    clearTimeout(fireTimer);
    fireTimer = null;
  }

  // Fade out master gain smoothly to avoid audio pops/cracks
  if (masterGain && audioCtx) {
    const now = audioCtx.currentTime;
    try {
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.linearRampToValueAtTime(0, now + 1.2);
    } catch (e) {
      // safe fallback
    }
    setTimeout(() => {
      if (audioCtx) {
        audioCtx.close().catch(() => {});
        audioCtx = null;
      }
    }, 1300);
  }

  if (updateCallback) {
    updateCallback(false);
    updateCallback = null;
  }
};

export const getRitualSoundscapeState = () => isPlaying;
