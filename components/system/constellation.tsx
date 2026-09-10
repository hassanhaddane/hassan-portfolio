"use client";

import { memo, useEffect, useRef, useState } from "react";
import { organismPoint, stageIndex } from "@/lib/constellation-shapes";
import { technologies, useFieldSignal } from "@/lib/field-signal";
import { useWorkSignal } from "@/lib/work-signal";
import type { SceneState } from "@/lib/constellation-engine";
import { useActiveSection, usePreferences } from "./preferences";

type PerformanceTier = "high" | "normal" | "low" | "reduced";

const strands = Array.from({ length: 28 }, (_, strand) => {
  const nodes = Array.from({ length: 32 }, (_, i) => {
    const [x, y] = organismPoint(strand, i / 31);
    return {
      x: Number((700 + x * 105).toFixed(2)),
      y: Number((450 - y * 105).toFixed(2)),
    };
  });
  return {
    family: strand % 7,
    nodes,
    path: nodes
      .map(({ x, y }, i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" "),
  };
});

const StaticOrganism = memo(function StaticOrganism() {
  return (
    <svg
      className="organism-vector"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: 7 }, (_, family) => (
        <g key={family} data-family={family}>
          {strands
            .filter((strand) => strand.family === family)
            .map(({ path, nodes }, i) => (
              <g key={i}>
                <path d={path} className="fiber-path" />
                <path d={path} className="fiber-trail" />
                {nodes
                  .filter((_, n) => n % 5 === family % 5)
                  .map(({ x, y }, n) => (
                    <circle
                      key={n}
                      cx={x}
                      cy={y}
                      r={n % 3 ? 1.1 : 2.1}
                      className="fiber-node"
                    />
                  ))}
              </g>
            ))}
        </g>
      ))}
    </svg>
  );
});

export function Constellation() {
  const { mode, motion } = usePreferences();
  const activeSection = useActiveSection();
  const signal = useFieldSignal();
  const workSignal = useWorkSignal();
  const [webgl, setWebgl] = useState(false);
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>("low");
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<HTMLDivElement>(null);
  const storyPath = useRef<SVGPathElement>(null);
  const storyHead = useRef<SVGGElement>(null);
  const scene = useRef<SceneState>({
    stage: 0,
    x: 0,
    y: 0,
    scrollSpeed: 0,
    introProgress: 0,
    workStage: 1,
    contactStrength: 0,
    contactX: 0,
    contactY: 0,
  });
  useEffect(() => {
    scene.current.workStage = {
      greecheck: 1,
      iaudiogram: 2,
      sante: 4,
      biosency: 3,
    }[workSignal];
  }, [workSignal]);
  useEffect(() => {
    const attract = (event: Event) => {
      const detail = (event as CustomEvent<{ strength: number; x: number; y: number }>).detail;
      scene.current.contactStrength = Math.max(0, Math.min(1, detail?.strength ?? 0));
      scene.current.contactX = detail?.x ?? 0;
      scene.current.contactY = detail?.y ?? 0;
    };
    window.addEventListener("lowkyz:contact-attract", attract);
    return () => window.removeEventListener("lowkyz:contact-attract", attract);
  }, []);
  useEffect(() => {
    if (!motion) return;
    const fieldElement = field.current;
    const root = document.documentElement;
    let pointerFrame = 0,
      scrollFrame = 0,
      velocityFrame = 0,
      x = 0,
      y = 0;
    let cssVelocity = 0,
      signalPathLength = 0;
    let lastY = scrollY,
      lastTime = performance.now();
    let anchors: Array<{ id: string; stage: number; center: number; top: number; height: number }> = [];

    const measure = () => {
      anchors = [...document.querySelectorAll<HTMLElement>("[data-section]")]
        .map((section) => ({
          id: section.id,
          stage: stageIndex[section.id],
          center: section.offsetTop + section.offsetHeight * 0.5,
          top: section.offsetTop,
          height: section.offsetHeight,
        }))
        .filter((section) => Number.isFinite(section.stage));
      signalPathLength = storyPath.current?.getTotalLength() ?? 0;
    };

    const updateStory = () => {
      scrollFrame = 0;
      if (!anchors.length) measure();
      const readingPoint = scrollY + innerHeight * 0.42;
      let stage = anchors[0]?.stage ?? 0;
      let current = anchors[0];
      for (let index = 0; index < anchors.length; index++) {
        const anchor = anchors[index];
        const next = anchors[index + 1];
        if (readingPoint >= anchor.top) current = anchor;
        if (!next || readingPoint <= next.center) {
          const span = Math.max(1, (next?.center ?? anchor.center) - anchor.center);
          const progress = Math.max(0, Math.min(1, (readingPoint - anchor.center) / span));
          stage = anchor.stage + ((next?.stage ?? anchor.stage) - anchor.stage) * progress;
          break;
        }
      }
      const documentRange = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const overall = Math.max(0, Math.min(1, scrollY / documentRange));
      const sectionProgress = current
        ? Math.max(0, Math.min(1, (readingPoint - current.top) / Math.max(1, current.height)))
        : 0;
      scene.current.stage = stage;
      scene.current.introProgress = Math.min(1, scrollY / innerHeight);
      root.style.setProperty("--story-progress", overall.toFixed(4));
      root.style.setProperty("--section-progress", sectionProgress.toFixed(4));
      root.style.setProperty(
        "--section-shift",
        `${((sectionProgress - 0.5) * 14).toFixed(2)}px`,
      );
      root.style.setProperty("--story-dash", (1120 - overall * 1120).toFixed(2));
      if (storyHead.current && storyPath.current && signalPathLength > 0) {
        const point = storyPath.current.getPointAtLength(overall * signalPathLength);
        storyHead.current.setAttribute(
          "transform",
          `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
        );
      }
    };

    const settleVelocity = () => {
      const energy = Math.min(1, Math.abs(cssVelocity) * 0.52);
      root.style.setProperty("--story-velocity", energy.toFixed(3));
      root.style.setProperty("--story-stroke", `${(2 + energy * 1.4).toFixed(2)}px`);
      root.style.setProperty("--story-glow", `${(6 + energy * 8).toFixed(2)}px`);
      root.style.setProperty("--story-stretch", (1 + energy * 0.025).toFixed(4));
      root.style.setProperty(
        "--signal-shift",
        `${Math.max(-11, Math.min(11, cssVelocity * 2.4)).toFixed(2)}px`,
      );
      cssVelocity *= 0.82;
      if (Math.abs(cssVelocity) > 0.008) {
        velocityFrame = requestAnimationFrame(settleVelocity);
      } else {
        velocityFrame = 0;
        root.style.setProperty("--story-velocity", "0");
        root.style.setProperty("--story-stroke", "2px");
        root.style.setProperty("--story-glow", "6px");
        root.style.setProperty("--story-stretch", "1");
        root.style.setProperty("--signal-shift", "0px");
      }
    };

    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = (event.clientX / innerWidth) * 2 - 1;
      y = (event.clientY / innerHeight) * 2 - 1;
      scene.current.x = x;
      scene.current.y = y;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        fieldElement?.style.setProperty("--field-x", `${x * 8}px`);
        fieldElement?.style.setProperty("--field-y", `${y * 5}px`);
        root.style.setProperty("--pointer-drift-x", `${(x * 5).toFixed(2)}px`);
        root.style.setProperty("--pointer-drift-y", `${(y * 4).toFixed(2)}px`);
        root.style.setProperty("--pointer-tilt-x", `${(y * -0.32).toFixed(3)}deg`);
        root.style.setProperty("--pointer-tilt-y", `${(x * 0.42).toFixed(3)}deg`);
        pointerFrame = 0;
      });
    };
    const scroll = () => {
      const now = performance.now();
      scene.current.scrollSpeed =
        (scrollY - lastY) / Math.max(now - lastTime, 1);
      cssVelocity = scene.current.scrollSpeed;
      lastY = scrollY;
      lastTime = now;
      root.dataset.storyDirection = scene.current.scrollSpeed < -0.02 ? "up" : "down";
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStory);
      if (!velocityFrame) velocityFrame = requestAnimationFrame(settleVelocity);
    };
    const resize = () => {
      measure();
      updateStory();
    };
    measure();
    updateStory();
    addEventListener("pointermove", pointer, { passive: true });
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(pointerFrame);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(velocityFrame);
      removeEventListener("pointermove", pointer);
      removeEventListener("scroll", scroll);
      removeEventListener("resize", resize);
      fieldElement?.style.removeProperty("--field-x");
      fieldElement?.style.removeProperty("--field-y");
      [
        "--story-progress",
        "--section-progress",
        "--section-shift",
        "--story-dash",
        "--story-velocity",
        "--story-stroke",
        "--story-glow",
        "--story-stretch",
        "--signal-shift",
        "--pointer-drift-x",
        "--pointer-drift-y",
        "--pointer-tilt-x",
        "--pointer-tilt-y",
      ].forEach((property) => root.style.removeProperty(property));
      delete root.dataset.storyDirection;
    };
  }, [motion]);
  useEffect(() => {
    const media = matchMedia("(min-width: 800px) and (pointer: fine)");
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const getTier = (): PerformanceTier => {
      if (!motion) return "reduced";
      if (!media.matches || nav.connection?.saveData) return "low";
      const cores = nav.hardwareConcurrency ?? 4;
      const memory = nav.deviceMemory ?? 4;
      if (cores >= 8 && memory >= 8) return "high";
      if (cores >= 4 && memory >= 4) return "normal";
      return "low";
    };
    let dispose: (() => void) | undefined,
      disposed = false,
      generation = 0;
    setWebgl(false);
    const boot = async () => {
      const request = ++generation;
      const tier = getTier();
      setPerformanceTier(tier);
      document.documentElement.dataset.performance = tier;
      if (mode !== "explore" || (tier !== "high" && tier !== "normal") || !canvas.current)
        return;
      try {
        const { createConstellation } =
          await import("@/lib/constellation-engine");
        if (
          disposed ||
          request !== generation ||
          getTier() !== tier ||
          !canvas.current
        )
          return;
        delete canvas.current.dataset.failed;
        dispose = createConstellation(canvas.current, scene, tier);
        setWebgl(true);
      } catch {
        if (!disposed) setWebgl(false);
      }
    };
    // Leave the initial identity paint free; there is already an immediate vector field.
    const idle = window.setTimeout(() => void boot(), 160);
    const changed = () => {
      clearTimeout(idle);
      dispose?.();
      dispose = undefined;
      setWebgl(false);
      void boot();
    };
    media.addEventListener("change", changed);
    return () => {
      disposed = true;
      clearTimeout(idle);
      dispose?.();
      media.removeEventListener("change", changed);
    };
  }, [mode, motion]);
  return (
    <>
      <div
        ref={field}
        className={`organism-field stage-${activeSection} ${webgl ? "webgl-ready" : ""}`}
        data-performance={performanceTier}
        data-signal={signal ? technologies.indexOf(signal) : -1}
        data-work={workSignal}
        aria-hidden="true"
      >
        <StaticOrganism />
        <canvas ref={canvas} className="organism-canvas" />
      </div>
      <svg
        className={`foreground-filament stage-${activeSection} ${activeSection === "profil" ? "is-intro" : ""}`}
        width="100%"
        height="100%"
        style={{ position: "fixed", top: 0, pointerEvents: "none", overflow: "hidden" }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <path className="foreground-filament-ambient" d={strands[4].path} />
        <path className="foreground-filament-ambient" d={strands[18].path} />
        <path
          ref={storyPath}
          className="story-signal-base"
          d="M1188 -90 C1110 95 1270 185 1175 340 S1080 590 1200 990"
        />
        <path
          className="story-signal-pulse"
          d="M1188 -90 C1110 95 1270 185 1175 340 S1080 590 1200 990"
        />
        <g ref={storyHead} className="story-signal-head">
          <circle className="story-signal-head-halo" r="13" />
          <circle className="story-signal-head-core" r="3.2" />
        </g>
      </svg>
    </>
  );
}
