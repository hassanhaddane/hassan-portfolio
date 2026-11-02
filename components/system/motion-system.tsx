"use client";

import { useEffect, useRef } from "react";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import { usePreferences } from "./preferences";

/** Opt-in motion grammar: .reveal, [data-motion-parallax], and .magnetic. */
export function MotionSystem() {
  const { expressiveMotion: motion } = usePreferences();
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorElement = cursor.current;
    if (!motion) {
      document.querySelectorAll<HTMLElement>("[data-revealed]").forEach((element) => {
        element.removeAttribute("data-revealed");
      });
      if (cursorElement) cursorElement.style.opacity = "0";
      return;
    }

    const finePointer = matchMedia("(pointer: fine) and (hover: hover)");
    const pending = new Set<HTMLElement>();
    const reveals = [...document.querySelectorAll<HTMLElement>(".reveal")];
    const parallax = [...document.querySelectorAll<HTMLElement>("[data-motion-parallax]")];
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-revealed", "true");
        pending.delete(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      }),
      { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
    );
    reveals.forEach((element) => {
      if (element.hasAttribute("data-motion-stagger")) {
        [...element.children].forEach((child, index) => {
          (child as HTMLElement).style.setProperty("--stagger-index", String(Math.min(index, 12)));
        });
      }
      if (observer && element.getBoundingClientRect().top > innerHeight * 0.95) {
        element.dataset.revealed = "false";
        pending.add(element);
        observer.observe(element);
      }
    });

    let activeMagnet: HTMLElement | null = null;
    const revealAtViewport = () => pending.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top > innerHeight * 0.98 || bounds.bottom < 0) return;
      element.dataset.revealed = "true";
      pending.delete(element);
      observer?.unobserve(element);
    });
    const unsubscribe = subscribeMotionFrame((frame) => {
      if (frame.scrolled || frame.resized) {
        revealAtViewport();
        for (const element of parallax) {
          const box = element.getBoundingClientRect();
          if (box.bottom < 0 || box.top > frame.height) continue;
          const depth = Math.max(-1, Math.min(1, Number(element.dataset.motionParallax) || 0));
          const displacement = Math.max(-24, Math.min(24, (frame.height * 0.5 - box.top - box.height * 0.5) * depth * 0.14));
          element.style.setProperty("--motion-parallax-y", `${displacement.toFixed(2)}px`);
        }
      }
      if (!frame.pointerChanged) return;
      if (!finePointer.matches || frame.pointerType !== "mouse" || !frame.pointerInside) {
        if (cursorElement) cursorElement.style.opacity = "0";
        if (activeMagnet) activeMagnet.style.translate = "";
        activeMagnet = null;
        return;
      }
      const target = frame.pointerTarget instanceof Element ? frame.pointerTarget : null;
      const labelledTarget = target?.closest<HTMLElement>("[data-cursor]");
      const label = labelledTarget?.dataset.cursor ?? "";
      if (cursorElement) {
        cursorElement.style.opacity = target?.closest("input, textarea, [contenteditable='true']") ? "0" : "1";
        cursorElement.style.transform = `translate3d(${frame.pointerX - (label ? 31 : 16)}px,${frame.pointerY - 16}px,0)`;
        cursorElement.dataset.hover = target?.closest("a, button, summary") ? "true" : "false";
        cursorElement.dataset.label = label;
      }
      const magnet = target?.closest<HTMLElement>(".magnetic:not(:disabled)") ?? null;
      if (activeMagnet && activeMagnet !== magnet) activeMagnet.style.translate = "";
      activeMagnet = magnet;
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const x = Math.max(-8, Math.min(8, (frame.pointerX - box.left - box.width / 2) * 0.07));
        const y = Math.max(-6, Math.min(6, (frame.pointerY - box.top - box.height / 2) * 0.09));
        magnet.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
      }
    });
    const onHash = () => revealAtViewport();
    addEventListener("hashchange", onHash);
    return () => {
      unsubscribe();
      observer?.disconnect();
      removeEventListener("hashchange", onHash);
      activeMagnet?.style.removeProperty("translate");
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((element) => element.style.removeProperty("translate"));
      parallax.forEach((element) => element.style.removeProperty("--motion-parallax-y"));
      reveals.forEach((element) => {
        element.removeAttribute("data-revealed");
        [...element.children].forEach((child) => (child as HTMLElement).style.removeProperty("--stagger-index"));
      });
      if (cursorElement) cursorElement.style.opacity = "0";
    };
  }, [motion]);

  return <div ref={cursor} className="custom-cursor" data-label="" aria-hidden="true" />;
}
