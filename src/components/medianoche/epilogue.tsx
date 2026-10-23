"use client";

import { useEffect, useState } from "react";
import { play as benchoPlay } from "@/lib/bencho/sounds";

type Props = {
  to: string;
  from: string;
  muted?: boolean;
};

type Reply = "also" | "think" | null;

const STORAGE_KEY = "medianoche-reply";

export function Epilogue({ to, from, muted }: Props) {
  const [reply, setReply] = useState<Reply>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { reply?: Reply; to?: string };
      if (
        (parsed.reply === "also" || parsed.reply === "think") &&
        parsed.to === to
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReply(parsed.reply);
      }
    } catch {
      /* ignore */
    }
  }, [to]);

  function choose(next: Exclude<Reply, null>) {
    setReply(next);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ reply: next, at: Date.now(), to, from }),
      );
    } catch {
      /* ignore */
    }
    if (!muted) {
      try {
        benchoPlay(next === "also" ? "perk" : "hush", { volume: 0.5 });
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className="panel mt-8 px-5 py-7 text-center">
      {!reply && (
        <>
          <p className="font-display text-xl text-[#f7efe2]">¿Y tú qué dices?</p>
          <p className="mt-3 text-[14px] leading-6 text-[#c9d5d8]">
            No tienes que contestar perfecto. Solo si quieres.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => choose("also")}
              className="btn btn-ember"
            >
              También siento algo
            </button>
            <button
              type="button"
              onClick={() => choose("think")}
              className="btn btn-ghost"
            >
              Lo voy a pensar
            </button>
          </div>
        </>
      )}

      {reply === "also" && (
        <>
          <p className="font-display text-xl text-[#f6e7c8]">Uy, qué chévere. No era solo yo.</p>
          <p className="mt-3 text-[14px] leading-6 text-[#c9d5d8]">
            Gracias, {to}.
          </p>
        </>
      )}

      {reply === "think" && (
        <>
          <p className="font-display text-xl text-[#f6e7c8]">Está bien.</p>
          <p className="mt-3 text-[14px] leading-6 text-[#c9d5d8]">
            Tómate tu tiempo, no hay afán.
          </p>
        </>
      )}
    </div>
  );
}
