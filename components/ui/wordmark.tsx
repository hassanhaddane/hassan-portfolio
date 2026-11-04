import type { CSSProperties } from "react";
import { wordmarkGlyphs } from "@/lib/frequency";

/** Original LOWKYZ lettering. Separate strokes also serve the signature reveal. */
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
        {wordmarkGlyphs.map((d, index) => (
          <path
            key={d}
            d={d}
            pathLength="1"
            style={{ "--glyph-delay": `${index * 45}ms` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
