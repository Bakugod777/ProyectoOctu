/**
 * Soft procedural night bed — tension without harsh synths.
 */

export type NightAudioController = {
  start: () => Promise<void>;
  stop: () => void;
  setStage: (stage: string) => void;
  setMuted: (muted: boolean) => void;
  isMuted: () => boolean;
  unlocked: () => boolean;
  tone: (kind: "tap" | "ok" | "bad" | "reveal" | "seal") => void;
};

function bedFor(stage: string) {
  switch (stage) {
    case "portal":
      return { drone: 0.028, wind: 0.012, heartVol: 0.03, bpm: 54 };
    case "lanterns":
      return { drone: 0.034, wind: 0.016, heartVol: 0.09, bpm: 62 };
    case "stars":
      return { drone: 0.038, wind: 0.017, heartVol: 0.13, bpm: 68 };
    case "memory":
      return { drone: 0.04, wind: 0.018, heartVol: 0.17, bpm: 76 };
    case "timeline":
      return { drone: 0.043, wind: 0.019, heartVol: 0.2, bpm: 84 };
    case "whisper":
      return { drone: 0.046, wind: 0.02, heartVol: 0.24, bpm: 92 };
    case "letter":
      return { drone: 0.022, wind: 0.01, heartVol: 0.06, bpm: 56 };
    default:
      return { drone: 0.03, wind: 0.014, heartVol: 0.1, bpm: 64 };
  }
}

function createNoiseBuffer(ctx: AudioContext, seconds = 2.5) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    // Soft brown-ish noise (less hissy than white)
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export function createNightAudio(): NightAudioController {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let droneGain: GainNode | null = null;
  let windGain: GainNode | null = null;
  let pulseGain: GainNode | null = null;
  let fxGain: GainNode | null = null;
  let howlBus: GainNode | null = null;
  let muted = false;
  let started = false;
  let howlTimer = 0;
  let pulseTimer = 0;
  let stage = "portal";
  const keepAlive: Array<AudioNode & { stop?: () => void }> = [];
  let windSource: AudioBufferSourceNode | null = null;

  function applyMix() {
    if (!ctx || !droneGain || !windGain || !pulseGain || !master || !howlBus)
      return;
    const bed = bedFor(stage);
    const now = ctx.currentTime;
    const mute = muted ? 0 : 1;
    master.gain.setTargetAtTime(0.85 * mute, now, 0.12);
    droneGain.gain.setTargetAtTime(bed.drone, now, 0.35);
    windGain.gain.setTargetAtTime(bed.wind, now, 0.35);
    pulseGain.gain.setTargetAtTime(mute ? 0 : 1, now, 0.2);
    howlBus.gain.setTargetAtTime(0.55 * mute, now, 0.2);
  }

  function playHeartThump(at: number, level: number) {
    if (!ctx || !pulseGain) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 140;
    filter.Q.value = 0.7;
    osc.type = "sine";
    osc.frequency.setValueAtTime(46, at);
    osc.frequency.exponentialRampToValueAtTime(28, at + 0.18);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), at + 0.025);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    osc.connect(filter);
    filter.connect(g);
    g.connect(pulseGain);
    osc.start(at);
    osc.stop(at + 0.3);
  }

  function schedulePulse() {
    if (!ctx || !pulseGain || muted || !started) return;
    const { bpm, heartVol } = bedFor(stage);
    const interval = (60 / bpm) * 1000;
    pulseTimer = window.setTimeout(() => {
      if (!ctx || !pulseGain || muted) {
        schedulePulse();
        return;
      }
      const now = ctx.currentTime;
      playHeartThump(now, heartVol);
      playHeartThump(now + 0.16, heartVol * 0.55);
      schedulePulse();
    }, interval);
  }

  function playDistantHowl() {
    if (!ctx || !howlBus || muted) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(520, now);
    filter.frequency.linearRampToValueAtTime(780, now + 1.4);
    filter.frequency.linearRampToValueAtTime(440, now + 3.2);
    filter.Q.value = 2.2;

    osc.type = "sine";
    osc2.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 1.3);
    osc.frequency.exponentialRampToValueAtTime(210, now + 3.3);
    osc2.frequency.setValueAtTime(262, now);
    osc2.frequency.exponentialRampToValueAtTime(425, now + 1.3);
    osc2.frequency.exponentialRampToValueAtTime(212, now + 3.3);

    const g2 = ctx.createGain();
    g2.gain.value = 0.22;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(filter);
    osc2.connect(g2);
    g2.connect(filter);
    filter.connect(gain);
    gain.connect(howlBus);
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 3.6);
    osc2.stop(now + 3.6);
  }

  function scheduleHowl() {
    if (!ctx || !howlBus || muted || !started) return;
    // Sparse, distant — not every stage change
    const delay = 16000 + Math.random() * 18000;
    howlTimer = window.setTimeout(() => {
      playDistantHowl();
      scheduleHowl();
    }, delay);
  }

  async function start() {
    if (started) {
      if (ctx?.state === "suspended") await ctx.resume();
      applyMix();
      return;
    }
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AudioCtx();

    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.85;
    // Soft limiter-ish: compress peaks via low master + quiet sources
    master.connect(ctx.destination);

    droneGain = ctx.createGain();
    droneGain.connect(master);
    windGain = ctx.createGain();
    windGain.connect(master);
    pulseGain = ctx.createGain();
    pulseGain.connect(master);
    howlBus = ctx.createGain();
    howlBus.gain.value = 0.55;
    howlBus.connect(master);
    fxGain = ctx.createGain();
    fxGain.gain.value = 0.35;
    fxGain.connect(master);

    // Warm minor pad — fewer partials, quieter
    const freqs = [55, 82.5, 110, 164.8];
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const g = ctx.createGain();
      filter.type = "lowpass";
      filter.frequency.value = 420;
      osc.type = "sine";
      osc.frequency.value = f;
      g.gain.value = f < 90 ? 1 : 0.45;
      osc.connect(filter);
      filter.connect(g);
      g.connect(droneGain!);
      osc.start();
      keepAlive.push(osc);
    }

    // Soft wind
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = 520;
    const windLfo = ctx.createOscillator();
    const windLfoGain = ctx.createGain();
    windLfo.frequency.value = 0.05;
    windLfoGain.gain.value = 160;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    noise.connect(windFilter);
    windFilter.connect(windGain!);
    noise.start();
    windLfo.start();
    keepAlive.push(windLfo);
    windSource = noise;

    started = true;
    if (ctx.state === "suspended") await ctx.resume();
    applyMix();
    schedulePulse();
    // First howl later, not right away
    howlTimer = window.setTimeout(() => {
      if (started && !muted) playDistantHowl();
      scheduleHowl();
    }, 9000);
  }

  function stop() {
    window.clearTimeout(howlTimer);
    window.clearTimeout(pulseTimer);
    try {
      windSource?.stop();
    } catch {
      /* noop */
    }
    for (const node of keepAlive) {
      try {
        node.stop?.();
      } catch {
        /* noop */
      }
    }
    keepAlive.length = 0;
    void ctx?.close();
    ctx = null;
    master = null;
    started = false;
  }

  function tone(kind: "tap" | "ok" | "bad" | "reveal" | "seal") {
    if (!ctx || !fxGain || muted || !started) return;
    const now = ctx.currentTime;

    const bell = (freq: number, dur: number, level: number) => {
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      const f = ctx!.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 1800;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(level, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(f);
      f.connect(g);
      g.connect(fxGain!);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    };

    if (kind === "tap") bell(520, 0.12, 0.03);
    else if (kind === "ok") {
      bell(392, 0.22, 0.04);
      window.setTimeout(() => {
        if (!ctx || muted) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 523;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.035, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        osc.connect(g);
        g.connect(fxGain!);
        osc.start(t);
        osc.stop(t + 0.3);
      }, 70);
    } else if (kind === "bad") bell(180, 0.2, 0.028);
    else if (kind === "reveal") {
      bell(330, 0.5, 0.04);
      bell(495, 0.65, 0.03);
    } else bell(196, 0.45, 0.045);
  }

  return {
    start,
    stop,
    setStage(s) {
      stage = s;
      applyMix();
      window.clearTimeout(pulseTimer);
      if (started && !muted) schedulePulse();
      // Occasional distant howl only on whisper (peak tension), not every chapter
      if (s === "whisper" && started && !muted) {
        window.setTimeout(() => playDistantHowl(), 1400);
      }
    },
    setMuted(m) {
      muted = m;
      applyMix();
      window.clearTimeout(howlTimer);
      window.clearTimeout(pulseTimer);
      if (!muted && started) {
        schedulePulse();
        scheduleHowl();
      }
    },
    isMuted: () => muted,
    unlocked: () => started,
    tone,
  };
}
