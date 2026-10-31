"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type TouchEvent } from "react";

const letters = [..."LOWKYZ"];
const particles = Array.from({ length: 72 }, (_, index) => {
  const column = index % 12;
  const row = Math.floor(index / 12);
  return {
    x: 8 + column * 7.6 + ((index * 37) % 11) * 0.22,
    y: 19 + row * 12.2 + ((index * 19) % 9) * 0.31,
    delay: (index % 9) * 34,
  };
});

export function LogoReveal() {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const move = (clientX: number, clientY: number) => {
    const element = root.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--intro-pointer-x", `${x * 100}%`);
      element.style.setProperty("--intro-pointer-y", `${y * 100}%`);
      element.style.setProperty("--intro-magnet-x", `${(x - 0.5) * 12}px`);
      element.style.setProperty("--intro-magnet-y", `${(y - 0.5) * 8}px`);
    });
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      root.current?.style.setProperty("--intro-magnet-x", "0px");
      root.current?.style.setProperty("--intro-magnet-y", "0px");
    });
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => move(event.clientX, event.clientY);
  const touchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (touch) move(touch.clientX, touch.clientY);
  };

  return (
    <div className="intro-logo" ref={root} onPointerMove={pointerMove} onPointerLeave={reset} onTouchMove={touchMove} onTouchEnd={reset} aria-hidden="true">
      <div className="intro-logo__orbit intro-logo__orbit--outer" />
      <div className="intro-logo__orbit intro-logo__orbit--inner" />
      <div className="intro-logo__particles">
        {particles.map((particle, index) => (
          <i key={index} style={{
            "--particle-x": `${particle.x}%`,
            "--particle-y": `${particle.y}%`,
            "--particle-delay": `${particle.delay}ms`,
          } as CSSProperties} />
        ))}
      </div>
      <div className="intro-logo__wordmark">
        <span className="intro-logo__outline">LOWKYZ</span>
        <span className="intro-logo__glyphs">
          {letters.map((letter, index) => (
            <span key={index} style={{ "--glyph-index": index } as CSSProperties}>{letter}</span>
          ))}
        </span>
      </div>
      <span className="intro-logo__spark" />
    </div>
  );
}
