import { wordmarkGlyphs } from "./frequency";

const TAU = Math.PI * 2;
type Stroke = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  end: number;
};

/** Resample the actual LOWKYZ vector lettering, without a font atlas or model asset. */
function lettering() {
  const strokes: Stroke[] = [];
  let total = 0;
  for (const glyph of wordmarkGlyphs) {
    const tokens = glyph.match(/[MLHVZ]|-?\d+(?:\.\d+)?/g)!;
    let x = 0,
      y = 0,
      startX = 0,
      startY = 0,
      command = "M";
    for (let i = 0; i < tokens.length;) {
      if (/[MLHVZ]/.test(tokens[i])) command = tokens[i++];
      if (command === "Z") {
        const dx = startX - x,
          dy = startY - y,
          length = Math.hypot(dx, dy);
        total += length;
        strokes.push({ x, y, dx, dy, length, end: total });
        x = startX;
        y = startY;
        command = "M";
        continue;
      }
      const nx = command === "V" ? x : Number(tokens[i++]);
      const ny = command === "H" ? y : Number(tokens[i++]);
      if (command === "M") {
        x = nx;
        y = ny;
        startX = x;
        startY = y;
        command = "L";
      } else {
        const dx = nx - x,
          dy = ny - y,
          length = Math.hypot(dx, dy);
        total += length;
        strokes.push({ x, y, dx, dy, length, end: total });
        x = nx;
        y = ny;
      }
    }
  }
  return { strokes, total };
}
const signature = lettering();

export function signaturePoint(
  t: number,
  result: Float32Array,
  offset: number,
  thickness = 0,
  angle = 0,
) {
  const distance = Math.min(0.999999, t) * signature.total;
  let index = 0;
  while (
    index < signature.strokes.length - 1 &&
    signature.strokes[index].end < distance
  )
    index++;
  const s = signature.strokes[index];
  const fraction = (distance - (s.end - s.length)) / s.length;
  const normalX = -s.dy / s.length,
    normalY = s.dx / s.length;
  result[offset] =
    ((s.x + s.dx * fraction) / 264 - 0.5) * 5.4 +
    normalX * Math.cos(angle) * thickness;
  result[offset + 1] =
    (0.5 - (s.y + s.dy * fraction) / 48) * 0.98 -
    normalY * Math.cos(angle) * thickness;
  result[offset + 2] = Math.sin(angle) * thickness;
  return index;
}

/** Six homologous surfaces: knot → waveform → circuit → shards → orbit → signature. */
export function surfacePoint(
  stage: number,
  u: number,
  v: number,
  result: Float32Array,
  offset: number,
) {
  const a = u * TAU,
    b = v * TAU;
  let x = 0,
    y = 0,
    z = 0;
  if (stage === 0) {
    const twist = b + a * 2;
    const radius = 1.55 + Math.cos(a * 3) * 0.22;
    const tube = 0.3 + Math.sin(a * 3) * 0.09;
    x = (radius + Math.cos(twist) * tube) * Math.cos(a);
    y = (radius + Math.cos(twist) * tube) * Math.sin(a);
    z = Math.sin(twist) * tube + Math.sin(a * 3) * 0.48;
  } else if (stage === 1) {
    x = (u - 0.5) * 5;
    y = Math.sin(a * 2) * 0.72 + Math.cos(b) * 0.2;
    z = Math.cos(a * 2) * 0.52 + Math.sin(b) * 0.28;
  } else if (stage === 2) {
    const radius = 1.4 + Math.cos(b * 4) * 0.2;
    x = Math.cos(a) * radius;
    y = Math.sin(a) * radius;
    z = (v - 0.5) * 2.2 + Math.sin(a * 4) * 0.28;
  } else if (stage === 3) {
    const radius = 1.25 + Math.abs(Math.cos(a * 4)) * 0.55;
    x = Math.cos(a) * radius * (0.85 + 0.16 * Math.cos(b));
    y = Math.sin(a) * radius * (0.85 + 0.16 * Math.cos(b));
    z = Math.sin(b) * 0.35 + Math.sin(a * 4) * 0.9;
  } else if (stage === 4) {
    const twist = b + a * 3;
    x = (1.45 + Math.cos(twist) * 0.22) * Math.cos(a);
    y = (1.45 + Math.cos(twist) * 0.22) * Math.sin(a) * 0.7;
    z = Math.sin(twist) * 0.45 + Math.cos(a * 2) * 0.6;
  } else {
    signaturePoint(u, result, offset, 0.025, b);
    return;
  }
  result[offset] = x;
  result[offset + 1] = y;
  result[offset + 2] = z;
}

export function fieldPoint(
  stage: number,
  t: number,
  result: Float32Array,
  offset: number,
) {
  const a = t * TAU,
    b = t * TAU * 13;
  if (stage === 5) return signaturePoint(t, result, offset);
  if (stage === 0 || stage === 4) {
    const radius =
      stage === 0 ? 2.02 + 0.25 * Math.sin(b) : 1.7 + 0.3 * Math.sin(b);
    result[offset] = Math.cos(a) * radius;
    result[offset + 1] = Math.sin(a) * radius * (stage === 0 ? 0.93 : 0.62);
    result[offset + 2] = Math.cos(b) * 0.7 + Math.sin(a * 3) * 0.28;
  } else if (stage === 1) {
    result[offset] = (t - 0.5) * 5.6;
    result[offset + 1] =
      Math.sin(a * 2 + Math.sin(b) * 0.3) * 0.8 + Math.cos(b) * 0.24;
    result[offset + 2] = Math.cos(a * 2) * 0.5 + Math.sin(b) * 0.7;
  } else if (stage === 2) {
    const column = (offset / 3) % 40,
      row = Math.floor(offset / 120);
    result[offset] = (column / 39 - 0.5) * 4.2;
    result[offset + 1] = Math.sin(row * 1.7) * 1.5;
    result[offset + 2] =
      Math.cos(row * 1.7) * 0.7 + Math.sin(column * 0.45) * 0.25;
  } else {
    const radius = 1.25 + Math.abs(Math.cos(a * 4)) * 0.7;
    result[offset] = Math.cos(a) * radius;
    result[offset + 1] = Math.sin(a) * radius;
    result[offset + 2] = Math.sin(b) * 1.1;
  }
  return -1;
}
