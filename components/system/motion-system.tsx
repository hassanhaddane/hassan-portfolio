"use client";

import { useEffect, useRef } from "react";
import { usePreferences } from "./preferences";

export function MotionSystem() {
  const { mode, motion } = usePreferences();
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!motion) return;
    const finePointer = matchMedia("(pointer: fine) and (hover: hover)");
    if (!finePointer.matches) return;
    const exploreMotion = mode === "explore";
    const cursorElement = cursor.current;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.15 },
    );
    const pendingReveals: HTMLElement[] = [];
    if (exploreMotion) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((element) => {
        if (element.getBoundingClientRect().top > innerHeight) {
          element.dataset.revealed = "false";
          observer.observe(element);
          pendingReveals.push(element);
        }
      });
    }
    const revealVisible = () => {
      pendingReveals.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < innerHeight * 0.96 && bounds.bottom > 0) {
          element.dataset.revealed = "true";
          observer.unobserve(element);
        }
      });
    };
    let revealFrame = 0;
    let settleFrame = 0;
    if (exploreMotion) {
      revealFrame = requestAnimationFrame(() => {
        settleFrame = requestAnimationFrame(revealVisible);
      });
      window.addEventListener("hashchange", revealVisible);
    }
    const magnetic = exploreMotion
      ? [...document.querySelectorAll<HTMLElement>(".magnetic")]
      : [];
    let boxes = magnetic.map((element) => element.getBoundingClientRect());
    const measure = () => {
      boxes = magnetic.map((element) => element.getBoundingClientRect());
    };
    if (magnetic.length) {
      window.addEventListener("scroll", measure, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
    }
    let raf = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      cancelAnimationFrame(raf);
      const x = event.clientX,
        y = event.clientY;
      const target = event.target as HTMLElement;
      raf = requestAnimationFrame(() => {
        if (cursorElement) {
          if (target.closest("input, textarea, [contenteditable='true']")) {
            cursorElement.style.opacity = "0";
            return;
          }
          const labelledTarget = target.closest<HTMLElement>("[data-cursor]");
          const interactiveTarget = target.closest("a,button,summary");
          const label = labelledTarget?.dataset.cursor ?? "";
          cursorElement.style.transform = `translate3d(${x - (label ? 31 : 16)}px,${y - 16}px,0)`;
          cursorElement.style.opacity = "1";
          cursorElement.dataset.hover = interactiveTarget ? "true" : "false";
          cursorElement.dataset.label = label;
        }
        magnetic.forEach((element, index) => {
          const box = boxes[index];
          const dx = x - box.left - box.width / 2,
            dy = y - box.top - box.height / 2;
          element.style.translate =
            Math.abs(dx) < box.width / 2 + 20 &&
            Math.abs(dy) < box.height / 2 + 20
              ? `${dx * 0.06}px ${dy * 0.09}px`
              : "0 0";
        });
      });
    };
    const leave = () => {
      if (cursorElement) cursorElement.style.opacity = "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(revealFrame);
      cancelAnimationFrame(settleFrame);
      observer.disconnect();
      window.removeEventListener("hashchange", revealVisible);
      window.removeEventListener("pointermove", move);
      if (magnetic.length) {
        window.removeEventListener("scroll", measure);
        window.removeEventListener("resize", measure);
      }
      document.removeEventListener("pointerleave", leave);
      magnetic.forEach((element) => {
        element.style.translate = "";
      });
      document
        .querySelectorAll("[data-revealed]")
        .forEach((element) => element.removeAttribute("data-revealed"));
      if (cursorElement) cursorElement.style.opacity = "0";
    };
  }, [mode, motion]);
  return (
    <>
      <div ref={cursor} className="custom-cursor" data-label="" aria-hidden="true" />
    </>
  );
}
