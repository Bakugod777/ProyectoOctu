"use client";

const COLORS = ["#f2a65a", "#e8743b", "#f7efe2", "#d0454f", "#ffd59a"];

/** Chispas de victoria (solo CSS). Se oculta con prefers-reduced-motion. */
export function Burst({ count = 22 }: { count?: number }) {
  return (
    <span className="burst" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + (i % 3) * 0.3;
        const r = 70 + ((i * 37) % 90);
        return (
          <i
            key={i}
            style={
              {
                "--x": `${Math.cos(a) * r}px`,
                "--y": `${Math.sin(a) * r}px`,
                "--c": COLORS[i % COLORS.length],
                "--d": `${(i % 5) * 0.03}s`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </span>
  );
}
