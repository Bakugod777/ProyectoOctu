"use client";

import { useMemo, useRef, useState } from "react";
import type { TimelineItem } from "@/lib/confession-config";
import { ChapterFrame, type Tone } from "./chapter-frame";
import { Burst } from "./burst";

type Props = {
  title: string;
  lead: string;
  items: TimelineItem[];
  order: string[];
  beatTitle: string;
  onComplete: () => void;
  onUnlock?: () => void;
  onTone?: (kind: Tone) => void;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Prueba 4 · Las fotos se cayeron: tócalas en orden; cada acierto prende una vela. */
export function ChapterTimeline(props: Props) {
  const [round, setRound] = useState(0);
  return <Timeline key={round} {...props} onRetry={() => setRound((r) => r + 1)} />;
}

function Candle({ lit }: { lit: boolean }) {
  return (
    <span className="relative flex h-12 w-6 shrink-0 flex-col items-center justify-end" aria-hidden>
      <span
        className={[
          "mb-0.5 h-4 w-2.5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] transition-all duration-500",
          lit
            ? "bg-[radial-gradient(circle_at_50%_70%,#fff3c4,#f2a65a_55%,#e8743b)] shadow-[0_0_16px_6px_rgba(242,166,90,0.6)]"
            : "scale-50 bg-white/15",
        ].join(" ")}
      />
      <span className="h-6 w-4 rounded-sm bg-[linear-gradient(180deg,#f7efe2,#d9cbb0)]" />
    </span>
  );
}

function Timeline({
  title,
  lead,
  items,
  order,
  beatTitle,
  onComplete,
  onUnlock,
  onTone,
  onRetry,
}: Props & { onRetry: () => void }) {
  const pool = useMemo(() => shuffle(items), [items]);
  const [picked, setPicked] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [hint, setHint] = useState(lead);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  function finish(skip = false) {
    if (finished.current) return;
    finished.current = true;
    onUnlock?.();
    window.setTimeout(onComplete, skip ? 0 : 1600);
  }

  function choose(id: string) {
    if (done || picked.includes(id)) return;
    const expected = order[picked.length];
    if (id !== expected) {
      onTone?.("bad");
      setWrong(id);
      setMisses((m) => m + 1);
      setHint(picked.length === 0 ? "Mmm, eso pasó después. ¿Qué fue lo primero?" : "Casi. Esa foto va más adelante.");
      window.setTimeout(() => setWrong(null), 450);
      return;
    }
    onTone?.("ok");
    const next = [...picked, id];
    setPicked(next);
    setHint(next.length < order.length ? "Bien. ¿Y después?" : `En orden. Completado: ${beatTitle}`);
    if (next.length >= order.length) {
      setDone(true);
      onTone?.("reveal");
      finish();
    }
  }

  const label = (id: string) => items.find((i) => i.id === id)?.label ?? "";

  return (
    <ChapterFrame
      index={4}
      title={title}
      hint={hint}
      status={`${picked.length}/${order.length} fotos${misses ? ` · ${misses} fallos` : ""}`}
      done={done}
      onRetry={picked.length > 0 ? onRetry : undefined}
      onSkip={() => {
        setDone(true);
        finish(true);
      }}
    >
      <ol className="relative panel space-y-1 p-3">
        {order.map((_, i) => {
          const id = picked[i];
          return (
            <li key={i} className="flex min-h-14 items-center gap-3 rounded-xl px-2">
              <Candle lit={Boolean(id)} />
              {id ? (
                <span className="pop text-[15px] font-medium text-[var(--moon)]">
                  <span className="mr-1.5 text-[var(--ember)]">{i + 1}.</span>
                  {label(id)}
                </span>
              ) : (
                <span className="text-[14px] text-white/30">
                  {i + 1}. {i === picked.length ? "¿qué pasó aquí?" : "…"}
                </span>
              )}
            </li>
          );
        })}
        {done && <Burst />}
      </ol>

      {!done && (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {pool.map((item) =>
            picked.includes(item.id) ? null : (
              <button
                key={item.id}
                type="button"
                onClick={() => choose(item.id)}
                style={{ rotate: `${(item.id.charCodeAt(item.id.length - 1) % 2 ? 1 : -1) * 2}deg` }}
                className={[
                  "tap flex min-h-14 items-center gap-3 rounded-md bg-[#f7f1e4] p-2 pr-4 text-left text-[15px] font-medium text-[#2b1d14] shadow-[0_12px_24px_-12px_rgba(0,0,0,0.9)] transition hover:-translate-y-0.5 active:scale-[0.98]",
                  wrong === item.id ? "animate-shake ring-2 ring-[var(--wax-hi)]" : "",
                ].join(" ")}
              >
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-sm bg-[linear-gradient(160deg,#2a2f6e,#e8743b)] text-lg text-[#fff3c4]">
                  ☾
                </span>
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </ChapterFrame>
  );
}
