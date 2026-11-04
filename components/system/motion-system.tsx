"use client";

import { useEffect } from "react";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import { usePreferences } from "./preferences";

type Layer = {
  element: HTMLElement;
  top: number;
  height: number;
  depth: number;
};

/** One grammar, one event-driven RAF. Layout is measured at resize, never per scroll frame. */
export function MotionSystem() {
  const { motion } = usePreferences();
  useEffect(() => {
    if (!motion) return;
    const root = document.documentElement;
    const fine = matchMedia(
      "(min-width: 901px) and (pointer: fine) and (hover: hover)",
    );
    const reveals = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const parallax = [
      ...document.querySelectorAll<HTMLElement>("[data-motion-parallax]"),
    ];
    const layers: Layer[] = [];
    let visible = true;
    let measureFrame = 0;
    let target: HTMLElement | null = null;
    let targetBox: DOMRect | null = null;
    let magnet: HTMLElement | null = null;
    let magnetBox: DOMRect | null = null;
    const clearPreview = () => {
      if (target) {
        target.style.removeProperty("--preview-x");
        target.style.removeProperty("--preview-y");
        delete target.dataset.pointer;
      }
      target = null;
      targetBox = null;
      magnet?.style.removeProperty("translate");
      magnet = null;
      magnetBox = null;
    };
    const measure = () => {
      measureFrame = 0;
      layers.length = 0;
      parallax.forEach((element) => {
        const box = element.getBoundingClientRect();
        layers.push({
          element,
          top: box.top + scrollY,
          height: box.height,
          depth: Math.max(
            -1,
            Math.min(1, Number(element.dataset.motionParallax) || 0),
          ),
        });
      });
      clearPreview();
    };
    const queueMeasure = () => {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        }),
      { threshold: 0.04, rootMargin: "0px 0px 3% 0px" },
    );
    reveals.forEach((element) => {
      if (element.getBoundingClientRect().top > innerHeight * 0.96) {
        element.dataset.revealed = "false";
        observer.observe(element);
      }
    });
    const resizing = new ResizeObserver(queueMeasure);
    document
      .querySelectorAll("[data-section]")
      .forEach((section) => resizing.observe(section));
    measure();
    const settingsChanged = () => {
      if (!fine.matches) {
        clearPreview();
        layers.forEach(({ element }) =>
          element.style.removeProperty("--motion-parallax-y"),
        );
        root.style.removeProperty("--atmosphere-x");
        root.style.removeProperty("--atmosphere-y");
      } else queueMeasure();
    };
    fine.addEventListener("change", settingsChanged);
    const visibility = () => {
      visible = !document.hidden;
      root.dataset.pageHidden = String(!visible);
      if (!visible) clearPreview();
      else queueMeasure();
    };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const unsubscribe = subscribeMotionFrame((frame) => {
      if (!visible) return;
      if (frame.resized) queueMeasure();
      if (frame.scrolled || frame.resized) {
        const range = Math.max(
          1,
          document.documentElement.scrollHeight - frame.height,
        );
        root.style.setProperty(
          "--reading-progress",
          (frame.scrollY / range).toFixed(4),
        );
        if (fine.matches)
          layers.forEach(({ element, top, height, depth }) => {
            const y = top - frame.scrollY;
            if (y + height < -40 || y > frame.height + 40) return;
            const displacement = Math.max(
              -16,
              Math.min(16, (frame.height / 2 - y - height / 2) * depth * 0.12),
            );
            element.style.setProperty(
              "--motion-parallax-y",
              `${displacement.toFixed(2)}px`,
            );
          });
      }
      if (!frame.pointerChanged) return;
      if (
        !fine.matches ||
        frame.pointerType !== "mouse" ||
        !frame.pointerInside
      ) {
        clearPreview();
        return;
      }
      root.style.setProperty(
        "--atmosphere-x",
        `${((frame.pointerX / frame.width - 0.5) * 9).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--atmosphere-y",
        `${((frame.pointerY / frame.height - 0.5) * 6).toFixed(2)}px`,
      );
      const origin =
        frame.pointerTarget instanceof Element ? frame.pointerTarget : null;
      const next = origin?.closest<HTMLElement>(".work-image-link") ?? null;
      if (next !== target) {
        clearPreview();
        target = next;
        targetBox = next?.getBoundingClientRect() ?? null;
        if (next) next.dataset.pointer = "true";
      }
      if (target && targetBox) {
        target.style.setProperty(
          "--preview-x",
          `${Math.max(-5, Math.min(5, (frame.pointerX - targetBox.left - targetBox.width / 2) * 0.018)).toFixed(2)}px`,
        );
        target.style.setProperty(
          "--preview-y",
          `${Math.max(-4, Math.min(4, (frame.pointerY - targetBox.top - targetBox.height / 2) * 0.018)).toFixed(2)}px`,
        );
      }
      const nextMagnet = origin?.closest<HTMLElement>(".magnetic") ?? null;
      if (magnet !== nextMagnet) {
        magnet?.style.removeProperty("translate");
        magnet = nextMagnet;
        magnetBox = magnet?.getBoundingClientRect() ?? null;
      }
      if (magnet && magnetBox)
        magnet.style.translate = `${Math.max(-4, Math.min(4, (frame.pointerX - magnetBox.left - magnetBox.width / 2) * 0.04)).toFixed(2)}px ${Math.max(-3, Math.min(3, (frame.pointerY - magnetBox.top - magnetBox.height / 2) * 0.04)).toFixed(2)}px`;
    });
    const onHash = () => {
      reveals.forEach((element) => {
        if (element.dataset.revealed !== "false") return;
        const box = element.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0) {
          element.dataset.revealed = "true";
          observer.unobserve(element);
        }
      });
    };
    addEventListener("hashchange", onHash);
    return () => {
      unsubscribe();
      observer.disconnect();
      resizing.disconnect();
      cancelAnimationFrame(measureFrame);
      fine.removeEventListener("change", settingsChanged);
      document.removeEventListener("visibilitychange", visibility);
      removeEventListener("hashchange", onHash);
      clearPreview();
      reveals.forEach((element) => element.removeAttribute("data-revealed"));
      parallax.forEach((element) =>
        element.style.removeProperty("--motion-parallax-y"),
      );
      ["--reading-progress", "--atmosphere-x", "--atmosphere-y"].forEach(
        (property) => root.style.removeProperty(property),
      );
      delete root.dataset.pageHidden;
    };
  }, [motion]);
  return null;
}
