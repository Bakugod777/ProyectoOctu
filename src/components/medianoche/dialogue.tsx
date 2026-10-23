"use client";

import { useEffect, useRef, useState } from "react";
import type { Line } from "@/lib/confession-config";
import { Owl } from "./owl";
import type { Tone } from "./chapter-frame";

type Props = {
  lines: Line[];
  names: { buho: string; ella: string };
  onDone: () => void;
  onTone?: (kind: Tone) => void;
};

const CPS = 38; // caracteres por segundo

/** Motor de novela visual: caja de papel, nombre, máquina de escribir, tocar para avanzar. */
export function Dialogue({ lines, names, onDone, onTone }: Props) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);
  const line = lines[i];
  const full = line?.text ?? "";
  const typing = shown < full.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = window.setTimeout(() => setShown(full.length), 0);
      return () => window.clearTimeout(t);
    }
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const n = Math.min(full.length, Math.floor(((performance.now() - t0) / 1000) * CPS));
      setShown(n);
      if (n >= full.length) window.clearInterval(id);
    }, 30);
    return () => window.clearInterval(id);
  }, [i, full]);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }

  function advance() {
    if (typing) {
      setShown(full.length);
      return;
    }
    onTone?.("tap");
    if (i + 1 >= lines.length) finish();
    else {
      setShown(0);
      setI(i + 1);
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!line) return null;
  const speaker = line.who === "buho" ? names.buho : line.who === "ella" ? names.ella : null;
  const lastOwlPose =
    line.who === "buho"
      ? line.pose
      : [...lines.slice(0, i)].reverse().find((l) => l.who === "buho")?.pose;
  const showOwl = lines.some((l) => l.who === "buho");

  return (
    <section
      className="relative z-10 flex min-h-dvh cursor-pointer flex-col justify-end px-3 pb-[max(1rem,var(--safe-bottom))] pt-24 sm:px-6"
      onClick={advance}
      aria-label="Diálogo. Toca para seguir."
    >
      {showOwl && (
        <div
          key={lastOwlPose ?? "n"}
          className={[
            "pop mx-auto mb-[-14px] w-[min(46vw,210px)] transition-opacity duration-300 sm:w-[230px]",
            line.who === "buho" ? "opacity-100" : "opacity-60",
          ].join(" ")}
        >
          <Owl pose={lastOwlPose ?? "normal"} />
        </div>
      )}

      <div className="paper relative mx-auto w-full max-w-2xl rounded-2xl px-5 pb-5 pt-7 sm:px-7">
        {speaker && (
          <span
            className={[
              "absolute -top-4 left-4 rounded-full px-4 py-1.5 text-[13px] font-bold tracking-wide shadow-md",
              line.who === "buho" ? "bg-[var(--wax)] text-[#ffe6dc]" : "bg-[#2a2f6e] text-[#f7efe2]",
            ].join(" ")}
          >
            {speaker}
          </span>
        )}
        <p
          className={[
            "min-h-[4.5rem] text-[17px] leading-[1.6] text-[#2b1d14] sm:text-[18px]",
            line.who === "narra" ? "italic text-[#5b4636]" : "",
          ].join(" ")}
          aria-live="polite"
        >
          {full.slice(0, shown)}
          {typing && <span className="caret">▍</span>}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            className="btn-quiet !text-[#6b5440]"
            onClick={(e) => {
              e.stopPropagation();
              finish();
            }}
          >
            Saltar diálogo
          </button>
          <span className="flex items-center gap-2 text-[13px] font-semibold text-[#7a1622]">
            {i + 1}/{lines.length}
            <span className={typing ? "opacity-30" : "glow-pulse rounded-full"} aria-hidden>
              ▶
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
