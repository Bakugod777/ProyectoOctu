"use client";

import { cn } from "@/lib/utils";

const STEPS = ["Faroles", "Estrellas", "Pasillo", "Fotos", "Verdad", "Carta"];

/** Riel de progreso: 5 pruebas + carta. `active` = índice actual (0–5). */
export function StageRail({ active, done, inline }: { active: number; done: number; inline?: boolean }) {
  return (
    <nav
      aria-label={`Progreso: prueba ${Math.min(active + 1, 6)} de 6`}
      className={cn(inline ? "absolute" : "fixed", "pointer-events-none left-[var(--safe-left)] right-[calc(3.75rem+var(--safe-right))] top-[max(0.75rem,var(--safe-top))] z-40 flex justify-center px-3 sm:right-0")}
    >
      <ol className="flex items-center gap-1 rounded-full border border-white/10 bg-[#070a18]/70 px-2 py-1.5 backdrop-blur-md">
        {STEPS.map((label, i) => {
          const isDone = i < done;
          const now = i === active;
          return (
            <li key={label} className="flex items-center gap-1">
              {i > 0 && (
                <span className={cn("h-px w-2 sm:w-4", isDone || now ? "bg-[var(--ember)]/70" : "bg-white/15")} />
              )}
              <span
                className={cn(
                  "grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[12px] font-semibold transition-all",
                  now && "bg-[var(--ember)] text-[#2a1205] shadow-[0_0_14px_rgba(242,166,90,0.7)] sm:px-3",
                  isDone && !now && "bg-[var(--ember)]/20 text-[var(--ember)]",
                  !now && !isDone && "text-white/35",
                )}
                title={label}
              >
                {now ? <span className="hidden sm:inline">{label}</span> : null}
                <span className={now ? "sm:hidden" : ""}>{i === 5 ? "✉" : isDone ? "✓" : i + 1}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
