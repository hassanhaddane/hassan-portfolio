import type { CSSProperties } from "react";

const nodes = Array.from({ length: 56 }, (_, index) => ({
  left: `${5 + (index % 14) * 7}%`,
  top: `${15 + Math.floor(index / 14) * 22}%`,
  delay: `${(index % 14) * 17}ms`,
}));

export function CinematicTransition() {
  return (
    <div className="intro-transition" aria-hidden="true">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <path d="M-80 558 C 175 552, 262 374, 494 370 S 940 149, 1260 62" />
        <path d="M-80 580 C 160 540, 309 436, 506 401 S 975 208, 1260 120" />
        <path d="M-80 600 C 181 560, 324 481, 527 438 S 990 253, 1260 172" />
      </svg>
      <div className="intro-transition__nodes">
        {nodes.map((node, index) => <i key={index} style={{
          "--node-x": node.left,
          "--node-y": node.top,
          "--node-delay": node.delay,
        } as CSSProperties} />)}
      </div>
    </div>
  );
}
