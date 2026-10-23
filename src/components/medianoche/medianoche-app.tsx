"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  cleanName,
  resolveConfession,
  type ConfessionConfig,
  type Line,
  type SceneId,
} from "@/lib/confession-config";
import { createNightAudio, type NightAudioController } from "@/lib/night-audio";
import { play as benchoPlay } from "@/lib/bencho/sounds";
import { NightSky } from "./night-sky";
import { EmberField } from "./ember-field";
import { SceneBackdrop } from "./scene-backdrop";
import { Dialogue } from "./dialogue";
import { Owl } from "./owl";
import { Petals } from "./petals";
import { ChapterLanterns } from "./chapter-lanterns";
import { ChapterStars } from "./chapter-stars";
import { ChapterMemory } from "./chapter-memory";
import { ChapterTimeline } from "./chapter-timeline";
import { ChapterWhisper } from "./chapter-whisper";
import { ChapterLetter } from "./chapter-letter";
import { SoundToggle } from "./sound-toggle";
import { StageRail } from "./stage-rail";
import { NameScreen } from "./name-screen";
import type { Tone } from "./chapter-frame";

type Game = "lanterns" | "stars" | "memory" | "timeline" | "whisper";
type Step =
  | { kind: "title"; scene: SceneId }
  | { kind: "talk"; scene: SceneId; lines: Line[]; rail: number; petals?: boolean }
  | { kind: "game"; scene: SceneId; game: Game; rail: number }
  | { kind: "letter"; scene: SceneId; rail: number };

const SAVE_KEY = "medianoche-v2-progreso";

function buildSteps(c: ConfessionConfig): Step[] {
  const s = c.script;
  const chapter = (scene: SceneId, game: Game, rail: number, intro: Line[], win: Line[]): Step[] => [
    { kind: "talk", scene, lines: intro, rail },
    { kind: "game", scene, game, rail },
    { kind: "talk", scene, lines: win, rail },
  ];
  return [
    { kind: "title", scene: "cuarto" },
    { kind: "talk", scene: "cuarto", lines: s.intro, rail: 0 },
    ...chapter("puerta", "lanterns", 0, s.lanternsIntro, s.lanternsWin),
    ...chapter("ventana", "stars", 1, s.starsIntro, s.starsWin),
    ...chapter("pasillo", "memory", 2, s.memoryIntro, s.memoryWin),
    ...chapter("escalera", "timeline", 3, s.timelineIntro, s.timelineWin),
    ...chapter("guardian", "whisper", 4, s.whisperIntro, s.whisperWin),
    { kind: "talk", scene: "abierta", lines: s.finale, rail: 5, petals: true },
    { kind: "letter", scene: "abierta", rail: 5 },
  ];
}

export function MedianocheApp() {
  const [config, setConfig] = useState(() => resolveConfession(null));
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(0);
  const [muted, setMuted] = useState(false);
  const [name, setName] = useState("");
  const [askName, setAskName] = useState(false);
  const [prefill, setPrefill] = useState("");
  const audioRef = useRef<NightAudioController | null>(null);
  const steps = useMemo(() => buildSteps(config), [config]);
  const cur = steps[step];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    type Save = { step?: number; to?: string; name?: string };
    let p = null as Save | null;
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      p = raw ? (JSON.parse(raw) as Save) : null;
    } catch {
      /* ignore */
    }
    const savedName = cleanName(typeof p?.name === "string" ? p.name : "");
    // Lee ?para=&de=, el nombre y el progreso guardado una sola vez al montar (no existen en SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefill(cleanName(params.get("para")));
    if (savedName) {
      const c = resolveConfession(params, savedName);
      setName(savedName);
      setConfig(c);
      if (p && p.to === c.to && typeof p.step === "number" && p.step > 0) setSaved(p.step);
    } else {
      setAskName(true);
    }
    audioRef.current = createNightAudio();
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, []);

  // Guarda el progreso (para retomar).
  useEffect(() => {
    if (step === 0) return;
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify({ step, to: config.to, name }));
    } catch {
      /* ignore */
    }
  }, [step, config.to, name]);

  function chooseName(raw: string) {
    const n = cleanName(raw);
    if (!n) return;
    const c = resolveConfession(new URLSearchParams(window.location.search), n);
    setName(n);
    setConfig(c);
    setSaved(0);
    setAskName(false);
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify({ step: 0, to: c.to, name: n }));
    } catch {
      /* ignore */
    }
    audioRef.current?.tone("ok");
    window.scrollTo({ top: 0 });
  }

  // Ambiente sonoro según el capítulo.
  useEffect(() => {
    const next = steps.slice(step).find((s) => s.kind === "game" || s.kind === "letter");
    audioRef.current?.setStage(
      step === 0 ? "portal" : next?.kind === "game" ? next.game : "letter",
    );
  }, [step, steps]);

  const gamesDone = steps.slice(0, step).filter((s) => s.kind === "game").length;

  async function begin(from: number) {
    await audioRef.current?.start();
    audioRef.current?.setMuted(muted);
    if (!muted) {
      try {
        benchoPlay("landed", { volume: 0.7 });
      } catch {
        /* ignore */
      }
    }
    setStep(from);
    window.scrollTo({ top: 0 });
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0 });
  }

  function restart() {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
    setSaved(0);
    setStep(0);
    window.scrollTo({ top: 0 });
  }

  function toggleMute() {
    const m = !muted;
    setMuted(m);
    audioRef.current?.setMuted(m);
    if (!m) void audioRef.current?.start();
  }

  const tone = (kind: Tone) => {
    audioRef.current?.tone(kind);
    if (muted) return;
    try {
      if (kind === "ok") benchoPlay("tick", { volume: 0.45 });
      else if (kind === "bad") benchoPlay("bump", { volume: 0.4 });
      else if (kind === "reveal") benchoPlay("paid", { volume: 0.55 });
      else if (kind === "seal") benchoPlay("landed", { volume: 0.65 });
      else benchoPlay("wisp", { volume: 0.3 });
    } catch {
      /* ignore */
    }
  };

  const beats = config.storyBeats;
  const names = { buho: config.captorName, ella: config.to };

  return (
    <>
      <NightSky reveal={Math.min(1, gamesDone / 5 + (step > 0 ? 0.1 : 0))} />
      <SceneBackdrop scene={cur.scene} dim={cur.kind !== "talk" && cur.kind !== "title"} />
      <EmberField />
      {(cur.kind === "letter" || (cur.kind === "talk" && cur.petals)) && <Petals />}
      <SoundToggle muted={muted} onToggle={toggleMute} />
      {cur.kind !== "title" && <StageRail active={cur.rail} done={gamesDone} inline={cur.kind === "letter"} />}

      <main className="relative z-10 min-h-dvh text-[var(--moon)]" key={askName ? "name" : step}>
        {askName && cur.kind === "title" && (
          <NameScreen initial={name || prefill} dateLabel={config.dateLabel} brand={config.brand} onSubmit={chooseName} />
        )}
        {!askName && name && cur.kind === "title" && (
          <section className="chapter-in relative flex min-h-dvh flex-col items-center justify-end px-4 pb-[max(2rem,calc(var(--safe-bottom)+1rem))] pt-[max(4rem,calc(var(--safe-top)+3rem))] text-center sm:px-8 short:min-h-dvh short:flex-row short:items-end short:justify-center short:gap-3 short:overflow-y-auto short:pb-[max(0.75rem,var(--safe-bottom))] short:pt-[max(3.5rem,calc(var(--safe-top)+3rem))]">
            <div className="w-[min(52vw,220px,30svh)] shrink-0 sm:w-[min(240px,30svh)] short:mb-0 short:w-[min(22vw,42svh)]">
              <Owl pose="feliz" />
            </div>
            <div className="panel mt-[-10px] w-full max-w-xl px-5 py-7 sm:px-8 short:mt-0 short:min-w-0 short:flex-1 short:px-4 short:py-4">
              <p className="eyebrow justify-center">
                {config.dateLabel} · {config.brand}
              </p>
              <p className="mt-3 font-display text-[clamp(2.4rem,11vw,4.4rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-[var(--moon)] short:mt-1 short:text-[clamp(1.5rem,6vw,2rem)]">
                Hola, {config.to}.
              </p>
              <h1 className="mx-auto mt-4 max-w-md font-display text-[clamp(1.2rem,4.4vw,1.6rem)] leading-snug text-[#f0e2c8] short:mt-2 short:text-[1.05rem]">
                {config.headline}
              </h1>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-[var(--mist)] short:mt-1 short:line-clamp-2 short:text-[13px] short:leading-5">{config.invite}</p>
              <p className="mt-2 text-[13px] text-white/45 short:hidden">{config.howItWorks}</p>
              <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center short:mt-3">
                {saved > 0 ? (
                  <>
                    <button type="button" className="btn btn-ember w-full sm:w-auto" onClick={() => void begin(saved)}>
                      Continuar donde quedaste
                    </button>
                    <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={() => { restart(); void begin(1); }}>
                      Empezar de nuevo
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-ember w-full sm:w-auto" onClick={() => void begin(1)}>
                    Entrar a la casona 🕯
                  </button>
                )}
              </div>
              <p className="mt-4 text-[12px] text-white/40 short:mt-2 short:hidden">Tiene sonido suave · lo puedes apagar arriba a la derecha.</p>
              <button type="button" className="btn-quiet mt-1 short:mt-0.5" onClick={() => setAskName(true)}>
                ¿No eres {config.to}? Cambiar nombre
              </button>
            </div>
          </section>
        )}

        {cur.kind === "talk" && (
          <Dialogue lines={cur.lines} names={names} onDone={next} onTone={tone} />
        )}

        {cur.kind === "game" && cur.game === "lanterns" && (
          <ChapterLanterns
            title={config.lanternTitle}
            lead={config.lanternLead}
            clues={config.lanternClues}
            fragment={beats[0].title}
            onTone={tone}
            onComplete={next}
          />
        )}
        {cur.kind === "game" && cur.game === "stars" && (
          <ChapterStars
            title={config.starTitle}
            prompt={config.starPrompt}
            fragment={beats[1].body}
            initial={config.to}
            onTone={tone}
            onComplete={next}
          />
        )}
        {cur.kind === "game" && cur.game === "memory" && (
          <ChapterMemory
            title={config.memoryTitle}
            lead={config.memoryLead}
            pairs={config.memoryPairs}
            beatTitle={beats[2].title}
            onTone={tone}
            onComplete={next}
          />
        )}
        {cur.kind === "game" && cur.game === "timeline" && (
          <ChapterTimeline
            title={config.timelineTitle}
            lead={config.timelineLead}
            items={config.timelineItems}
            order={config.timelineOrder}
            beatTitle={beats[3].title}
            onTone={tone}
            onComplete={next}
          />
        )}
        {cur.kind === "game" && cur.game === "whisper" && (
          <ChapterWhisper
            title={config.whisperTitle}
            prompt={config.whisperPrompt}
            options={config.whisperOptions}
            answer={config.whisperAnswer}
            fragment={beats[4].title}
            onTone={tone}
            onUnlock={() => undefined}
            onComplete={next}
          />
        )}
        {cur.kind === "letter" && (
          <ChapterLetter
            to={config.to}
            from={config.from}
            dateLabel={config.dateLabel}
            story={beats}
            letter={config.letter}
            closing={config.closing}
            sealWord={config.sealWord}
            muted={muted}
            onTone={tone}
            onReplay={restart}
          />
        )}
      </main>
    </>
  );
}
