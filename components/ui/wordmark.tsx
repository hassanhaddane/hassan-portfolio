/** Bespoke single-stroke lettering; shared diagonals link code and rhythm. */
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
        <path d="M5 5V42H31M46 5H70V42H46ZM85 5L92 42L103 20L114 42L121 5M138 5V42M140 25L161 5M141 23L164 42M177 5L192 24L207 5M192 24V42M221 5H254L222 42H257" />
      </g>
    </svg>
  );
}
