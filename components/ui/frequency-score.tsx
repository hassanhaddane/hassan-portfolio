import { frequencyBars } from "@/lib/frequency";

export function RhythmScore({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`rhythm-score ${className}`}
      viewBox="0 0 400 220"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 110H380M200 15V205" className="score-axis" />
      {[35, 65, 95].map((r) => (
        <ellipse
          key={r}
          cx="200"
          cy="110"
          rx={r * 1.8}
          ry={r}
          className="score-orbit"
        />
      ))}
      <g className="score-bars">
        {frequencyBars.map(({ x, height, top }, i) => (
          <path
            key={x}
            d={`M${x} ${top}v${height}`}
            style={{ animationDelay: `${i * 8}ms` }}
          />
        ))}
      </g>
      <path
        d="M20 20v8m0-4h8M380 20v8m-8-4h8M20 192v8m0-4h8M380 192v8m-8-4h8"
        className="score-register"
      />
    </svg>
  );
}
