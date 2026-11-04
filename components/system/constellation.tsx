"use client";

import { useEffect, useRef, useState } from "react";
import { organismPoint, stageIndex } from "@/lib/constellation-shapes";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import type {
  ConstellationController,
  SceneState,
} from "@/lib/constellation-engine";
import { useActiveSection, usePreferences } from "./preferences";

const strands = Array.from({ length: 12 }, (_, strand) =>
  Array.from({ length: 28 }, (_, i) => {
    const [x, y] = organismPoint(strand, i / 27);
    return `${i ? "L" : "M"}${(700 + x * 105).toFixed(2)},${(450 - y * 105).toFixed(2)}`;
  }).join(" "),
);

/** Vector first. Optional WebGL only in visible scenes on capable fine-pointer desktops. */
export function Constellation() {
  const { motion } = usePreferences();
  const activeSection = useActiveSection();
  const [webgl, setWebgl] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<SceneState>({ stage: 0, x: 0, y: 0, scrollSpeed: 0 });
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
    setWebgl(false);
    const media = matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (hover: hover)",
    );
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: EventTarget & { saveData?: boolean };
    };
    let controller: ConstellationController | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let generation = 0;
    let loading = false;
    let disposed = false;
    const visible = new Set<Element>();
    const eligible = () =>
      motion &&
      media.matches &&
      !nav.connection?.saveData &&
      (nav.hardwareConcurrency ?? 4) >= 8 &&
      (nav.deviceMemory ?? 4) >= 8;
    const boot = async () => {
      if (
        disposed ||
        controller ||
        loading ||
        !visible.size ||
        !eligible() ||
        document.documentElement.dataset.introPending === "true"
      )
        return;
      loading = true;
      const request = generation;
      try {
        const { createConstellation } = await import(
          "@/lib/constellation-engine"
        );
        if (
          disposed ||
          request !== generation ||
          !canvas.current ||
          !eligible()
        )
          return;
        delete canvas.current.dataset.failed;
        controller = createConstellation(canvas.current, scene, "normal");
        controller.setVisible(visible.size > 0);
        setWebgl(true);
      } catch {
        /* The vector score remains the designed fallback. */
      } finally {
        loading = false;
      }
    };
    const schedule = () => {
      clearTimeout(timer);
      controller?.setVisible(visible.size > 0);
      if (visible.size && !controller)
        timer = setTimeout(() => void boot(), 900);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        schedule();
      },
      { rootMargin: "60px 0px" },
    );
    document
      .querySelectorAll("#profil,#stack")
      .forEach((section) => observer.observe(section));
    const settingsChanged = () => {
      generation++;
      clearTimeout(timer);
      controller?.dispose();
      controller = undefined;
      setWebgl(false);
      schedule();
    };
    media.addEventListener("change", settingsChanged);
    nav.connection?.addEventListener("change", settingsChanged);
    addEventListener("lowkyz:intro-complete", schedule);
    return () => {
      disposed = true;
      generation++;
      clearTimeout(timer);
      controller?.dispose();
      observer.disconnect();
      media.removeEventListener("change", settingsChanged);
      nav.connection?.removeEventListener("change", settingsChanged);
      removeEventListener("lowkyz:intro-complete", schedule);
    };
  }, [motion]);
  return (
    <div
      className={`organism-field ${webgl ? "webgl-ready" : ""}`}
      data-renderer={webgl ? "webgl" : "vector"}
      aria-hidden="true"
    >
      <svg
        className="organism-vector"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {strands.map((d, i) => (
          <path className="fiber-path" d={d} key={i} />
        ))}
      </svg>
      <canvas ref={canvas} className="organism-canvas" />
    </div>
  );
}
