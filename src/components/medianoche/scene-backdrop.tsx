"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { SceneId } from "@/lib/confession-config";

/**
 * Fondos de escena en papel recortado (SVG/CSS).
 * Para usar ilustraciones reales: pon /public/scenes/<id>.webp
 * (cuarto, puerta, ventana, pasillo, escalera, guardian, abierta).
 * Si el archivo no existe, se usa este fondo SVG.
 */
const P = { far: "#221d4a", mid: "#191538", near: "#100d26", ink: "#0a0819", warm: "#f2a65a" };

function Candle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-26" r="26" fill="url(#halo)" />
      <rect x="-5" y="-14" width="10" height="22" rx="2" fill="#efe2c6" />
      <path d="M0 -30 Q6 -22 0 -15 Q-6 -22 0 -30 Z" fill={P.warm} />
    </g>
  );
}

const SCENES: Record<SceneId, ReactNode> = {
  cuarto: (
    <>
      <rect width="400" height="300" fill={P.far} />
      <g className="scene-layer">
        <path d="M250 40 h110 v120 h-110 Z M258 48 v104 h94 v-104 Z" fillRule="evenodd" fill={P.mid} />
        <circle cx="318" cy="88" r="20" fill="#f3e2c4" />
        <path d="M305 48 v104 M258 100 h94" stroke={P.mid} strokeWidth="6" />
      </g>
      <g className="scene-layer">
        <path d="M0 230 h400 v70 h-400 Z" fill={P.mid} />
        <path d="M40 214 h150 v10 h-150 Z M52 224 h10 v60 h-10 Z M168 224 h10 v60 h-10 Z" fill={P.near} />
        <Candle x={110} y={214} />
      </g>
    </>
  ),
  puerta: (
    <>
      <rect width="400" height="300" fill={P.far} />
      <g className="scene-layer" fill={P.mid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={(i % 4) * 100 + (i > 3 ? 50 : 0)} y={i > 3 ? 60 : 20} width="92" height="34" rx="3" opacity="0.6" />
        ))}
      </g>
      <g className="scene-layer">
        <path d="M130 300 V130 Q200 40 270 130 V300 Z" fill={P.near} />
        <path d="M146 300 V136 Q200 62 254 136 V300 Z" fill="#2c1d18" />
        <circle cx="238" cy="210" r="6" fill={P.warm} />
        <path d="M0 270 h400 v30 h-400 Z" fill={P.ink} />
      </g>
    </>
  ),
  ventana: (
    <>
      <g className="scene-layer">
        <path d="M0 0 h400 v300 h-400 Z M70 30 h260 v220 h-260 Z" fillRule="evenodd" fill={P.mid} />
        <path d="M200 30 v220 M70 140 h260" stroke={P.near} strokeWidth="8" />
        <path d="M50 250 h300 v14 h-300 Z" fill={P.near} />
        <path d="M70 30 Q40 120 58 250 L70 250 Z M330 30 Q360 120 342 250 L330 250 Z" fill="#5a1520" />
      </g>
    </>
  ),
  pasillo: (
    <>
      <rect width="400" height="300" fill={P.far} />
      <g className="scene-layer">
        <path d="M0 0 L160 110 V200 L0 300 Z" fill={P.mid} />
        <path d="M400 0 L240 110 V200 L400 300 Z" fill={P.mid} />
        <path d="M0 300 L160 200 H240 L400 300 Z" fill={P.near} />
        <rect x="186" y="128" width="28" height="72" rx="14" fill={P.warm} opacity="0.75" />
        <path d="M40 80 l50 30 v50 l-50 -24 Z M360 80 l-50 30 v50 l50 -24 Z" fill="#3a2a52" stroke="#c99566" strokeWidth="3" />
        <path d="M110 128 l24 15 v26 l-24 -12 Z M290 128 l-24 15 v26 l24 -12 Z" fill="#3a2a52" stroke="#c99566" strokeWidth="2" />
      </g>
    </>
  ),
  escalera: (
    <>
      <rect width="400" height="300" fill={P.far} />
      <g className="scene-layer" fill={P.near}>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={30 + i * 44} y={270 - i * 30} width="400" height="30" />
        ))}
        <path d="M20 230 L360 10" stroke="#3a2a52" strokeWidth="6" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M${44 + i * 44} ${222 - i * 28} v40`} stroke="#3a2a52" strokeWidth="4" />
        ))}
      </g>
    </>
  ),
  guardian: (
    <>
      <rect width="400" height="300" fill={P.far} />
      <g opacity="0.5">
        <ellipse cx="200" cy="120" rx="90" ry="110" fill={P.ink} />
        <path d="M130 40 L120 -10 L170 30 Z M270 40 L280 -10 L230 30 Z" fill={P.ink} />
      </g>
      <g className="scene-layer">
        <path d="M60 240 h280 l20 20 h-320 Z" fill={P.mid} />
        <path d="M30 260 h340 v40 h-340 Z" fill={P.near} />
        <Candle x={80} y={240} s={0.9} />
        <Candle x={320} y={240} s={0.9} />
      </g>
    </>
  ),
  abierta: (
    <>
      <rect width="400" height="300" fill={P.far} />
      <g className="scene-layer">
        <path d="M130 300 V130 Q200 40 270 130 V300 Z" fill="#ffd59a" />
        <path d="M130 300 V130 Q200 40 270 130 V300 Z" fill="url(#doorlight)" />
        <path d="M130 300 V130 L90 120 V300 Z" fill="#2c1d18" />
        <path d="M130 300 H270 L360 300 L330 300 Z" fill="#f2a65a" opacity="0.4" />
        <path d="M0 270 h400 v30 h-400 Z" fill={P.ink} />
        <path d="M130 270 H270 L380 300 H20 Z" fill="#f2a65a" opacity="0.3" />
      </g>
    </>
  ),
};

export function SceneBackdrop({ scene, dim = false }: { scene: SceneId; dim?: boolean }) {
  const [hasImage, setHasImage] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (scene in hasImage) return;
    const img = new Image();
    img.onload = () => setHasImage((h) => ({ ...h, [scene]: true }));
    img.onerror = () => setHasImage((h) => ({ ...h, [scene]: false }));
    img.src = `/scenes/${scene}.webp`;
  }, [scene, hasImage]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden key={scene}>
      <div className="chapter-in absolute inset-0">
        {hasImage[scene] ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(/scenes/${scene}.webp)` }}
          />
        ) : (
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
            <defs>
              <radialGradient id="halo">
                <stop offset="0" stopColor="#f2a65a" stopOpacity="0.55" />
                <stop offset="1" stopColor="#f2a65a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="doorlight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff3c4" />
                <stop offset="1" stopColor="#f2a65a" />
              </linearGradient>
            </defs>
            {SCENES[scene]}
          </svg>
        )}
      </div>
      <div
        className="absolute inset-0 bg-[#070a18] transition-opacity duration-700"
        style={{ opacity: dim ? 0.62 : 0.08 }}
      />
    </div>
  );
}
