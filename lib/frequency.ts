/** Deterministic geometry shared by the intro, hero and ambient field. */
export const wordmarkGlyphs = [
  "M5 5V42H31",
  "M46 5H70V42H46Z",
  "M85 5L92 42L103 20L114 42L121 5",
  "M138 5V42M140 25L161 5M141 23L164 42",
  "M177 5L192 24L207 5M192 24V42",
  "M221 5H254L222 42H257",
] as const;

export const frequencyBars = Array.from({ length: 61 }, (_, index) => {
  const envelope = Math.sin((index / 60) * Math.PI);
  const height = Math.max(
    6,
    7 +
      Math.pow(envelope, 1.5) *
        (45 + Math.sin(index * 0.63) * 35 + Math.cos(index * 0.27) * 40),
  );
  return {
    x: 20 + index * 6,
    height: Number(height.toFixed(2)),
    top: Number((110 - height / 2).toFixed(2)),
  };
});
