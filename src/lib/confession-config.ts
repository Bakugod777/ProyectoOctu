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
  recuerdo: "tu risa, esa que se te sale cuando intentas no reírte",
  captorName: "Sirius",
  dateLabel: "31 de octubre",
  headline: "Te secuestraron. Tranqui, que es con cariño.",
  invite:
    "Son 5 pruebas cortiticas y al final una carta. Toca la pantalla para avanzar los diálogos.",
  howItWorks: "faroles · estrellas · memoria · fotos · verdad · carta",
  sealWord: "abrir",
  script: {
    intro: [
      { who: "buho", pose: "feliz", text: "Buenas noches, [ELLA]. ¿Qué más? Soy Sirius, el búho. Tranqui, aquí nadie te va a hacer daño… salvo de pura ternura." },
      { who: "buho", pose: "normal", text: "Esta noche estás secuestrada. Para salir tienes que pasar 5 pruebas." },
      { who: "ella", text: "¿Y si no quiero?" },
      { who: "buho", pose: "feliz", text: "Pues te quedas conmigo comiendo dulces. Las dos opciones son bacanas." },
    ],
    lanternsIntro: [
      { who: "buho", pose: "normal", text: "La puerta tiene 3 faroles apagados. Cada uno guarda algo que alguien piensa de ti." },
    ],
    lanternsWin: [
      { who: "buho", pose: "feliz", text: "Lo primero que noté de ti fue [RECUERDO]." },
    ],
    starsIntro: [
      { who: "buho", pose: "normal", text: "Desde aquí se ve el camino, pero solo si unes las estrellas." },
    ],
    starsWin: [
      { who: "buho", pose: "sorprendido", text: "¡Uy, qué chévere! Hasta el cielo te conoce, [ELLA]." },
    ],
    memoryIntro: [
      { who: "buho", pose: "normal", text: "Este pasillo está lleno de cositas que alguien no se quiere olvidar." },
    ],
    memoryWin: [
      { who: "buho", pose: "feliz", text: "Todo eso quedó guardadito. Sigamos, que ya casi." },
    ],
    timelineIntro: [
      { who: "buho", pose: "sorprendido", text: "¡Ay, se cayeron las fotos! Ponlas en orden y vas a ver una historia." },
    ],
    timelineWin: [
      { who: "buho", pose: "normal", text: "Primero te notó. Después buscaba excusas. Después le dio miedo. Y ahora… esto." },
    ],
    whisperIntro: [
      { who: "buho", pose: "normal", text: "Última prueba, parce. Una sola pregunta, y la tabla no miente." },
    ],
    whisperWin: [
      { who: "buho", pose: "feliz", text: "Correcto. Ya eres libre… casi." },
    ],
    finale: [
      { who: "narra", text: "La puerta se abre. Entra olor a flores y a velas recién prendidas." },
      { who: "buho", pose: "sinCapa", text: "Era yo, [TU]. Sirius solo me prestó las plumas. Te secuestré porque un mensaje se me quedaba corto." },
      { who: "buho", pose: "sinCapa", text: "Antes de que te vayas… esto es para ti." },
    ],
  },
  storyBeats: [
    { title: "Los faroles", body: "Lo primero que noté de ti fue [RECUERDO]." },
    { title: "Las estrellas", body: "Hasta el cielo te conoce." },
    { title: "El pasillo", body: "Tus “ya casi”. Las “cositas” que terminan a la 1 a. m. El “ya me voy” que nunca es ya." },
    { title: "Las fotos", body: "Primero te notó. Después buscaba excusas. Después le dio miedo. Y ahora… esto." },
    { title: "La verdad", body: "Me importas más de lo que aparento." },
  ],
  lanternTitle: "Prueba 1 · Los faroles",
  lanternLead: "Prende los faroles en orden: 1, 2 y 3.",
  lanternClues: [
    "Cuando hablamos, se me pasa el tiempo volando.",
    "A veces me invento una excusa para no colgar.",
    "Cuando te vas, el silencio pesa.",
  ],
  starTitle: "Prueba 2 · La ventana",
  starPrompt: "Une las estrellas en orden. Toca o arrastra el dedo.",
  memoryTitle: "Prueba 3 · El pasillo",
  memoryLead: "Junta las que van juntas.",
  // ✏️ Cartas de memoria: frases genéricas, cámbialas por cosas de ustedes.
  memoryPairs: [
    { id: "m1", a: "“ya casi”", b: "media hora después", note: "Cómo me escribes “ya casi” y llegas media hora después, y aun así vale la pena esperarte." },
    { id: "m2", a: "“una cosita”", b: "la 1 de la mañana", note: "Las conversaciones que empiezan con “una cosita” y terminan a la 1 de la mañana." },
    { id: "m3", a: "“ya me voy”", b: "5 minuticos más", note: "El “ya me voy” que nunca es ya." },
  ],
  timelineTitle: "Prueba 4 · Las fotos",
  timelineLead: "Toca las fotos en el orden en que pasó.",
  timelineItems: [
    { id: "t1", label: "Te notó" },
    { id: "t2", label: "Buscaba excusas para hablarte" },
    { id: "t3", label: "Le dio miedo decírtelo" },
    { id: "t4", label: "Armó esta noche" },
  ],
  timelineOrder: ["t1", "t2", "t3", "t4"],
  whisperTitle: "Prueba 5 · La tabla",
  whisperPrompt: "Si tuviera que admitir una sola cosa…",
  whisperAnswer: "que me importas más de lo que aparento",
  whisperOptions: [
    "que me importas más de lo que aparento",
    "que es pura costumbre",
    "que es una broma de Halloween",
    "que no siento nada",
  ],
  // ✏️ LA CARTA: un párrafo por línea. Este texto es de ejemplo; escríbela tú.
  letter: [
    "Bueno. Si llegaste hasta aquí, ya te tocó todo el cuento de las pruebas. Gracias por no cerrarlo a la mitad.",
    "No te armé esto para que me contestes ya. Solo no quería pasar otro 31 sin decirte nada.",
    "Cuando estás, me río más fácil. Miro el celular más de la cuenta. Se me ocurren excusas bobas para seguir hablando contigo. Eso es todo.",
    "Si sientes aunque sea un poquito de eso, me dices cuando quieras. Y si no, igual… gracias por leer.",
  ],
  // ✏️ Despedida de la carta.
  closing: "Escrito con nervios, de verdad.",
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
