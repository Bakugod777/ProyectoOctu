/**
 * Medianoche · todo el texto vive aquí.
 *
 * Marcadores que se reemplazan solos en cualquier texto:
 *   [ELLA]     → el nombre que ella escribe al empezar (se puede prellenar con ?para=Nombre)
 *   [TU]       → tu nombre, el de quien manda esto (campo `from` o por URL: &de=TuNombre)
 *   [RECUERDO] → el campo `recuerdo` de abajo
 *
 * ✏️ PAPU, LLENA ESTO (busca "✏️"): `from`, `recuerdo`, `letter`, `closing`.
 * Tip: mete detalles reales. Si suena “bonito” pero vacío, bórralo.
 */
export type StoryBeat = {
  title: string;
  body: string;
};

export type MemoryPair = {
  id: string;
  a: string;
  b: string;
  /** Mensajito que cae al juntar la pareja. */
  note: string;
};

export type Speaker = "buho" | "ella" | "narra";
export type Pose = "normal" | "feliz" | "sorprendido" | "sinCapa";
export type Line = { who: Speaker; text: string; pose?: Pose };

/** Escenas: si existe /public/scenes/<id>.webp se usa; si no, el fondo CSS/SVG. */
export type SceneId =
  | "cuarto"
  | "puerta"
  | "ventana"
  | "pasillo"
  | "escalera"
  | "guardian"
  | "abierta";

export type Script = {
  intro: Line[];
  lanternsIntro: Line[];
  lanternsWin: Line[];
  starsIntro: Line[];
  starsWin: Line[];
  memoryIntro: Line[];
  memoryWin: Line[];
  timelineIntro: Line[];
  timelineWin: Line[];
  whisperIntro: Line[];
  whisperWin: Line[];
  finale: Line[];
};

export type TimelineItem = {
  id: string;
  label: string;
};

export type ConfessionConfig = {
  brand: string;
  to: string;
  recuerdo: string;
  captorName: string;
  script: Script;
  from: string;
  dateLabel: string;
  headline: string;
  invite: string;
  howItWorks: string;
  sealWord: string;
  storyBeats: [StoryBeat, StoryBeat, StoryBeat, StoryBeat, StoryBeat];
  lanternTitle: string;
  lanternLead: string;
  lanternClues: [string, string, string];
  starTitle: string;
  starPrompt: string;
  memoryTitle: string;
  memoryLead: string;
  memoryPairs: [MemoryPair, MemoryPair, MemoryPair];
  timelineTitle: string;
  timelineLead: string;
  timelineItems: [TimelineItem, TimelineItem, TimelineItem, TimelineItem];
  timelineOrder: [string, string, string, string];
  whisperTitle: string;
  whisperPrompt: string;
  whisperAnswer: string;
  whisperOptions: string[];
  letter: string[];
  closing: string;
};

export const confessionConfig: ConfessionConfig = {
  brand: "Medianoche",
  // Lo reemplaza el nombre que ella escribe en la primera pantalla.
  to: "",
  // ✏️ TU NOMBRE (o mándalo por URL: ?de=TuNombre).
  from: "Manuel",
  // ✏️ Lo primero que notaste de ella (va en “Lo primero que noté de ti fue …”).
  // Frase genérica de reemplazo; cámbiala por algo de verdad.
  recuerdo: "que eras fácil de hablar, sin forzarla",
  captorName: "Sirius",
  dateLabel: "Para ti",
  headline: "Te secuestraron. Tranquilo: es una broma.",
  invite:
    "Son 5 pruebas cortas y al final una carta. Toca para continuar.",
  howItWorks: "faroles · estrellas · memoria · fotos · verdad · carta",
  sealWord: "abrir",
  script: {
    intro: [
      { who: "buho", pose: "feliz", text: "Hola, [ELLA]. Soy Sirius. No te preocupes: esto es un juego, no un secuestro de verdad." },
      { who: "buho", pose: "normal", text: "Para salir tienes que pasar 5 pruebas. Son cortas." },
      { who: "ella", text: "¿Y si no quiero?" },
      { who: "buho", pose: "feliz", text: "Entonces te quedas aquí aburrida. Mejor hazlas y listo." },
    ],
    lanternsIntro: [
      { who: "buho", pose: "normal", text: "Tres faroles. Enciéndelos y vas a leer tres notas." },
    ],
    lanternsWin: [
      { who: "buho", pose: "feliz", text: "Lo primero que noté de ti fue [RECUERDO]." },
    ],
    starsIntro: [
      { who: "buho", pose: "normal", text: "Une las estrellas. Así de simple." },
    ],
    starsWin: [
      { who: "buho", pose: "sorprendido", text: "Hecho. Buen ojo, [ELLA]." },
    ],
    memoryIntro: [
      { who: "buho", pose: "normal", text: "Ahora junta las tarjetas que van juntas." },
    ],
    memoryWin: [
      { who: "buho", pose: "feliz", text: "Bien. Sigamos." },
    ],
    timelineIntro: [
      { who: "buho", pose: "sorprendido", text: "Se mezclaron las fotos. Ordénalas como creas que ocurrió." },
    ],
    timelineWin: [
      { who: "buho", pose: "normal", text: "Más o menos así: te conoció, habló de más, dudó, y terminó haciendo esto." },
    ],
    whisperIntro: [
      { who: "buho", pose: "normal", text: "Última. Una pregunta. Sin trampa." },
    ],
    whisperWin: [
      { who: "buho", pose: "feliz", text: "Correcto. Ya casi sales." },
    ],
    finale: [
      { who: "narra", text: "La puerta se abre." },
      { who: "buho", pose: "sinCapa", text: "Era yo, [TU]. Sirius era el disfraz. Un mensaje normal se me hacía corto, así que hice esto." },
      { who: "buho", pose: "sinCapa", text: "Lee esto cuando quieras." },
    ],
  },
  storyBeats: [
    { title: "Los faroles", body: "Lo primero que noté de ti fue [RECUERDO]." },
    { title: "Las estrellas", body: "Las uniste a la primera." },
    { title: "El pasillo", body: "“Ya casi”, “solo una cosa”, y el “ya me voy” que se alarga." },
    { title: "Las fotos", body: "Te conoció. Habló de más. Dudó. Y hizo esta página." },
    { title: "La verdad", body: "Me caíste bien más de lo que dejé ver." },
  ],
  lanternTitle: "Prueba 1 · Los faroles",
  lanternLead: "Enciende los faroles en orden: 1, 2 y 3.",
  lanternClues: [
    "Hablando contigo se me va la hora.",
    "A veces invento un tema para no colgar todavía.",
    "Cuando termina el chat, el silencio se nota.",
  ],
  starTitle: "Prueba 2 · La ventana",
  starPrompt: "Une las estrellas en orden. Toca o arrastra el dedo.",
  memoryTitle: "Prueba 3 · El pasillo",
  memoryLead: "Junta las que van juntas.",
  // ✏️ Cartas de memoria: frases genéricas, cámbialas por cosas de ustedes.
  memoryPairs: [
    { id: "m1", a: "“ya casi”", b: "media hora después", note: "Dices “ya casi” y llegas media hora tarde." },
    { id: "m2", a: "“solo una cosa”", b: "la 1 de la mañana", note: "Empieza con “solo una cosa” y acaba a la 1 a. m." },
    { id: "m3", a: "“ya me voy”", b: "cinco minutos más", note: "Dices “ya me voy” y te quedas un rato más." },
  ],
  timelineTitle: "Prueba 4 · Las fotos",
  timelineLead: "Toca las fotos en el orden en que ocurrió.",
  timelineItems: [
    { id: "t1", label: "Te conoció" },
    { id: "t2", label: "Empezó a hablarte de más" },
    { id: "t3", label: "Dudó en decirlo" },
    { id: "t4", label: "Hizo esta página" },
  ],
  timelineOrder: ["t1", "t2", "t3", "t4"],
  whisperTitle: "Prueba 5 · La tabla",
  whisperPrompt: "Si tuviera que admitir una sola cosa…",
  whisperAnswer: "que me caíste bien más de lo que dejé ver",
  whisperOptions: [
    "que me caíste bien más de lo que dejé ver",
    "que es pura costumbre",
    "que es solo por Halloween",
    "que no siento nada",
  ],
  // ✏️ LA CARTA: un párrafo por línea.
  letter: [
    "Podría haberte escrito un mensaje corto. Lo borré tres veces. Esta página salió porque no quería que se perdiera entre otras notificaciones.",
    "Me pasa algo simple y difícil de explicar: cuando hablamos, dejo de ensayar lo que voy a decir. Contigo salen las frases sin tanto filtro.",
    "No estoy pidiendo que digas nada hoy. Solo quería dejar constancia de esto, en un sitio donde no se diluya.",
    "Si esto te resulta raro, lo entiendo. A mí también me resultó raro armarlo. Aun así, preferí el riesgo de enviártelo que el de no decirte nada.",
    "Te deseo lo mejor, de verdad: ánimo para lo que viene, días más livianos, y que te vaya súper bien en todo lo que te importe. Mereces eso y más.",
    "Te amo.",
  ],
  // ✏️ Despedida de la carta.
  closing: "— Manuel",
};

/** Reemplaza [ELLA], [TU] y [RECUERDO] en un texto. */
export function fillText(text: string, c: Pick<ConfessionConfig, "to" | "from" | "recuerdo">) {
  return text
    .replaceAll("[ELLA]", c.to)
    .replaceAll("[TU]", c.from)
    .replaceAll("[RECUERDO]", c.recuerdo);
}

function fillDeep<T>(value: T, c: Pick<ConfessionConfig, "to" | "from" | "recuerdo">): T {
  if (typeof value === "string") return fillText(value, c) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, c)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, fillDeep(v, c)]),
    ) as T;
  }
  return value;
}

/** Limpia el nombre que ella escribe: sin espacios extra, 1–24 caracteres. */
export function cleanName(raw: string | null | undefined): string {
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, 24).trim();
}

export function resolveConfession(
  searchParams?: URLSearchParams | null,
  herName?: string | null,
): ConfessionConfig {
  const to = cleanName(herName) || cleanName(searchParams?.get("para"));
  const from = cleanName(searchParams?.get("de")) || cleanName(confessionConfig.from);
  const names = {
    to: to || confessionConfig.to,
    from,
    recuerdo: confessionConfig.recuerdo,
  };
  // Las respuestas se comparan ya reemplazadas, así que todo pasa por fillDeep.
  return { ...fillDeep(confessionConfig, names), ...names };
}
