"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  hue: number;
};

export function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const embers: Ember[] = [];
    const count = reduce ? 18 : 56;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(): Ember {
      return {
        x: Math.random() * w,
        y: h + 10 + Math.random() * 40,
        r: 0.6 + Math.random() * 2.2,
        vx: -0.25 + Math.random() * 0.5,
        vy: -0.4 - Math.random() * 1.1,
        life: 0,
        max: 140 + Math.random() * 220,
        hue: 24 + Math.random() * 28,
      };
    }

    function tick() {
      ctx!.clearRect(0, 0, w, h);
      while (embers.length < count) embers.push(spawn());

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life += 1;
        e.x += e.vx + Math.sin(e.life * 0.04) * 0.15;
        e.y += e.vy;
        const t = e.life / e.max;
        if (t >= 1 || e.y < -20) {
          embers[i] = spawn();
          continue;
        }
        const alpha = (1 - t) * 0.55;
        ctx!.beginPath();
        ctx!.fillStyle = `hsla(${e.hue}, 85%, ${58 + (1 - t) * 18}%, ${alpha})`;
        ctx!.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
}
