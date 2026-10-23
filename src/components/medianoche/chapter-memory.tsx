"use client";

import { useMemo, useRef, useState } from "react";
import type { MemoryPair } from "@/lib/confession-config";
import { ChapterFrame, type Tone } from "./chapter-frame";
import { Burst } from "./burst";

type Props = {
  title: string;
  lead: string;
  pairs: MemoryPair[];
  beatTitle: string;
  onComplete: () => void;
  onUnlock?: () => void;
  onTone?: (kind: Tone) => void;
};

type Card = { key: string; pairId: string; text: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BACKS = ["☾", "✦", "🕯", "✧", "☾", "✦", "🕯", "✧"];

/** Prueba 3 · El pasillo: memoria con cartas que giran; cada pareja suelta un mensajito. */
export function ChapterMemory(props: Props) {
  const [round, setRound] = useState(0);
  return <Memory key={round} {...props} onRetry={() => setRound((r) => r + 1)} />;
}

function Memory({
  title,
  lead,
  pairs,
  beatTitle,
  onComplete,
  onUnlock,
  onTone,
  onRetry,
}: Props & { onRetry: () => void }) {
  const cards = useMemo(
    () =>
      shuffle(
        pairs.flatMap((p) => [
          { key: `${p.id}-a`, pairId: p.id, text: p.a },
          { key: `${p.id}-b`, pairId: p.id, text: p.b },
        ]),
      ),
    [pairs],
  );
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [miss, setMiss] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState(lead);
  const [done, setDone] = useState(false);
  const finished = useRef(false);
  const lock = flipped.length >= 2;

  function finish(skip = false) {
    if (finished.current) return;
    finished.current = true;
    onUnlock?.();
    window.setTimeout(onComplete, skip ? 0 : 1600);
  }

  function pick(card: Card) {
    if (done || lock || matched.includes(card.pairId) || flipped.includes(card.key)) return;
    onTone?.("tap");
    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [c1, c2] = next.map((k) => cards.find((c) => c.key === k)!);
    if (c1.pairId === c2.pairId) {
      window.setTimeout(() => {
        onTone?.("ok");
        const nm = [...matched, c1.pairId];
        setMatched(nm);
        setFlipped([]);
        setHint(`¡Pareja! Cayó un mensajito: ${pairs.find((p) => p.id === c1.pairId)?.note ?? ""}`);
        if (nm.length >= pairs.length) {
          setDone(true);
          onTone?.("reveal");
          setHint(`¡Todas! Desbloqueaste: ${beatTitle}`);
          finish();
        }
      }, 350);
    } else {
      window.setTimeout(() => {
        onTone?.("bad");
        setMiss(next);
        setHint("Esas no van juntas… acuérdate de dónde estaban.");
      }, 450);
      window.setTimeout(() => {
        setMiss([]);
        setFlipped([]);
      }, 1100);
    }
  }

  return (
    <ChapterFrame
      index={3}
      title={title}
      hint={hint}
      status={`${matched.length}/${pairs.length} parejas · ${moves} jugadas`}
      done={done}
      onRetry={moves > 0 ? onRetry : undefined}
      onSkip={() => {
        setDone(true);
        finish(true);
      }}
    >
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {cards.map((card, i) => {
          const isMatched = matched.includes(card.pairId);
          const up = isMatched || flipped.includes(card.key);
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => pick(card)}
              disabled={done || isMatched}
              aria-label={up ? card.text : `Carta ${i + 1}, boca abajo`}
              className={["tap flip h-[104px] sm:h-[132px]", up ? "is-up" : "", miss.includes(card.key) ? "animate-shake" : ""].join(" ")}
            >
              <span className="flip-inner block">
                <span className="flip-face grid place-items-center border border-white/15 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0_6px,transparent_6px_12px),linear-gradient(160deg,#2a2f6e,#141838)] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.9)]">
                  <span className="grid size-12 place-items-center rounded-full border border-[var(--ember)]/40 text-xl text-[var(--ember)]">
                    {BACKS[i % BACKS.length]}
                  </span>
                </span>
                <span
                  className={[
                    "flip-face flip-front grid place-items-center px-3 text-center text-[15px] font-semibold leading-snug",
                    isMatched
                      ? "paper ring-2 ring-[var(--ember)]"
                      : "paper",
                  ].join(" ")}
                >
                  {card.text}
                </span>
              </span>
            </button>
          );
        })}
        {done && <Burst />}
      </div>
      {matched.length > 0 && (
        <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Mensajitos encontrados">
          {pairs
            .filter((p) => matched.includes(p.id))
            .map((p, k) => (
              <li
                key={p.id}
                className="paper pop rounded-md px-3 py-2 text-[14px] font-medium italic text-[#3a2a1c]"
                style={{ rotate: `${k % 2 ? 2 : -2}deg` }}
              >
                ✉ {p.note}
              </li>
            ))}
        </ul>
      )}
    </ChapterFrame>
  );
}
