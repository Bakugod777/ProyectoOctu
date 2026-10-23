/** Trazos (0–100) para que la constelación dibuje la inicial. Cada trazo es una línea continua. */
type Shape = { s: number[][][]; closed?: number[] };

const O = [[50, 12], [22, 32], [22, 68], [50, 88], [78, 68], [78, 32]];
const P = [[25, 88], [25, 12], [64, 16], [72, 32], [62, 48], [30, 50]];

export const LETTERS: Record<string, Shape> = {
  A: { s: [[[18, 88], [50, 12], [82, 88]], [[33, 58], [67, 58]]] },
  B: { s: [[[25, 88], [25, 12], [64, 16], [66, 44], [30, 50], [72, 62], [68, 86], [32, 88]]] },
  C: { s: [[[78, 22], [48, 12], [22, 35], [22, 65], [48, 88], [78, 78]]] },
  D: { s: [[[25, 88], [25, 12], [62, 18], [78, 50], [62, 82]]], closed: [0] },
  E: { s: [[[75, 12], [25, 12], [25, 88], [75, 88]], [[32, 50], [64, 50]]] },
  F: { s: [[[75, 12], [25, 12], [25, 88]], [[32, 50], [64, 50]]] },
  G: { s: [[[78, 22], [48, 12], [22, 40], [30, 78], [55, 88], [78, 70], [78, 52], [56, 52]]] },
  H: { s: [[[25, 12], [25, 88]], [[75, 12], [75, 88]], [[32, 50], [68, 50]]] },
  I: { s: [[[32, 12], [68, 12]], [[50, 22], [50, 78]], [[32, 88], [68, 88]]] },
  J: { s: [[[30, 12], [74, 12]], [[60, 22], [60, 72], [44, 88], [24, 74]]] },
  K: { s: [[[25, 12], [25, 88]], [[75, 12], [32, 52], [75, 88]]] },
  L: { s: [[[25, 12], [25, 88], [75, 88]]] },
  M: { s: [[[16, 88], [22, 12], [50, 60], [78, 12], [84, 88]]] },
  N: { s: [[[25, 88], [25, 12], [75, 88], [75, 12]]] },
  O: { s: [O], closed: [0] },
  P: { s: [P] },
  Q: { s: [O, [[60, 70], [84, 94]]], closed: [0] },
  R: { s: [P, [[48, 56], [76, 88]]] },
  S: { s: [[[76, 20], [50, 12], [24, 28], [40, 48], [64, 55], [76, 74], [52, 88], [24, 80]]] },
  T: { s: [[[18, 12], [82, 12]], [[50, 24], [50, 88]]] },
  U: { s: [[[22, 12], [24, 70], [50, 88], [76, 70], [78, 12]]] },
  V: { s: [[[20, 12], [50, 88], [80, 12]]] },
  W: { s: [[[14, 12], [30, 88], [50, 40], [70, 88], [86, 12]]] },
  X: { s: [[[22, 12], [78, 88]], [[78, 12], [22, 88]]] },
  Y: { s: [[[22, 12], [50, 48], [78, 12]], [[50, 58], [50, 88]]] },
  Z: { s: [[[22, 12], [78, 12], [22, 88], [78, 88]]] },
};

/** Corazón, si la inicial no es una letra A–Z. */
export const HEART: Shape = {
  s: [[[50, 88], [16, 46], [30, 16], [50, 34], [70, 16], [84, 46]]],
  closed: [0],
};

function densify(stroke: number[][], max: number) {
  const out: number[][] = [stroke[0]];
  for (let i = 1; i < stroke.length; i++) {
    const [ax, ay] = stroke[i - 1];
    const [bx, by] = stroke[i];
    const parts = Math.ceil(Math.hypot(bx - ax, by - ay) / max);
    for (let j = 1; j <= parts; j++) out.push([ax + ((bx - ax) * j) / parts, ay + ((by - ay) * j) / parts]);
  }
  return out;
}

export type Star = { x: number; y: number; stroke: number };

export function shapeFor(name: string) {
  const ch = name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .charAt(0)
    .toUpperCase();
  const base = LETTERS[ch] ?? HEART;
  // Agrega estrellas intermedias en tramos largos para que haya al menos 6.
  let shape = base;
  for (let max = 60; max >= 20; max -= 10) {
    shape = { ...base, s: base.s.map((st) => densify(st, max)) };
    if (shape.s.flat().length >= 6) break;
  }
  const stars: Star[] = [];
  shape.s.forEach((stroke, k) =>
    stroke.forEach(([x, y]) => stars.push({ x: 12 + x * 0.76, y: 8 + y * 0.82, stroke: k })),
  );
  return { letter: LETTERS[ch] ? ch : "♥", stars, strokes: shape.s.length, closed: shape.closed ?? [] };
}
