import { wordmarkGlyphs } from "@/lib/frequency";

/** Original geometric LOWKYZ lettering. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`lowkyz-wordmark ${className}`}
      viewBox="0 0 264 48"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="miter"
        strokeLinecap="square"
      >
        {wordmarkGlyphs.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
