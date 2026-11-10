"use client";

import { useEffect } from "react";
import { createSensorySession } from "./sensory-session";
import { createUniverseSession } from "./universe-session";
import { chapters } from "@/lib/experience-copy";
import { subscribeMotionFrame, invalidateMotionFrame } from "./motion-runtime";
import {
  clamp,
  mix,
  smooth,
  narrativeAt,
  sceneWords,
  caseSceneColors,
  type ChapterBounds,
} from "./scroll-narrative";

type TargetKind =
  | "identity"
  | "title"
  | "media"
  | "copy"
  | "skill"
  | "timeline"
  | "portrait"
  | "about"
  | "contact";
type Target = {
  element: HTMLElement;
  anchor: HTMLElement;
  kind: TargetKind;
  scene: number;
  index: number;
  top: number;
  height: number;
};
const fixed = (value: number) => value.toFixed(3);

/** One read phase on invalidation, one write phase per frame. No React scroll renders. */
export function useScrollNarrative(
  motion: boolean,
  setChapter: (id: string) => void,
) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-portfolio-root]");
    if (!root) return;
    const animated =
      motion &&
      document.documentElement.dataset.motion !== "off" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    const caseStudy = root.dataset.experience === "case";
    const sections = caseStudy
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-scene-section]"))
      : chapters
          .map((chapter) => root.querySelector<HTMLElement>(`#${chapter.id}`))
          .filter((section): section is HTMLElement => !!section);
    if (sections.length !== chapters.length) return;
    const washes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scene-wash]"),
    );
    const vessel = root.querySelector<HTMLElement>("[data-signal-vessel]");
    const word = root.querySelector<HTMLElement>("[data-narrative-word]");
    const nextWord = root.querySelector<HTMLElement>(
      "[data-narrative-next-word]",
    );
    const thread = root.querySelector<SVGPathElement>(
      "[data-narrative-thread]",
    );
    const meter = root.querySelector<HTMLElement>("[data-scroll-meter]");
    const readout = root.querySelector<HTMLElement>("[data-scroll-readout]");
    const dock = root.querySelector<SVGSVGElement>(
      ".hero-art > .signal-score, .case-signal-dock > .signal-score",
    );
    const heroTitle = root.querySelector<HTMLElement>(".hero h1 > span");
    let heroTitleRight = 0;
    const signature = root.querySelector<HTMLElement>(
      ".contact-signature-dock",
    );
    let signatureBox: {
      left: number;
      top: number;
      width: number;
      height: number;
    } | null = null;
    let projectBounds: { top: number; height: number }[] = [];
    const projectEntries = Array.from(
      root.querySelectorAll<HTMLElement>(".work-entry"),
    );
    let bounds: ChapterBounds[] = [];
    let maxScroll = 1;
    let dirty = true;
    let active = "";
    let percentage = -1;
    let theme = "";
    let backdrop = "";
    let sceneWord = "";
    let ambientTime = 0;
    let lastReading: ReturnType<typeof narrativeAt> | null = null;
    let dockBox = { left: 0, top: 0, width: 600, height: 460 };
    const targets: Target[] = [];
    function collect(
      selector: string,
      kind: TargetKind,
      scene: number,
      anchorSelector?: string,
    ) {
      sections[scene]
        .querySelectorAll<HTMLElement>(selector)
        .forEach((element, index) => {
          targets.push({
            element,
            kind,
            scene,
            index,
            anchor: anchorSelector
              ? (element.closest<HTMLElement>(anchorSelector) ??
                sections[scene])
              : sections[scene],
            top: 0,
            height: 0,
          });
          element.dataset.cinema = kind;
        });
    }
    if (caseStudy) {
      collect(".case-hero h1", "identity", 0);
      collect(".case-visual", "media", 0, ".case-visual");
      for (let scene = 1; scene < 6; scene++) {
        collect(".case-scene-heading h2, #links h2", "title", scene);
        collect(".case-chapter", "copy", scene, ".case-chapter");
        collect(
          ".case-gallery figure, .case-detail-capture",
          "media",
          scene,
          "figure",
        );
      }
    } else {
      collect(".hero-identity", "identity", 0);
      collect("h2", "title", 1);
      collect(".work-image-link", "media", 1, ".work-entry");
      collect(".work-copy", "copy", 1, ".work-entry");
      collect(".section-heading h2", "title", 2);
      collect(".expertise-group", "skill", 2, ".expertise-group");
      collect(".section-heading h2", "title", 3);
      collect(".experience-content", "timeline", 3, ".experience-entry");
      collect(".section-heading h2", "title", 4);
      collect(".about-portrait", "portrait", 4);
      collect(".about-copy", "about", 4);
      collect(".contact-composition h2", "contact", 5);
    }

    // offset geometry is independent of animated transforms and sticky visual positions.
    const layoutTop = (element: HTMLElement) => {
      let top = 0;
      for (
        let node: HTMLElement | null = element;
        node;
        node = node.offsetParent as HTMLElement | null
      )
        top += node.offsetTop;
      return top;
    };
    const measure = () => {
      bounds = sections.map((element) => ({
        id: element.id,
        top: layoutTop(element),
        height: element.offsetHeight,
      }));
      projectBounds = projectEntries.map((element) => ({
        top: layoutTop(element),
        height: element.offsetHeight,
      }));
      maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight,
      );
      targets.forEach((target) => {
        target.top = layoutTop(target.anchor);
        target.height = target.anchor.offsetHeight;
      });
      if (dock) {
        const rect = dock.getBoundingClientRect();
        dockBox = {
          left: rect.left,
          top: rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        };
      }
      if (heroTitle)
        heroTitleRight =
          heroTitle.offsetWidth +
          (heroTitle.closest<HTMLElement>(".hero-identity")?.offsetLeft ?? 0);
      if (signature)
        signatureBox = {
          left: signature.getBoundingClientRect().left,
          top: layoutTop(signature),
          width: signature.offsetWidth,
          height: signature.offsetHeight,
        };
      dirty = false;
    };
    const invalidate = () => {
      dirty = true;
      invalidateMotionFrame();
    };
    const observer = new ResizeObserver(invalidate);
    sections.forEach((section) => observer.observe(section));
    observer.observe(document.body);
    // Font swaps, image loads and native <details> all change chapter timing.
    root.addEventListener("load", invalidate, true);
    root.addEventListener("toggle", invalidate, true);
    document.fonts.ready.then(() => {
      if (!disposed && root.isConnected) invalidate();
    });
    measure();
    root.dataset.narrative = animated ? "on" : "off";

    const universe = createUniverseSession(root, animated);
    const sensory = animated ? createSensorySession(root) : null;
    const unsubscribe = subscribeMotionFrame(
      (frame) => {
        sensory?.update(frame);
        const geometryChanged = dirty || frame.resized;
        if (geometryChanged) measure();
        if (!animated && !frame.scrolled && !frame.resized) return;
        const state =
          lastReading && !frame.scrolled && !geometryChanged
            ? lastReading
            : narrativeAt(
                frame.scrollY,
                frame.height,
                maxScroll,
                bounds,
                caseStudy ? caseSceneColors : undefined,
              );
        const readingChanged = state !== lastReading;
        lastReading = state;
        const id = bounds[state.active].id;
        if (active !== id) {
          active = id;
          setChapter(id);
          root.dataset.chapter = id;
        }
        if (readingChanged) {
          root.style.setProperty("--scroll-progress", fixed(state.progress));
          root.dataset.scrollProgress = fixed(state.progress);
          root.dataset.chapterProgress = fixed(state.local);
          root.style.setProperty("--chapter-progress", fixed(state.local));
        }
        if (frame.pointerChanged || geometryChanged) {
          const fine = frame.pointerInside && frame.pointerType === "mouse";
          root.style.setProperty(
            "--pointer-x",
            fixed(
              fine ? (frame.pointerX / Math.max(1, frame.width)) * 2 - 1 : 0,
            ),
          );
          root.style.setProperty(
            "--pointer-y",
            fixed(
              fine ? (frame.pointerY / Math.max(1, frame.height)) * 2 - 1 : 0,
            ),
          );
        }
        const nextPercentage = Math.round(state.progress * 100);
        if (percentage !== nextPercentage) {
          percentage = nextPercentage;
          meter?.setAttribute("aria-valuenow", String(percentage));
          if (readout)
            readout.textContent = `${String(percentage).padStart(3, "0")}%`;
        }
        if (!animated) {
          universe.update(frame, {
            stage: 0,
            progress: state.progress,
            x: 0,
            y: 0,
            scale: 1,
            opacity: 0,
            darkInk: state.darkInk,
            project: 0,
            visible: false,
          });
          return;
        }
        const nextTheme = state.darkInk ? "light" : "dark";
        if (nextTheme !== theme) {
          theme = nextTheme;
          root.dataset.sceneTone = theme;
        }
        if (readingChanged) {
          root.dataset.scene = String(state.scene);
          root.dataset.sceneBlend = fixed(state.blend);
        }
        if (backdrop !== state.backdrop) {
          backdrop = state.backdrop;
          root.style.setProperty("--scene-backdrop", backdrop);
          root.style.setProperty("--scene-ink", state.ink);
          root.style.setProperty("--scene-muted", state.muted);
          root.style.setProperty("--scene-accent", state.accent);
        }
        if (readingChanged)
          washes.forEach((wash, i) => {
            wash.style.opacity =
              i === state.scene
                ? "1"
                : i === state.scene + 1
                  ? fixed(state.blend)
                  : "0";
          });
        const mobile = frame.width <= 760;
        const strength = mobile ? 0.48 : 1;
        ambientTime += frame.delta;
        const phase = ambientTime * 0.00028;
        const scene = state.scene;
        const next = Math.min(scene + 1, 5);
        const mainLeft = mobile ? 22 : frame.width <= 1250 ? 102 : 149;
        const heroGap = frame.width - heroTitleRight - 22;
        const heroDocked = !caseStudy && frame.width >= 1000 && heroGap >= 160;
        const positions = [
          {
            x: heroDocked
              ? heroTitleRight + heroGap / 2
              : dockBox.left + dockBox.width / 2,
            y: dockBox.top - frame.scrollY + dockBox.height / 2,
            size:
              (heroDocked ? Math.min(dockBox.width, heroGap) : dockBox.width) /
              600,
            rotate: 0,
            alpha: 1,
            squash: 1,
          },
          {
            x: mainLeft + (frame.width - mainLeft) * 0.18,
            y: frame.height * 0.56,
            size: mobile ? 0.65 : 1.1,
            rotate: 68,
            alpha: 0.13,
            squash: 0.48,
          },
          {
            x: frame.width * (mobile ? 0.97 : 0.25),
            y: frame.height * 0.81,
            size: mobile ? 0.45 : 0.78,
            rotate: 168,
            alpha: mobile ? 0.07 : 0.11,
            squash: 0.9,
          },
          {
            x: frame.width * (mobile ? 0.98 : 0.89),
            y: frame.height * 0.59,
            size: mobile ? 0.45 : 0.66,
            rotate: 270,
            alpha: 0.075,
            squash: 0.2,
          },
          {
            x: frame.width * (mobile ? 1.02 : 0.27),
            y: frame.height * (mobile ? 0.57 : 0.48),
            size: mobile ? 0.46 : 1.03,
            rotate: 350,
            alpha: mobile ? 0.08 : 0.13,
            squash: 1.12,
          },
          {
            x: signatureBox
              ? signatureBox.left + signatureBox.width / 2
              : frame.width * 0.65,
            y: signatureBox
              ? signatureBox.top - frame.scrollY + signatureBox.height / 2
              : frame.height * 0.48,
            size: signatureBox
              ? Math.min(signatureBox.width / 600, signatureBox.height / 180)
              : mobile
                ? 0.88
                : 1.4,
            rotate: 430,
            alpha: 0.18,
            squash: 0.75,
          },
        ];
        const from = positions[scene],
          to = positions[next],
          t = state.blend;
        const x = mix(from.x, to.x, t);
        const y =
          mix(from.y, to.y, t) +
          Math.sin(phase) * 6 * (scene === 0 ? t : 1) * strength;
        const scale = mix(from.size, to.size, t);
        if (vessel && (readingChanged || root.dataset.universe !== "webgl")) {
          vessel.style.transform = `translate3d(${fixed(x - 300)}px,${fixed(y - 230)}px,0) rotate(${fixed(mix(from.rotate, to.rotate, t))}deg) scale(${fixed(scale)})`;
          vessel.style.opacity = fixed(mix(from.alpha, to.alpha, t));
          vessel.style.setProperty(
            "--signal-squash",
            fixed(mix(from.squash, to.squash, t)),
          );
          vessel.style.setProperty(
            "--signal-breath",
            fixed(1 + Math.sin(phase * 1.9) * 0.085),
          );
          vessel.style.setProperty(
            "--signal-shear",
            `${fixed(Math.sin(phase) * 4)}deg`,
          );
        }
        if (thread && (scene > 0 || t > 0 || readingChanged)) {
          const endX = clamp(x / frame.width) * 1000,
            endY = clamp(y / frame.height) * 1000;
          const bend = Math.sin(phase) * 40;
          thread.setAttribute(
            "d",
            `M${mobile ? 35 : 14} 0 C${180 + bend} 180 ${endX - 180} ${endY - 120} ${endX} ${endY} S${850 - bend} 820 960 1000`,
          );
          thread.style.opacity = fixed(scene === 0 ? t * 0.18 : 0.18);
        }
        const labels = caseStudy
          ? [
              root.dataset.project?.toUpperCase() || "WORK",
              "INTENT",
              "MAKING",
              "EXPERIENCE",
              "RESULT",
              "LOWKYZ",
            ]
          : sceneWords;
        const label = labels[scene];
        if (word && (scene > 0 || t > 0 || readingChanged)) {
          if (label !== sceneWord) {
            word.textContent = label;
            if (nextWord) nextWord.textContent = labels[next];
            sceneWord = label;
          }
          word.style.transform = `translate3d(${fixed((t - 0.5) * -12)}%,${fixed(Math.sin(phase) * 7)}px,0) rotate(${fixed(mix(-6, 4, t))}deg) scaleX(${fixed(mix(1.1, 0.88, t))})`;
          word.style.opacity = fixed(scene === 0 ? t * 0.045 : 0.045);
          word.style.clipPath = `inset(0 ${fixed(t * 100)}% 0 0)`;
        }
        if (nextWord && (scene > 0 || t > 0 || readingChanged)) {
          nextWord.style.clipPath = `inset(0 0 0 ${fixed((1 - t) * 100)}%)`;
          nextWord.style.opacity = ".045";
          nextWord.style.transform = `translate3d(${fixed((1 - t) * 12)}%,${fixed(Math.sin(phase) * -7)}px,0) rotate(${fixed(mix(4, -2, t))}deg) scaleX(${fixed(mix(0.88, 1.1, t))})`;
        }

        let project = 0,
          nearest = Infinity;
        projectBounds.forEach((box, index) => {
          const distance = Math.abs(
            box.top + box.height / 2 - frame.scrollY - frame.height * 0.55,
          );
          if (distance < nearest) {
            nearest = distance;
            project = index;
          }
        });
        universe.update(frame, {
          stage: caseStudy ? 1 + (scene + t) * 0.8 : scene + t,
          docked: caseStudy,
          progress: state.progress,
          x,
          y,
          scale,
          opacity: mix(from.alpha, to.alpha, t),
          darkInk: state.darkInk,
          project,
          visible:
            x + 360 * scale > 0 &&
            x - 360 * scale < frame.width &&
            y + 300 * scale > 0 &&
            y - 300 * scale < frame.height,
        });

        if (!frame.scrolled && !geometryChanged) return;
        targets.forEach((target) => {
          const relative = target.top - frame.scrollY;
          if (
            relative > frame.height * 1.35 ||
            relative + target.height < -frame.height * 0.6
          )
            return;
          const entry = smooth(
            (frame.height * 0.98 - relative) / (frame.height * 0.62),
          );
          const exit = clamp(
            (-relative + frame.height * 0.18) /
              Math.max(frame.height, target.height),
          );
          const departure = clamp(
            frame.scrollY / Math.max(1, bounds[0].height * 0.75),
          );
          let tx = 0,
            ty = 0,
            rotate = 0,
            rotateY = 0,
            size = 1,
            skew = 0,
            mask = 0;
          switch (target.kind) {
            case "identity":
              tx = -departure * 70 * strength;
              ty = -departure * 55 * strength;
              skew = -departure * 7;
              size = 1 + departure * 0.07;
              break;
            case "title":
              tx = (1 - entry) * (target.scene === 3 ? -65 : 75) * strength;
              ty = (1 - entry) * 50 - exit * 20 * strength;
              skew = (1 - entry) * (target.scene === 2 ? -9 : 5);
              size = 1 + (1 - entry) * 0.12;
              mask = (1 - entry) * 85;
              break;
            case "media": {
              const sign = target.index % 2 ? -1 : 1;
              tx = (1 - entry) * 90 * sign * strength;
              ty = (relative / frame.height - 0.2) * -24 * strength;
              rotate = (1 - entry) * 3 * sign * strength;
              rotateY = (1 - entry) * -12 * sign * strength;
              size = 0.94 + entry * 0.06;
              mask = (1 - entry) * 45;
              break;
            }
            case "copy":
              ty = (1 - entry) * 60 * strength + exit * -12;
              break;
            case "skill":
              tx = (1 - entry) * 35 * strength;
              rotateY = (1 - entry) * -8 * strength;
              break;
            case "timeline":
              tx = (1 - entry) * 50 * strength;
              mask = (1 - entry) * 65;
              target.element.style.setProperty("--line-progress", fixed(entry));
              break;
            case "portrait":
              ty = (1 - entry) * 45 * strength - exit * 18 * strength;
              rotateY = (1 - entry) * 16 * strength;
              rotate = (1 - entry) * -3 * strength;
              size = 0.96 + entry * 0.04;
              mask = (1 - entry) * 48;
              break;
            case "about":
              ty = (1 - entry) * 65 * strength - exit * 10;
              break;
            case "contact":
              ty = (1 - entry) * 90 * strength;
              size = 1.16 - entry * 0.16;
              skew = (1 - entry) * -5;
              mask = (1 - entry) * 90;
              break;
          }
          target.element.style.setProperty(
            "--cinema-transform",
            `perspective(1100px) translate3d(${fixed(tx)}px,${fixed(ty)}px,0) rotate(${fixed(rotate)}deg) rotateY(${fixed(rotateY)}deg) skewX(${fixed(skew)}deg) scale(${fixed(size)})`,
          );
          target.element.style.setProperty("--cinema-clip", `${fixed(mask)}%`);
        });
      },
      { continuous: animated },
    );

    return () => {
      disposed = true;
      unsubscribe();
      universe.dispose();
      sensory?.dispose();
      observer.disconnect();
      root.removeEventListener("load", invalidate, true);
      root.removeEventListener("toggle", invalidate, true);
      delete root.dataset.narrative;
      delete root.dataset.sceneTone;
      targets.forEach(({ element }) => {
        delete element.dataset.cinema;
        element.style.removeProperty("--cinema-transform");
        element.style.removeProperty("--cinema-clip");
        element.style.removeProperty("--line-progress");
      });
    };
  }, [motion, setChapter]);
}
