"use client";

import type { ReactNode } from "react";

export type Tone = "tap" | "ok" | "bad" | "reveal" | "seal";

type Props = {
  index: number;
  title: string;
  hint: string;
  status?: ReactNode;
  done?: boolean;
  onRetry?: () => void;
  onSkip?: () => void;
  children: ReactNode;
};

/** Marco común de los 5 minijuegos: encabezado, pista viva, zona de juego y acciones. */
export function ChapterFrame({
  index,
  title,
  hint,
  status,
  done,
  onRetry,
  onSkip,
  children,
}: Props) {
  return (
    <section className="chapter-in relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 pb-[max(9rem,calc(var(--safe-bottom)+8rem))] pt-[max(4.75rem,calc(var(--safe-top)+4rem))] sm:px-6 short:max-w-3xl short:pb-16 short:pt-[max(4rem,calc(var(--safe-top)+3.5rem))]">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">
          <span aria-hidden>✦</span> Juego {index} de 5
        </span>
        {status && (
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[13px] font-medium text-[#f6e7c8]">
            {status}
          </span>
        )}
      </div>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,6.4vw,2.6rem)] short:text-[1.6rem] font-semibold leading-[1.08] tracking-[-0.01em] text-[var(--moon)]">
        {title}
      </h2>
      <p
        className="mt-3 min-h-[3.5rem] max-w-lg text-[15px] leading-7 text-[var(--mist)]"
        aria-live="polite"
      >
        {hint}
      </p>

      <div className="mt-4">{children}</div>

      {!done && (onRetry || onSkip) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          {onRetry ? (
            <button type="button" className="btn btn-ghost" onClick={onRetry}>
              ↺ Reintentar
            </button>
          ) : (
            <span />
          )}
          {onSkip && (
            <button type="button" className="btn-quiet" onClick={onSkip}>
              Saltar este juego
            </button>
          )}
        </div>
      )}
    </section>
  );
}
