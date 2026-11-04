"use client";

import { useEffect, useRef, useState } from "react";
import { organismPoint, stageIndex } from "@/lib/constellation-shapes";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import type { SceneState } from "@/lib/constellation-engine";
import { useActiveSection, usePreferences } from "./preferences";

const strands = Array.from({ length: 20 }, (_, strand) =>
  Array.from({ length: 32 }, (_, i) => {
    const [x, y] = organismPoint(strand, i / 31);
    return `${i ? "L" : "M"}${(700 + x * 105).toFixed(2)},${(450 - y * 105).toFixed(2)}`;
  }).join(" "),
);

/** Existing Three.js engine, deferred, with an immediate vector fallback. */
export function Constellation() {
  const { motion } = usePreferences();
  const activeSection = useActiveSection();
  const [webgl, setWebgl] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
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
    scene.current.stage = stageIndex[activeSection] ?? 0;
  }, [activeSection]);
  useEffect(() => {
    if (!motion) return;
    return subscribeMotionFrame((frame) => {
      if (frame.pointerChanged) {
        const strength =
          frame.pointerInside && frame.pointerType === "mouse" ? 1 : 0;
        scene.current.x = strength * ((frame.pointerX / frame.width) * 2 - 1);
        scene.current.y = strength * ((frame.pointerY / frame.height) * 2 - 1);
      }
      scene.current.scrollSpeed = frame.velocity;
    });
  }, [motion]);
  useEffect(() => {
    const media = matchMedia("(min-width: 800px) and (pointer: fine)");
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: EventTarget & { saveData?: boolean };
    };
    let dispose: (() => void) | undefined;
    let generation = 0;
    const boot = async () => {
      const request = ++generation;
      dispose?.();
      dispose = undefined;
      setWebgl(false);
      if (
        !motion ||
        !media.matches ||
        nav.connection?.saveData ||
        (nav.hardwareConcurrency ?? 4) < 4 ||
        (nav.deviceMemory ?? 4) < 4
      )
        return;
      try {
        const { createConstellation } = await import(
          "@/lib/constellation-engine"
        );
        if (request !== generation || !canvas.current) return;
        delete canvas.current.dataset.failed;
        dispose = createConstellation(canvas.current, scene, "normal");
        setWebgl(true);
      } catch {
        /* Vector fallback remains visible when WebGL is unavailable. */
      }
    };
    const idle = setTimeout(() => void boot(), 250);
    const change = () => {
      clearTimeout(idle);
      void boot();
    };
    media.addEventListener("change", change);
    nav.connection?.addEventListener("change", change);
    return () => {
      generation++;
      clearTimeout(idle);
      dispose?.();
      media.removeEventListener("change", change);
      nav.connection?.removeEventListener("change", change);
    };
  }, [motion]);
  return (
    <div
      className={`organism-field ${webgl ? "webgl-ready" : ""}`}
      aria-hidden="true"
    >
      <svg
        className="organism-vector"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {strands.map((path, i) => (
          <path className="fiber-path" d={path} key={i} />
        ))}
      </svg>
      <canvas ref={canvas} className="organism-canvas" />
    </div>
  );
}
