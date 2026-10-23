"use client";

import { useState } from "react";
import { Owl } from "./owl";

type Props = {
  initial: string;
  dateLabel: string;
  brand: string;
  onSubmit: (name: string) => void;
};

const MAX = 24;

/** Primera pantalla: ella escribe su nombre en una etiqueta de papel, a la luz de una vela. */
export function NameScreen({ initial, dateLabel, brand, onSubmit }: Props) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");
  const clean = value.replace(/\s+/g, " ").trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clean) {
      setError("Escribe tu nombre, aunque sea uno cortico.");
      return;
    }
    onSubmit(clean);
  }

  return (
    <section className="chapter-in relative flex min-h-dvh flex-col items-center justify-center px-4 py-14 text-center sm:px-8">
      <div className="w-[min(40vw,170px)] sm:w-[190px]">
        <Owl pose="normal" />
      </div>
      <form
        onSubmit={submit}
        className="paper relative mt-[-8px] w-full max-w-md rounded-[6px] px-5 pb-7 pt-8 sm:px-8"
        noValidate
      >
        <span aria-hidden className="name-candle" />
        <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9b1c2c]">
          {dateLabel} · {brand}
        </p>
        <h1 className="mt-3 font-display text-[clamp(1.6rem,6.5vw,2.2rem)] font-semibold leading-tight text-[#2b1d14]">
          Antes de empezar…
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-[15px] leading-6 text-[#5b4636]">
          Sirius, el búho, necesita saber a quién se va a llevar esta noche. ¿Cómo te llamas?
        </p>
        <label htmlFor="her-name" className="sr-only">
          Tu nombre
        </label>
        <input
          id="her-name"
          type="text"
          inputMode="text"
          autoComplete="given-name"
          autoCapitalize="words"
          spellCheck={false}
          maxLength={MAX}
          value={value}
          placeholder="Tu nombre"
          aria-invalid={error ? true : undefined}
          aria-describedby="her-name-help"
          onChange={(e) => {
            setValue(e.target.value.slice(0, MAX));
            if (error) setError("");
          }}
          className="name-input mt-5 w-full"
        />
        <p id="her-name-help" aria-live="polite" className="mt-2 min-h-5 text-[13px] text-[#7a1622]">
          {error || (clean ? `Hola, ${clean} ✦` : "\u00a0")}
        </p>
        <button type="submit" className="btn btn-ember mt-3 w-full" disabled={!clean}>
          Ese es mi nombre 🕯
        </button>
        <p className="mt-3 text-[12px] text-[#6b5440]">Solo se guarda en este celular o compu.</p>
      </form>
    </section>
  );
}
