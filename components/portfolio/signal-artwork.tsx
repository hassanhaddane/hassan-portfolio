/** Deterministic vector score: a family of waves sharing one live frequency. */
export function SignalArtwork() {
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
        {Array.from({ length: 19 }, (_, index) => {
          const points = Array.from({ length: 141 }, (_, step) => {
            const x = 35 + step * 3.8;
            const envelope = Math.pow(Math.sin((step / 140) * Math.PI), 1.3);
            const y =
              235 + Math.sin(step * 0.114) * envelope * (18 + index * 5.1);
            return `${step ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ");
          return <path key={index} d={points} />;
        })}
        <path d="M20 235H580M300 35V425" />
        <path d="m574 231 6 4-6 4M296 41l4-6 4 6" />
        {Array.from({ length: 21 }, (_, i) => (
          <path key={i} d={`M296 ${45 + i * 18}h8`} />
        ))}
      </g>
      <circle cx="300" cy="235" r="5" fill="currentColor" />
    </svg>
  );
}
