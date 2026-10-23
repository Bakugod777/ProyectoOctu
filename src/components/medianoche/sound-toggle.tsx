"use client";

import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed right-3 top-[max(0.5rem,var(--safe-top))] z-50 grid size-11 place-items-center rounded-full border border-white/15 bg-[#070a18]/70 text-[#f6e7c8] backdrop-blur-md transition hover:border-[var(--ember)]/70"
      aria-pressed={!muted}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
      title={muted ? "Activar sonido" : "Silenciar"}
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
