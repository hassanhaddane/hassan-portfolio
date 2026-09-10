function noise(n: number) {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

// Seven families of continuous filaments. The pinch and fork form LOWKYZ's signature.
export function organismPoint(strand: number, t: number) {
  const phase = strand * 2.39996;
  const spread = 0.16 + Math.pow(Math.abs(t - 0.48) * 2, 1.6) * 1.45;
  const wave = Math.sin(t * Math.PI * 2 + phase);
  return [
    (t - 0.5) * 11.5 + Math.sin(t * 6.28 + phase) * 0.24,
    (t - 0.5) * 3.9 + wave * spread + Math.sin(t * 12.56 + phase) * 0.14,
    Math.cos(t * 6.28 + phase) * spread * 0.58,
  ];
}

export const stageIndex: Record<string, number> = {
  profil: 0,
  projets: 1,
  experience: 2,
  stack: 3,
  education: 4,
  about: 5,
  contact: 6,
};

export function stagePoint(i: number, count: number, stage: number) {
  const length = 40;
  const strand = Math.floor(i / length);
  const t = (i % length) / (length - 1);
  if (stage === 0) return organismPoint(strand, t);
  const a = t * Math.PI * 2;
  const phase = strand * 2.39996;
  if (stage === 1) {
    const radius = 0.18 + t * (1.8 + noise(strand) * 1.4);
    return [
      Math.cos(a + strand) * radius + 1.6,
      Math.sin(a + strand) * radius * 0.65,
      (noise(strand) - 0.5) * t,
    ];
  }
  if (stage === 2)
    return [
      (t - 0.5) * 9,
      (strand % 4) * 0.85 - 1.3 + noise(strand) * 0.16,
      noise(strand) * 0.4,
    ];
  if (stage === 3) {
    const angle = ((strand % 7) / 7) * Math.PI * 2;
    return [
      Math.cos(angle) * 3 + Math.cos(a) * 0.45,
      Math.sin(angle) * 2 + Math.sin(a) * 0.45,
      (noise(strand) - 0.5) * 0.7,
    ];
  }
  if (stage === 4) {
    const radius = 1.5 + Math.sin(t * Math.PI) * 0.6;
    return [
      Math.cos(a) * radius,
      Math.sin(a) * radius * 0.7,
      Math.sin(strand) * 0.4,
    ];
  }
  if (stage === 5) {
    const breath = Math.sin(a + phase) * (0.38 + noise(strand) * 0.42);
    return [
      (t - 0.5) * 8.4,
      breath + ((strand % 7) - 3) * 0.17,
      Math.cos(a * 0.5 + phase) * 0.32,
    ];
  }
  const radius = t * t * 3.5;
  return [
    Math.cos(a + strand) * radius,
    Math.sin(a + strand) * radius * 0.75,
    noise(strand) * radius * 0.3,
  ];
}
