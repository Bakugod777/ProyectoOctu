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
  from: "[TU NOMBRE]",
  // ✏️ Lo primero que notaste de ella (va en “Lo primero que noté de ti fue …”).
  // Frase genérica de reemplazo; cámbiala por algo de verdad.
  recuerdo: "que eras fácil de hablar, sin forzarla",
  captorName: "Sirius",
  dateLabel: "31 de octubre",
  headline: "Te secuestraron. Relájate, es una broma.",
  invite:
    "Son 5 pruebas cortas y al final una carta. Toca para seguir.",
  howItWorks: "faroles · estrellas · memoria · fotos · verdad · carta",
  sealWord: "abrir",
  script: {
    intro: [
      { who: "buho", pose: "feliz", text: "Ey, [ELLA]. Soy Sirius. No te asustes: esto es un juego, no un secuestro de verdad." },
      { who: "buho", pose: "normal", text: "Para salir tienes que pasar 5 pruebas. Son cortas." },
      { who: "ella", text: "¿Y si no quiero?" },
      { who: "buho", pose: "feliz", text: "Pues te quedas aquí aburrida. Mejor hazlas y ya." },
    ],
    lanternsIntro: [
      { who: "buho", pose: "normal", text: "Tres faroles. Préndelos y vas a leer tres cosas que alguien pensó de ti." },
    ],
    lanternsWin: [
      { who: "buho", pose: "feliz", text: "Lo primero que noté de ti fue [RECUERDO]." },
    ],
    starsIntro: [
      { who: "buho", pose: "normal", text: "Une las estrellas. Así de simple." },
    ],
    starsWin: [
      { who: "buho", pose: "sorprendido", text: "Listo. Buen ojo, [ELLA]." },
    ],
    memoryIntro: [
      { who: "buho", pose: "normal", text: "Ahora junta las tarjetas que van juntas. Son cosas random de ustedes." },
    ],
    memoryWin: [
      { who: "buho", pose: "feliz", text: "Ok, eso. Sigamos." },
    ],
    timelineIntro: [
      { who: "buho", pose: "sorprendido", text: "Se revolvieron las fotos. Ordénalas como creas que pasó." },
    ],
    timelineWin: [
      { who: "buho", pose: "normal", text: "Más o menos así fue: te vio, habló de más, se hizo el duro, y terminó armando esto." },
    ],
    whisperIntro: [
      { who: "buho", pose: "normal", text: "Última. Una pregunta. No hay trampa rara." },
    ],
    whisperWin: [
      { who: "buho", pose: "feliz", text: "Esa. Ya casi sales." },
    ],
    finale: [
      { who: "narra", text: "La puerta se abre." },
      { who: "buho", pose: "sinCapa", text: "Era yo, [TU]. Sirius era el disfraz. Un mensaje normal se me hacía corto, entonces armé esto." },
      { who: "buho", pose: "sinCapa", text: "Lee esto cuando quieras." },
    ],
  },
  storyBeats: [
    { title: "Los faroles", body: "Lo primero que noté de ti fue [RECUERDO]." },
    { title: "Las estrellas", body: "Sabías unirlas a la primera." },
    { title: "El pasillo", body: "Los “ya casi”, las “cositas”, y el “ya me voy” que dura media hora." },
    { title: "Las fotos", body: "Te vio. Habló de más. Se hizo el duro. Y armó esta noche." },
    { title: "La verdad", body: "Me caíste bien más de lo que dejé ver." },
  ],
  lanternTitle: "Prueba 1 · Los faroles",
  lanternLead: "Prende los faroles en orden: 1, 2 y 3.",
  lanternClues: [
    "Hablando contigo se me va la hora sin darme cuenta.",
    "A veces invento un tema cualquiera para no colgar todavía.",
    "Cuando se acaba el chat, se siente raro el silencio.",
  ],
  starTitle: "Prueba 2 · La ventana",
  starPrompt: "Une las estrellas en orden. Toca o arrastra el dedo.",
  memoryTitle: "Prueba 3 · El pasillo",
  memoryLead: "Junta las que van juntas.",
  // ✏️ Cartas de memoria: frases genéricas, cámbialas por cosas de ustedes.
  memoryPairs: [
    { id: "m1", a: "“ya casi”", b: "media hora después", note: "Dices “ya casi” y llegas media hora después. Clásico." },
    { id: "m2", a: "“una cosita”", b: "la 1 de la mañana", note: "Empieza con “una cosita” y terminan a la 1 a. m." },
    { id: "m3", a: "“ya me voy”", b: "5 minuticos más", note: "El “ya me voy” que nunca es ya." },
  ],
  timelineTitle: "Prueba 4 · Las fotos",
  timelineLead: "Toca las fotos en el orden en que pasó.",
  timelineItems: [
    { id: "t1", label: "Te vio" },
    { id: "t2", label: "Empezó a hablarte de más" },
    { id: "t3", label: "Se hizo el duro" },
    { id: "t4", label: "Armó esta página" },
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
  // ✏️ LA CARTA: un párrafo por línea. Este texto es de ejemplo; escríbela tú.
  letter: [
    "Si llegaste hasta acá, gracias. Sé que es un poco raro mandar una página en vez de un mensaje.",
    "No te armé esto para que me contestes hoy. Solo no quería dejar pasar el 31 sin decir nada.",
    "Me caíste bien. Hablo más fácil contigo. Miro el celular de más cuando chateamos. Eso es todo, sin drama.",
    "Si hay algo de tu lado, me dices cuando quieras. Si no, igual gracias por leer.",
  ],
  // ✏️ Despedida de la carta.
  closing: "— [TU]",
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
