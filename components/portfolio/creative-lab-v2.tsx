"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { usePreferences } from "@/components/system/preferences";
import { creativeLabCopy } from "@/lib/personal-data";
import { ChapterIdentity } from "./narrative";

function SignalLab() {
  const { locale, motion, theme } = usePreferences();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const [enabled, setEnabled] = useState(true);
  const [supported, setSupported] = useState(true);
  const [frequency, setFrequency] = useState(3);
  const [energy, setEnergy] = useState(54);
  const running = enabled && motion;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) {
      setSupported(false);
      return;
    }
    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = false;
    const ink = theme === "dark" ? "#9eb7ff" : "#2457e6";
    const light = theme === "dark" ? "#c4f578" : "#426f00";
    const grid = theme === "dark" ? "rgba(145,171,255,.11)" : "rgba(36,87,230,.15)";

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = grid;
      for (let x = 0; x < width; x += 40) {
        context.beginPath(); context.moveTo(x + 0.5, 0); context.lineTo(x + 0.5, height); context.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        context.beginPath(); context.moveTo(0, y + 0.5); context.lineTo(width, y + 0.5); context.stroke();
      }
      const amplitude = (energy / 100) * Math.min(64, height * 0.24) * (0.65 + pointer.current.y * 0.7);
      const cycles = frequency + pointer.current.x * 1.4;
      for (let lane = -1; lane <= 1; lane++) {
        context.beginPath();
        context.strokeStyle = lane === 0 ? ink : grid;
        context.lineWidth = lane === 0 ? 1.7 : 1;
        for (let x = 0; x <= width; x += 3) {
          const envelope = Math.pow(Math.sin(Math.PI * x / width), 0.75);
          const wave = Math.sin((x / width) * Math.PI * 2 * cycles + time * 0.00055 + lane * 0.42);
          const y = height * 0.5 + lane * 23 + wave * amplitude * envelope;
          if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.fillStyle = light;
      for (let i = 0; i < 24; i++) {
        const x = (i + 0.5) * width / 24;
        const envelope = Math.pow(Math.sin(Math.PI * x / width), 0.75);
        const y = height * 0.5 + Math.sin((x / width) * Math.PI * 2 * cycles + time * 0.00055) * amplitude * envelope;
        context.fillRect(x - 1, y - 1, i % 6 === 0 ? 3 : 2, i % 6 === 0 ? 3 : 2);
      }
    };
    const tick = (time: number) => {
      frame = 0;
      render(time);
      if (running && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (running && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(0);
      schedule();
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    }, { threshold: 0.08 });
    if (observer) observer.observe(canvas);
    else visible = true;
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    addEventListener("visibilitychange", schedule);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      removeEventListener("visibilitychange", schedule);
    };
  }, [frequency, energy, running, theme]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!running) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    };
  };

  return (
    <article className="lab-v2-experiment lab-v2-signal" aria-labelledby="signal-lab-title">
      <header><span className="mono">01 / CANVAS 2D</span><h3 id="signal-lab-title">SIGNAL LAB</h3><p>{locale === "fr" ? "Une onde dessinée en temps réel. Le pointeur module la forme ; les réglages changent son rythme et son énergie." : "A real-time drawn wave. The pointer shapes it; the controls change its rhythm and energy."}</p></header>
      <div className="lab-v2-stage" onPointerMove={move} data-supported={supported}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <svg className="lab-v2-fallback" viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 C90 120 95 45 150 120 S210 195 270 120 S330 45 390 120 S450 195 510 120 S570 120 600 120" /></svg>
        <span className="mono lab-v2-stage-label">LOWKYZ / INPUT 01</span>
      </div>
      <div className="lab-v2-controls">
        <label>{locale === "fr" ? "Fréquence" : "Frequency"}<input type="range" min="1" max="5" step="1" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} aria-valuetext={`${frequency} / 5`} /></label>
        <label>{locale === "fr" ? "Énergie" : "Energy"}<input type="range" min="10" max="100" step="1" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} aria-valuetext={`${energy}%`} /></label>
        <button type="button" aria-pressed={running} disabled={!motion} onClick={() => setEnabled((value) => !value)}>{running ? (locale === "fr" ? "Mettre en pause" : "Pause") : (locale === "fr" ? "Activer" : "Play")}</button>
      </div>
      {!motion ? <p className="lab-v2-reduced">{locale === "fr" ? "Animation désactivée selon votre préférence de mouvement." : "Animation disabled by your motion preference."}</p> : null}
    </article>
  );
}

function TypeLab() {
  const { locale, motion } = usePreferences();
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [enabled, setEnabled] = useState(true);
  const [spacing, setSpacing] = useState(2);
  const [slant, setSlant] = useState(0);
  const running = enabled && motion;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  useEffect(() => {
    if (running) return;
    surface.current?.style.removeProperty("--type-pointer-x");
    surface.current?.style.removeProperty("--type-pointer-y");
  }, [running]);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!running) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      surface.current?.style.setProperty("--type-pointer-x", x.toFixed(3));
      surface.current?.style.setProperty("--type-pointer-y", y.toFixed(3));
    });
  };
  const reset = () => {
    cancelAnimationFrame(frame.current);
    surface.current?.style.removeProperty("--type-pointer-x");
    surface.current?.style.removeProperty("--type-pointer-y");
  };

  return (
    <article className="lab-v2-experiment lab-v2-type" aria-labelledby="type-lab-title">
      <header><span className="mono">02 / TYPE + SVG</span><h3 id="type-lab-title">TYPE LAB</h3><p>{locale === "fr" ? "Une grille typographique qui se décale avec le pointeur. Réglez l’espacement et l’inclinaison pour changer sa silhouette." : "A typographic grid that reacts to the pointer. Adjust spacing and slant to reshape its silhouette."}</p></header>
      <div className="lab-v2-stage lab-v2-type-stage" ref={surface} onPointerMove={move} onPointerLeave={reset} data-active={running} style={{ "--type-spacing": `${spacing}px`, "--type-slant": `${slant}deg` } as CSSProperties}>
        <span className="lab-v2-type-word" aria-label="LOWKYZ">{[..."LOWKYZ"].map((letter, index) => <span key={index} aria-hidden="true" style={{ "--glyph": index } as CSSProperties}>{letter}</span>)}</span>
        <svg viewBox="0 0 600 240" preserveAspectRatio="none" aria-hidden="true"><path d="M0 120 H600 M300 0 V240" /><circle cx="300" cy="120" r="68" /></svg>
        <span className="mono lab-v2-stage-label">LOWKYZ / GRID 02</span>
      </div>
      <div className="lab-v2-controls">
        <label>{locale === "fr" ? "Espacement" : "Spacing"}<input type="range" min="0" max="12" step="1" value={spacing} onChange={(event) => setSpacing(Number(event.target.value))} aria-valuetext={`${spacing} px`} /></label>
        <label>{locale === "fr" ? "Inclinaison" : "Slant"}<input type="range" min="-12" max="12" step="1" value={slant} onChange={(event) => setSlant(Number(event.target.value))} aria-valuetext={`${slant}°`} /></label>
        <button type="button" aria-pressed={running} disabled={!motion} onClick={() => setEnabled((value) => !value)}>{running ? (locale === "fr" ? "Désactiver" : "Disable") : (locale === "fr" ? "Activer" : "Enable")}</button>
      </div>
      {!motion ? <p className="lab-v2-reduced">{locale === "fr" ? "Interaction animée désactivée selon votre préférence de mouvement." : "Animated interaction disabled by your motion preference."}</p> : null}
    </article>
  );
}

export function CreativeLabV2() {
  const { locale } = usePreferences();
  return (
    <section id="lab" data-section tabIndex={-1} className="clarity-section section-shell section-space lab-v2" aria-labelledby="lab-title">
      <header className="clarity-section-header reveal" data-reveal="mask">
        <ChapterIdentity index="07" kind="lab" category={{ fr: "LAB", en: "LAB" }} title={{ fr: "EXPLORATIONS INTERACTIVES", en: "INTERACTIVE EXPLORATIONS" }} />
        <div className="clarity-section-heading"><span className="mono">REACT / TYPESCRIPT / CANVAS / SVG / WEBGL</span><h2 id="lab-title">{creativeLabCopy.title[locale]}</h2><p>{creativeLabCopy.introduction[locale]}</p></div>
      </header>
      <div className="lab-v2-grid"><SignalLab /><TypeLab /></div>
      <p className="lab-v2-background-note mono">{creativeLabCopy.background[locale]}</p>
    </section>
  );
}
