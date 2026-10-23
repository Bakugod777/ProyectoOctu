"use client";

/** Pétalos de cempasúchil cayendo (CSS). Se desactiva con prefers-reduced-motion. */
export function Petals({ count = 26 }: { count?: number }) {
  return (
    <div className="petals pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={
            {
              left: `${(i * 37) % 100}%`,
              "--dur": `${6 + (i % 5)}s`,
              "--delay": `${(i % 9) * -0.8}s`,
              "--sway": `${(i % 2 ? 1 : -1) * (20 + (i % 4) * 12)}px`,
              "--c": i % 3 ? "#f59e0b" : "#f97316",
              width: 10 + (i % 3) * 4,
              height: 8 + (i % 3) * 3,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
