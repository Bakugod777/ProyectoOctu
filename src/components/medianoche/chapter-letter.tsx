"use client";

import { useEffect, useRef, useState } from "react";
import { Epilogue } from "@/components/medianoche/epilogue";
import type { StoryBeat } from "@/lib/confession-config";
import type { Tone } from "./chapter-frame";
import { Burst } from "./burst";

type Props = {
  to: string;
  from: string;
  dateLabel: string;
  story: StoryBeat[];
  letter: string[];
  closing: string;
  sealWord: string;
  muted?: boolean;
  onTone?: (kind: Tone) => void;
  onReplay?: () => void;
};

const DRAG_PX = 90;
const STEP = 0.9; // segundos entre párrafos
type Phase = "sealed" | "opening" | "open";

/** La carta: sobre con lacre (arrastrar el sello para romperlo) → papel que sube → texto que aparece. */
export function ChapterLetter({
  to,
  from,
  dateLabel,
  story,
  letter,
  closing,
  sealWord,
  muted,
  onTone,
  onReplay,
}: Props) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [progress, setProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const letterRef = useRef<HTMLElement>(null);
  const initial = (from.trim()[0] ?? "♥").toUpperCase();

  function open() {
    setProgress(1);
    setOffset({ x: 0, y: 0 });
    setPhase("opening");
    onTone?.("seal");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        setPhase("open");
        onTone?.("reveal");
        // Sin auto-scroll: el título "Para …" queda visible arriba y la carta justo debajo.
      },
      reduce ? 0 : 1500,
    );
  }

  // Cuando terminó de aparecer todo, se oculta "Mostrar todo".
  useEffect(() => {
    if (phase !== "open" || showAll) return;
    const t = window.setTimeout(() => setShowAll(true), (1.4 + letter.length * STEP) * 1000);
    return () => window.clearTimeout(t);
  }, [phase, showAll, letter.length]);

  function dragStart(e: React.PointerEvent<HTMLButtonElement>) {
    if (phase !== "sealed") return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    onTone?.("tap");
  }

  function dragMove(e: React.PointerEvent) {
    if (phase !== "sealed" || !start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    const p = Math.min(1, Math.hypot(dx, dy) / DRAG_PX);
    setOffset({ x: dx * 0.6, y: dy * 0.6 });
    setProgress(p);
    if (p >= 1) {
      start.current = null;
      open();
    }
  }

  function dragEnd() {
    if (phase !== "sealed") return;
    start.current = null;
    setOffset({ x: 0, y: 0 });
    setProgress(0);
  }

  function reseal() {
    setPhase("sealed");
    setProgress(0);
    setOffset({ x: 0, y: 0 });
    setShowAll(false);
    window.scrollTo({ top: 0 });
  }


  return (
    <section className="chapter-in relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-16 pt-[max(5.75rem,calc(var(--safe-top)+5rem))] sm:px-6">
      <span className="eyebrow">
        <span aria-hidden>✉</span> {dateLabel}
      </span>
      <h2 className="mt-3 font-display text-[clamp(2rem,7vw,2.9rem)] font-semibold leading-tight text-[var(--moon)]">
        Para {to}
      </h2>

      {phase !== "open" && (
        <>
          <p className="mt-3 text-[15px] leading-7 text-[var(--mist)]" aria-live="polite">
            {phase === "sealed"
              ? progress > 0
                ? "Sigue… ya casi se rompe el lacre."
                : `Arrastra el sello de lacre para romperlo y ${sealWord}.`
              : "Abriendo…"}
          </p>
          <div className="relative mt-10 mb-6">
            <div className={["envelope", phase !== "sealed" ? "is-open" : ""].join(" ")}>
              <div className="env-back" />
              <div className="env-letter paper p-4">
                <p className="font-display text-[15px] text-[#3a2a1c]">{to},</p>
                <div className="mt-2 space-y-1.5">
                  <span className="block h-1.5 w-11/12 rounded bg-[#3a2a1c]/15" />
                  <span className="block h-1.5 w-10/12 rounded bg-[#3a2a1c]/15" />
                  <span className="block h-1.5 w-9/12 rounded bg-[#3a2a1c]/15" />
                </div>
              </div>
              <div className="env-front" />
              <div className="env-flap" />
              <button
                type="button"
                className="seal tap"
                style={
                  {
                    "--p": progress,
                    translate: `${offset.x}px ${offset.y}px`,
                    rotate: `${progress * 18}deg`,
                  } as React.CSSProperties
                }
                onPointerDown={dragStart}
                onPointerMove={dragMove}
                onPointerUp={dragEnd}
                onPointerCancel={dragEnd}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (phase === "sealed") open();
                  }
                }}
                aria-label={`Sello de lacre. Arrástralo o presiona Enter para ${sealWord} la carta`}
              >
                <span className="seal-ring" />
                <span className={["seal-wax", phase === "sealed" && progress === 0 ? "glow-pulse" : ""].join(" ")} />
                <span className="seal-mark">{initial}</span>
              </button>
            </div>
            {phase === "opening" && <Burst count={24} />}
          </div>
          {phase === "sealed" && (
            <button type="button" className="btn-quiet mx-auto" onClick={open}>
              ¿No puedes arrastrar? Toca aquí
            </button>
          )}
        </>
      )}

      {phase === "open" && (
        <>
          <article
            ref={letterRef}
            className="paper chapter-in relative mt-8 scroll-mt-24 rounded-[6px] px-5 pb-10 pt-8 sm:px-10 sm:pt-10"
          >
            <span
              aria-hidden
              className="absolute right-4 top-4 text-[12px] italic text-[#6b5440]"
            >
              {dateLabel}
            </span>
            <p className="reveal-line font-display text-[clamp(1.5rem,5.5vw,1.9rem)] font-semibold text-[#2b1d14]">
              {to},
            </p>
            {letter.map((paragraph, i) => (
              <p
                key={i}
                className="reveal-line mt-5 text-[16px] leading-[1.8] text-[#3a2a1c] sm:text-[17px]"
                style={{ "--d": showAll ? "0s" : `${0.4 + i * STEP}s` } as React.CSSProperties}
              >
                {paragraph}
              </p>
            ))}
            <div
              className="reveal-line mt-8 flex items-end justify-between gap-4"
              style={{ "--d": showAll ? "0s" : `${0.4 + letter.length * STEP}s` } as React.CSSProperties}
            >
              <div>
                <p className="text-[15px] italic leading-7 text-[#3a2a1c]">{closing}</p>
                <p className="mt-3 font-display text-[clamp(1.6rem,6vw,2.1rem)] font-semibold italic text-[#7a1622]">
                  {from}
                </p>
              </div>
              <span
                aria-hidden
                className="grid size-14 shrink-0 rotate-[-8deg] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--wax-hi),var(--wax)_60%,#5e0f1a)] font-display text-xl font-bold text-[#ffd9d0] shadow-[0_4px_10px_rgba(60,5,12,0.5)]"
              >
                {initial}
              </span>
            </div>
            {!showAll && (
              <button
                type="button"
                className="btn-quiet absolute bottom-1 right-2 text-[#6b5440]"
                onClick={() => setShowAll(true)}
              >
                Mostrar todo
              </button>
            )}
          </article>

          <div className="panel mt-8 px-5 py-5">
            <p className="eyebrow">Lo que fuiste desbloqueando</p>
            <ol className="mt-3 space-y-2">
              {story.map((beat, i) => (
                <li key={i} className="text-[14px] leading-6 text-[var(--mist)]">
                  <span className="font-semibold text-[var(--moon)]">
                    <span className="text-[var(--ember)]">{i + 1}.</span> {beat.title}
                  </span>
                  {" — "}
                  {beat.body}
                </li>
              ))}
            </ol>
          </div>

          <Epilogue to={to} from={from} muted={muted} />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" className="btn btn-ghost" onClick={reseal}>
              ✉ Volver a abrir
            </button>
            {onReplay && (
              <button type="button" className="btn btn-ember" onClick={onReplay}>
                ↺ Jugar otra vez
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
