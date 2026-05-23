// Web Audio API Synthesizer for Immersive Cyberpunk Nightlife Loops
// Created as an engaging alternative to external MP3s to dodge CORS and offline failures.

let audioCtx: AudioContext | null = null;
let activeOscillators: { osc1: OscillatorNode; osc2: OscillatorNode; filter: BiquadFilterNode; gain: GainNode }[] = [];
let sequencerInterval: any = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopCyberpunkLoop() {
  if (sequencerInterval) {
    clearInterval(sequencerInterval);
    sequencerInterval = null;
  }
  activeOscillators.forEach(inst => {
    try {
      inst.osc1.stop();
      inst.osc2.stop();
    } catch (e) {}
  });
  activeOscillators = [];
}

export function playCyberpunkLoop(
  type: "sawtooth" | "sine" | "triangle" | "square",
  tempo: number,
  baseFreq: number
) {
  stopCyberpunkLoop(); // Ensure clean slate

  const ctx = getAudioContext();
  const stepTime = 60 / tempo / 2; // Eighth note duration
  let step = 0;

  // Simple bass note sequences
  const pattern = [1, 1.2, 1.5, 1.2, 1.8, 1.5, 1.2, 1.0];

  sequencerInterval = setInterval(() => {
    if (ctx.state === "suspended") return;

    const time = ctx.currentTime;
    const factor = pattern[step % pattern.length];
    const freq = baseFreq * factor;

    // Create custom synthesizer nodes
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const amp = ctx.createGain();

    osc1.type = type;
    osc1.frequency.setValueAtTime(freq, time);
    // Subtle detune for beefy chorus effect
    osc1.detune.setValueAtTime(-12, time);

    osc2.type = type;
    osc2.frequency.setValueAtTime(freq * 1.5, time); // Fifth harmony
    osc2.detune.setValueAtTime(12, time);

    // Cyberpunk custom lowpass filter with resonance sweep
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 3, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.8, time + stepTime * 0.9);
    filter.Q.setValueAtTime(type === "sawtooth" ? 8 : 4, time);

    // Sharp attack & decay amp envelope
    amp.gain.setValueAtTime(0, time);
    amp.gain.linearRampToValueAtTime(0.18, time + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.001, time + stepTime * 0.85);

    // Connections
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(amp);
    amp.connect(ctx.destination);

    // Playback
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + stepTime * 0.9);
    osc2.stop(time + stepTime * 0.9);

    // Keep track for quick terminations
    const inst = { osc1, osc2, filter, gain: amp };
    activeOscillators.push(inst);

    // Cleanup reference after note is complete
    setTimeout(() => {
      activeOscillators = activeOscillators.filter(i => i !== inst);
    }, stepTime * 1000 + 100);

    // Simple synthesized Hi-Hat on offbeats
    if (step % 2 === 1) {
      playSimulatedHat(ctx, time);
    }

    step++;
  }, stepTime * 1000);
}

function playSimulatedHat(ctx: AudioContext, time: number) {
  // Synthesized metallic clicks using highpass filtration of white noise
  const bufferSize = ctx.sampleRate * 0.04; // 40ms duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(8000, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.04, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(time);
  noise.stop(time + 0.04);
}
