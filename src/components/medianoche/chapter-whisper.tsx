"use client";

import { useRef, useState } from "react";
import { ChapterFrame, type Tone } from "./chapter-frame";
import { Burst } from "./burst";

type Props = {
  title: string;
  prompt: string;
  options: string[];
  answer: string;
  fragment: string;
  onUnlock: () => void;
  onComplete: () => void;
  onTone?: (kind: Tone) => void;
};

const TEASES = [
  "Nada que ver. La tabla dice que no. Se fue como fantasma 👻",
  "Mentira detectada. Prueba con otra.",
  "Esa ni yo me la creo.",
];

/** Prueba 5 · La tabla (ouija): las respuestas falsas se desvanecen; queda la verdad. */
export function ChapterWhisper(props: Props) {
  const [round, setRound] = useState(0);
  return <Whisper key={round} {...props} onRetry={() => setRound((r) => r + 1)} />;
}

function Whisper({
  title,
  prompt,
  options,
  answer,
  fragment,
  onUnlock,
  onComplete,
  onTone,
  onRetry,
}: Props & { onRetry: () => void }) {
  const [shuffled] = useState(() => [...options].sort(() => Math.random() - 0.5));
  const [gone, setGone] = useState<string[]>([]);
  const [vanished, setVanished] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState(`${prompt} Escoge la que más se parece a lo que siento.`);
  const advanced = useRef(false);

  function goNext() {
    if (advanced.current) return;
    advanced.current = true;
    onComplete();
  }

  function choose(option: string) {
    if (won || gone.includes(option)) return;
    if (option === answer) {
      setWon(true);
      onTone?.("reveal");
      onUnlock();
      setHint(`Esa. Desbloqueaste: ${fragment}`);
      return;
    }
    onTone?.("bad");
    setHint(TEASES[gone.length % TEASES.length]);
    setGone((g) => [...g, option]);
    window.setTimeout(() => setVanished((v) => [...v, option]), 900);
  }

  return (
    <ChapterFrame
      index={5}
      title={title}
      hint={hint}
      status={won ? "verdad ✦" : `${options.length - gone.length} opciones`}
      done={won}
      onRetry={gone.length > 0 ? onRetry : undefined}
      onSkip={() => {
        onUnlock();
        goNext();
      }}
    >
      <div className="panel relative flex flex-col gap-3 p-3 sm:p-5">
        <div aria-hidden className="flex items-center justify-between px-1 font-display text-[15px] font-semibold tracking-[0.3em] text-[var(--ember)]/80">
          <span>SÍ</span>
          <span className="tracking-normal text-white/40">☾ ✦ ☀</span>
          <span>NO</span>
        </div>
        {shuffled.map((option) => {
          const isGone = gone.includes(option);
          const isAnswer = option === answer;
          const nudge = !won && isAnswer && gone.length >= 2;
          if ((won && !isAnswer) || vanished.includes(option)) return null;
          return (
            <button
              key={option}
              type="button"
              disabled={isGone || won}
              onClick={() => choose(option)}
              className={[
                "tap min-h-14 rounded-2xl border px-5 py-4 text-left text-[16px] transition",
                isGone && "ghost-away border-white/10 bg-white/5 text-white/40",
                !isGone && !won && "border-white/18 bg-[linear-gradient(160deg,rgba(42,47,110,0.7),rgba(20,24,56,0.85))] text-[var(--moon)] hover:border-[var(--ember)]/70 active:scale-[0.98]",
                won && "paper pop py-6 text-center font-display text-[clamp(1.25rem,5vw,1.6rem)] font-semibold",
                nudge && "glow-pulse",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {won ? `“${option}”` : option}
            </button>
          );
        })}
        {won && <Burst count={28} />}
      </div>

      {won && (
        <div className="chapter-in mt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-[14px] text-[var(--mist)]">La tabla no miente.</p>
          <button type="button" className="btn btn-ember" onClick={goNext}>
            Seguir →
          </button>
        </div>
      )}
    </ChapterFrame>
  );
}
