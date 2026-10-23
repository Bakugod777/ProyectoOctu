"use client";

import { useRef, useState } from "react";
import { ChapterFrame, type Tone } from "./chapter-frame";
import { Burst } from "./burst";

type Props = {
  title: string;
  lead: string;
  clues: [string, string, string];
  fragment: string;
  onComplete: () => void;
  onUnlock?: () => void;
  onTone?: (kind: Tone) => void;
};

/** Prueba 1 · Tres faroles apagados en la puerta: prendelos en orden 1 → 2 → 3. */
export function ChapterLanterns(props: Props) {
  const [round, setRound] = useState(0);
  return <Notes key={round} {...props} onRetry={() => setRound((r) => r + 1)} />;
}

const TILTS = ["-4deg", "3deg", "-2deg"];

function Lantern({ lit, next, n }: { lit: boolean; next: boolean; n: number }) {
  return (
    <svg viewBox="0 0 80 120" className="h-[118px] w-auto sm:h-[150px]" aria-hidden>
      <defs>
        <radialGradient id={`lg${n}`}>
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.5" stopColor="#f2a65a" />
          <stop offset="1" stopColor="#e8743b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {lit && <circle cx="40" cy="66" r="40" fill={`url(#lg${n})`} opacity="0.55" />}
      <path d="M40 2 v12" stroke="#2b1d14" strokeWidth="3" />
      <path d="M24 14 h32 l-6 10 h-20 Z" fill="#2b1d14" />
      <path d="M22 24 h36 l6 70 h-48 Z" fill={lit ? "#ffd59a" : "#232858"} stroke={next ? "#f2a65a" : "#2b1d14"} strokeWidth={next ? 3 : 2} />
      <path d="M40 24 v70 M22 59 h42" stroke="#2b1d14" strokeWidth="2" opacity="0.6" />
      {lit && <path d="M40 46 Q50 60 40 74 Q30 60 40 46 Z" fill="#e8743b" />}
      <path d="M14 94 h52 l-4 10 h-44 Z" fill="#2b1d14" />
      <circle cx="40" cy="112" r="8" fill="#d9577a" stroke={next ? "#f2b544" : "none"} strokeWidth="1.5" />
      <text x="40" y="115.8" textAnchor="middle" fontSize="11" fontWeight="800" fill="#f4ecdc">{n}</text>
    </svg>
  );
}

function Notes({
  title,
  lead,
  clues,
  fragment,
  onComplete,
  onUnlock,
  onTone,
  onRetry,
}: Props & { onRetry: () => void }) {
  // Las notas aparecen desordenadas en pantalla: hay que buscar el número.
  const [layout] = useState(() => {
    const orders = [
      [1, 2, 0],
      [2, 0, 1],
      [1, 0, 2],
    ];
    return orders[Math.floor(Math.random() * orders.length)];
  });
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [hint, setHint] = useState(lead);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  function finish(skip = false) {
    if (finished.current) return;
    finished.current = true;
    onUnlock?.();
    window.setTimeout(onComplete, skip ? 0 : 1500);
  }

  function press(index: number) {
    if (done || index < step) return;
    if (index !== step) {
      onTone?.("bad");
      setWrong(index);
      setHint(`Ese es el ${index + 1}. Busca primero el ${step + 1}.`);
      window.setTimeout(() => setWrong(null), 450);
      return;
    }
    onTone?.("ok");
    const next = step + 1;
    setStep(next);
    setHint(`“${clues[index]}”`);
    if (next >= 3) {
      setDone(true);
      onTone?.("reveal");
      setHint(`¡Los tres prendidos! Desbloqueaste: ${fragment}`);
      finish();
    }
  }

  return (
    <ChapterFrame
      index={1}
      title={title}
      hint={hint}
      status={`${step}/3 faroles`}
      done={done}
      onRetry={step > 0 ? onRetry : undefined}
      onSkip={() => {
        setDone(true);
        finish(true);
      }}
    >
      <div className="relative grid grid-cols-3 gap-3 py-2 sm:gap-6">
        {layout.map((index, pos) => {
          const lit = index < step;
          const next = !done && index === step;
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => press(index)}
                aria-label={lit ? `Farol ${index + 1}, prendido` : `Farol ${index + 1}`}
                className={[
                  "tap relative flex w-full flex-col items-center rounded-2xl pt-2 pb-1",
                  wrong === index ? "animate-shake" : "bob",
                ].join(" ")}
                style={{ "--tilt": TILTS[pos], animationDelay: `${pos * -1.3}s` } as React.CSSProperties}
              >
                <Lantern lit={lit} next={next} n={index + 1} />
              </button>
              <p
                className={[
                  "min-h-[4.5rem] w-full rounded-xl px-2 py-2 text-center text-[13px] leading-snug transition-all duration-500 sm:text-[14px]",
                  lit ? "paper pop text-[#3a2a1c]" : "text-white/45",
                ].join(" ")}
              >
                {lit ? clues[index] : next ? "tócame" : "apagado"}
              </p>
            </div>
          );
        })}
        {done && <Burst />}
      </div>
    </ChapterFrame>
  );
}
