/** Compact cubic score, with one drawing definition per document. */
const coordinate = (value: number) => value.toFixed(1);
const score =
  Array.from({ length: 19 }, (_, index) => {
    const amplitude = 18 + index * 5.1;
    const y = (t: number) =>
      235 +
      Math.sin(15.96 * t) *
        Math.pow(Math.max(0, Math.sin(Math.PI * t)), 1.3) *
        amplitude;
    const slope = (t: number) => (y(t + 0.001) - y(t - 0.001)) / 0.002;
    const x = (t: number) => 35 + 532 * t;
    const segments = 15;
    const step = 1 / segments / 3;
    return (
      "M35 235" +
      Array.from({ length: segments }, (_, i) => {
        const a = i / segments,
          b = (i + 1) / segments;
        return `C${coordinate(x(a + step))} ${coordinate(y(a) + slope(a) * step)} ${coordinate(x(b - step))} ${coordinate(y(b) - slope(b) * step)} ${coordinate(x(b))} ${coordinate(y(b))}`;
      }).join("")
    );
  }).join("") +
  "M20 235H580M300 35V425m274-194 6 4-6 4M296 41l4-6 4 6" +
  Array.from({ length: 21 }, (_, i) => `M296 ${45 + i * 18}h8`).join("");

export function SignalArtwork({ reference = false }: { reference?: boolean }) {
  return (
    <svg
      className="signal-score"
      viewBox="0 0 600 460"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        className="signal-disc"
        cx="300"
        cy="230"
        rx="272"
        ry="166"
        transform="rotate(-38 300 230)"
      />
      <g className="signal-waves" stroke="currentColor" strokeWidth="1.1">
        {reference ? (
          <use href="#lowkyz-score-lines" />
        ) : (
          <path id="lowkyz-score-lines" d={score} />
        )}
      </g>
      <circle cx="300" cy="235" r="5" fill="currentColor" />
    </svg>
  );
}
