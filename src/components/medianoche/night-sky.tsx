"use client";

import { useMemo } from "react";

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Props = {
  /** 0 = luna totalmente tapada, 1 = luna llena */
  reveal?: number;
};

export function NightSky({ reveal = 0 }: Props) {
  const amount = Math.max(0, Math.min(1, reveal));

  const stars = useMemo(() => {
    const rand = mulberry32(31);
    return Array.from({ length: 86 }, (_, i) => {
      const x = rand() * 100;
      const y = rand() * 62;
      const size = 1 + rand() * 2.2;
      const delay = rand() * 6;
      const dur = 2.4 + rand() * 3.8;
      const bright = 0.35 + rand() * 0.65;
      return { id: i, x, y, size, delay, dur, bright };
    });
  }, []);

  // Shadow: fully covering at 0 → slides off at 1 (luna llena)
  const shadowShift = amount * 120;
  const glow = 0.04 + amount * 0.36;
  const moonLight = 0.08 + amount * 0.92;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#2b2a5e_0%,#070a18_45%,#04050d_100%)]" />
      <div
        className="absolute inset-0 transition-[opacity] duration-1000 ease-out"
        style={{
          opacity: 0.35 + amount * 0.65,
          background: `radial-gradient(circle at 78% 18%, rgba(232,160,90,${glow}), transparent 28%)`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(232,116,59,0.12),transparent_35%)]" />

      {stars.map((star) => (
        <span
          key={star.id}
          className="star-twinkle absolute rounded-full bg-[#f4efe4]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.bright * (0.55 + amount * 0.45),
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.dur}s`,
            boxShadow:
              star.size > 2.4
                ? "0 0 6px 1px rgba(244,239,228,0.45)"
                : undefined,
          }}
        />
      ))}

      <div
        className="moon absolute right-[10%] top-[9%] size-[4.5rem] sm:right-[12%] sm:top-[11%] sm:size-24"
      >
        {/* Full moon body */}
        <div
          className="absolute inset-0 rounded-full bg-[#f3e2c4] transition-[box-shadow,opacity] duration-1000 ease-out"
          style={{
            opacity: moonLight,
            boxShadow: `0 0 ${40 + amount * 50}px ${12 + amount * 20}px rgba(243,226,196,${0.08 + amount * 0.28})`,
          }}
        />
        <div
          className="absolute left-[18%] top-[22%] size-[18%] rounded-full bg-[#e2c89a]/70 transition-opacity duration-1000"
          style={{ opacity: amount * 0.85 }}
        />
        <div
          className="absolute left-[48%] top-[42%] size-[12%] rounded-full bg-[#e2c89a]/55 transition-opacity duration-1000"
          style={{ opacity: amount * 0.7 }}
        />

        {/* Eclipse disc — covers moon, slides away as reveal grows */}
        <div
          className="moon-shadow absolute inset-[-6%] rounded-full bg-[#070a18] transition-transform duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translateX(${shadowShift}%)`,
            boxShadow: "0 0 0 2px #070a18",
          }}
        />

        {/* Soft rim light while partially covered */}
        {amount < 0.98 && (
          <div
            className="absolute inset-0 rounded-full transition-opacity duration-1000"
            style={{
              opacity: amount < 0.08 ? 0.15 : 0.35 * (1 - amount),
              boxShadow: "inset -6px 0 12px rgba(243,226,196,0.18)",
            }}
          />
        )}
      </div>

      <svg
        className="absolute bottom-0 left-0 h-[28vh] w-full text-[#05060f]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,224 L80,200 L160,230 L240,170 L320,210 L400,140 L480,190 L560,120 L640,180 L720,100 L800,170 L880,90 L960,160 L1040,110 L1120,180 L1200,130 L1280,200 L1360,150 L1440,190 L1440,320 L0,320 Z"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#04050d] to-transparent" />
    </div>
  );
}
