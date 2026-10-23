"use client";

import { useMemo, useRef, useState } from "react";
import { ChapterFrame, type Tone } from "./chapter-frame";
import { Burst } from "./burst";
import { shapeFor } from "./letters";

type Props = {
  title: string;
  prompt: string;
  fragment: string;
  initial: string;
  onComplete: () => void;
  onUnlock?: () => void;
  onTone?: (kind: Tone) => void;
};

/** Prueba 2 · Une las estrellas (tocando o arrastrando). La constelación dibuja la inicial de ella. */
const DUST = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  s: 1 + (i % 3),
  d: (i % 7) * 0.6,
}));

const HIT = 9; // radio de acierto en % del tablero

export function ChapterStars(props: Props) {
  const [round, setRound] = useState(0);
  return <Stars key={round} {...props} onRetry={() => setRound((r) => r + 1)} />;
}

function Stars({
  title,
  prompt,
  fragment,
  initial,
  onComplete,
  onUnlock,
  onTone,
  onRetry,
}: Props & { onRetry: () => void }) {
  const { stars: STARS, strokes, closed, letter } = useMemo(() => shapeFor(initial), [initial]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(prompt);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const dragging = useRef(false);
  const finished = useRef(false);

  function finish(skip = false) {
    if (finished.current) return;
    finished.current = true;
    onUnlock?.();
    window.setTimeout(onComplete, skip ? 0 : 1800);
  }

  function light(i: number) {
    if (finished.current || i !== stepRef.current) return;
    const next = i + 1;
    stepRef.current = next;
    setStep(next);
    onTone?.("ok");
    if (next >= STARS.length) {
      dragging.current = false;
      setPointer(null);
      setDone(true);
      onTone?.("reveal");
      setHint(`Mira lo que dibujaste: ${letter === "♥" ? "un corazón" : `una ${letter}`}. ${fragment}`);
      finish();
    } else {
      setHint(next === 1 ? "¡Eso! Sigue con la siguiente que brilla." : `Van ${next} de ${STARS.length}.`);
    }
  }

  function tapStar(i: number) {
    if (finished.current) return;
    if (i < stepRef.current) return;
    if (i !== stepRef.current) {
      onTone?.("bad");
      setWrong(i);
      setHint("Esa todavía no. Sigue la que late.");
      window.setTimeout(() => setWrong(null), 450);
      return;
    }
    light(i);
  }

  function toBoard(e: React.PointerEvent) {
    const r = boardRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
  }

  function near(p: { x: number; y: number }, i: number) {
    const s = STARS[i];
    return s && Math.hypot(p.x - s.x, p.y - s.y) < HIT;
  }

  function onDown(e: React.PointerEvent) {
    if (finished.current) return;
    const p = toBoard(e);
    const cur = stepRef.current;
    // Se puede arrastrar desde la última estrella encendida o desde la que toca.
    if (near(p, cur) || (cur > 0 && near(p, cur - 1))) {
      dragging.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      if (near(p, cur)) light(cur);
      setPointer(p);
    }
  }

  function onMove(e: React.PointerEvent) {
    if (!dragging.current || finished.current) return;
    const p = toBoard(e);
    setPointer(p);
    if (near(p, stepRef.current)) light(stepRef.current);
  }

  function onUp() {
    dragging.current = false;
    setPointer(null);
  }

  const from = step > 0 ? STARS[step - 1] : null;

  return (
    <ChapterFrame
      index={2}
      title={title}
      hint={hint}
      status={`${step}/${STARS.length} ✦`}
      done={done}
      onRetry={step > 0 ? onRetry : undefined}
      onSkip={() => {
        setDone(true);
        finish(true);
      }}
    >
      <div
        ref={boardRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="panel relative mx-auto aspect-square w-full max-w-[min(420px,calc(100svh-7rem))] min-w-[min(100%,240px)] touch-none overflow-hidden select-none"
      >
        {DUST.map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="star-twinkle absolute rounded-full bg-white/70"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.s,
              height: d.s,
              animationDuration: `${2.4 + d.d}s`,
              animationDelay: `${d.d}s`,
            }}
          />
        ))}

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: strokes }).map((_, k) => {
            const lit = STARS.slice(0, step).filter((st) => st.stroke === k);
            if (lit.length < 2) return null;
            const all = STARS.filter((st) => st.stroke === k);
            const close = done && closed.includes(k) ? ` ${all[0].x},${all[0].y}` : "";
            return (
              <polyline
                key={k}
                points={lit.map((st) => `${st.x},${st.y}`).join(" ") + close}
                fill={done && closed.includes(k) ? "rgba(232,116,59,0.18)" : "none"}
                stroke="#f2a65a"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: 3 }}
              />
            );
          })}
          {from && pointer && !done && (
            <line
              x1={from.x}
              y1={from.y}
              x2={pointer.x}
              y2={pointer.y}
              stroke="rgba(247,239,226,0.6)"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: 2 }}
            />
          )}
          {from && !pointer && !done && STARS[step].stroke === from.stroke && (
            <line
              x1={from.x}
              y1={from.y}
              x2={STARS[step].x}
              y2={STARS[step].y}
              stroke="rgba(242,166,90,0.35)"
              strokeDasharray="1.5 2"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: 2 }}
            />
          )}
        </svg>

        {STARS.map((s, i) => {
          const lit = i < step;
          const next = i === step && !done;
          return (
            <button
              key={i}
              type="button"
              onClick={() => tapStar(i)}
              aria-label={lit ? `Estrella ${i + 1}, encendida` : next ? `Estrella ${i + 1}, tócala` : `Estrella ${i + 1}`}
              className={[
                "tap absolute z-10 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full",
                wrong === i ? "animate-shake" : "",
              ].join(" ")}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              {next && <span className="star-pulse absolute size-10 rounded-full bg-[var(--ember)]/25" />}
              <span
                className={[
                  "relative rounded-full transition-all duration-500",
                  lit || done
                    ? "size-4 bg-[#fff2d6] shadow-[0_0_18px_6px_rgba(242,166,90,0.7)]"
                    : next
                      ? "size-4 bg-[#fff2d6] shadow-[0_0_14px_5px_rgba(247,239,226,0.55)]"
                      : "size-2.5 bg-[#aab2cf]/70",
                ].join(" ")}
              />
              <span className={["absolute -bottom-1 text-[11px] font-semibold", next ? "text-[var(--ember)]" : "text-white/35"].join(" ")}>
                {i + 1}
              </span>
            </button>
          );
        })}
        {done && <Burst count={26} />}
      </div>
      <p className="mt-3 text-center text-[13px] text-white/45">
        Toca la estrella que late o arrastra el dedo de una a otra.
      </p>
    </ChapterFrame>
  );
}
