import { test, expect, type Page } from "@playwright/test";

const ids = ["profil", "projets", "stack", "experience", "about", "contact"];
const root = "[data-portfolio-root]";
function errorsOn(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}
async function ready(page: Page) {
  await expect(page.locator(root)).toHaveAttribute("data-narrative", "on");
  await page.evaluate(() => document.fonts.ready);
}
async function anchored(page: Page, id: string) {
  // Active-chapter thresholds are crossed before a native smooth scroll finishes.
  // Save history positions only after the browser reaches the actual anchor.
  await expect
    .poll(() =>
      page.evaluate((id) => {
        const target = document.getElementById(id)!;
        const padding = parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        );
        const destination = Math.max(
          0,
          Math.min(
            scrollY + target.getBoundingClientRect().top - padding,
            document.documentElement.scrollHeight - innerHeight,
          ),
        );
        return Math.abs(scrollY - destination);
      }, id),
    )
    .toBeLessThan(2);
}
async function scroll(page: Page, y: number) {
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: "instant" }),
    y,
  );

  // Wait for the coordinator's RAF, rather than arbitrary animation durations.
  await expect
    .poll(async () =>
      page.locator(root).evaluate((element) => {
        const expected =
          scrollY / (document.documentElement.scrollHeight - innerHeight);
        return Math.abs(
          Number((element as HTMLElement).dataset.scrollProgress) - expected,
        );
      }),
    )
    .toBeLessThan(0.002);
}
async function state(page: Page) {
  return page.locator(root).evaluate((element) => {
    const el = element as HTMLElement;
    const style = getComputedStyle(el);
    const rgb = (value: string) =>
      (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const luminance = (color: number[]) =>
      color.reduce((sum, channel, i) => {
        const c = channel / 255;
        return (
          sum +
          (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][i]
        );
      }, 0);
    const bg = luminance(rgb(style.getPropertyValue("--scene-backdrop")));
    const contrast = (color: string) => {
      const fg = luminance(rgb(color));
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    };
    const vessel = el.querySelector<HTMLElement>("[data-signal-vessel]")!;
    return {
      progress: Number(el.dataset.scrollProgress),
      scene: Number(el.dataset.scene),
      blend: Number(el.dataset.sceneBlend),
      chapter: el.dataset.chapter,
      backdrop: style.getPropertyValue("--scene-backdrop"),
      vessel: vessel.style.transform,
      morph: vessel.style.getPropertyValue("--signal-squash"),
      overflow: document.documentElement.scrollWidth - innerWidth,
      meter: Number(
        el.querySelector("[data-scroll-meter]")!.getAttribute("aria-valuenow"),
      ),
      contrast: contrast(style.color),
      mutedContrast: contrast(
        getComputedStyle(el.querySelector(".hero-description")!).color,
      ),
    };
  });
}

for (const width of [390, 1440]) {
  test(`cinematic joins interpolate in both directions at ${width}px`, async ({
    page,
  }, info) => {
    const errors = errorsOn(page);
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/fr");
    await ready(page);
    const height = await page.evaluate(() => innerHeight);
    const tops = await page
      .locator("[data-section]")
      .evaluateAll((elements) =>
        elements.map((e) => e.getBoundingClientRect().top + scrollY),
      );
    for (let join = 1; join < ids.length; join++) {
      const points = [0, 0.25, 0.5, 0.75, 1].map(
        (t) => tops[join] - height * 0.88 + height * 0.92 * t,
      );
      const snapshots: Awaited<ReturnType<typeof state>>[] = [];
      for (const point of points) {
        await scroll(page, point);
        const sample = await state(page);
        expect(sample.overflow).toBeLessThanOrEqual(1);
        expect(
          Math.abs(sample.meter - sample.progress * 100),
        ).toBeLessThanOrEqual(0.51);
        expect(sample.vessel).not.toContain("NaN");
        expect(sample.contrast).toBeGreaterThanOrEqual(4.5);
        expect(sample.mutedContrast).toBeGreaterThanOrEqual(4.5);
        snapshots.push(sample);
      }
      expect(snapshots[0].progress).toBeLessThan(snapshots[4].progress);
      expect(new Set(snapshots.map((s) => s.backdrop)).size).toBeGreaterThan(2);
      expect(new Set(snapshots.map((s) => s.vessel)).size).toBeGreaterThan(3);
      expect(new Set(snapshots.map((s) => s.morph)).size).toBeGreaterThan(2);
      await page.screenshot({ path: info.outputPath(`join-${join}.png`) });
      for (let index = points.length - 1; index >= 0; index--) {
        await scroll(page, points[index]);
        const reversed = await state(page);
        expect(reversed.progress).toBeCloseTo(snapshots[index].progress, 2);
        expect(reversed.backdrop).toBe(snapshots[index].backdrop);
        expect(reversed.morph).toBe(snapshots[index].morph);
      }
    }
    expect(errors).toEqual([]);
  });

  test(`native anchors, backwards history and viewport resize at ${width}px`, async ({
    page,
  }) => {
    const errors = errorsOn(page);
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en");
    await ready(page);
    for (const id of ids.slice(1)) {
      // Native links exercise browser anchor/history handling, not imperative navigation.
      const link = page.locator(`.living-signal a[href="#${id}"]`);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await anchored(page, id);
      await expect(page.locator(root)).toHaveAttribute("data-chapter", id);
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(page.locator("#" + id)).toBeInViewport();
    }
    for (let i = ids.length - 2; i >= 0; i--) {
      await page.goBack();
      await anchored(page, ids[i]);
      await expect(page.locator(root)).toHaveAttribute("data-chapter", ids[i]);
      await expect(page.locator(`#${ids[i]}`)).toBeInViewport();
    }
    for (let i = 1; i < ids.length; i++) {
      await page.goForward();
      await anchored(page, ids[i]);
      await expect(page.locator(root)).toHaveAttribute("data-chapter", ids[i]);
    }
    await page.setViewportSize({
      width: width === 390 ? 1024 : 390,
      height: 844,
    });
    await page.locator('.living-signal a[href="#contact"]').click();
    await anchored(page, "contact");
    await expect(page.locator(root)).toHaveAttribute("data-chapter", "contact");
    const afterResize = await state(page);
    expect(afterResize.overflow).toBeLessThanOrEqual(1);
    expect(afterResize.vessel).not.toContain("NaN");
    await page.reload();
    await ready(page);
    await expect(page.locator(root)).toHaveAttribute("data-chapter", "contact");
    await expect(page.locator("#contact")).toBeInViewport();
    expect(errors).toEqual([]);
  });
}

test("one RAF clock: idle environment runs, reduced motion stops, then resumes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const pending = new Set<number>();
    const original = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = original((time) => {
        pending.delete(id);
        callback(time);
      });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      pending.delete(id);
      cancel(id);
    };
    Object.defineProperty(window, "__pendingAnimationFrames", {
      get: () => pending.size,
    });
  });
  const count = () =>
    page.evaluate(
      () =>
        (window as unknown as { __pendingAnimationFrames: number })
          .__pendingAnimationFrames,
    );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/fr");
  await ready(page);
  await expect.poll(count).toBe(1);
  await expect(page.locator(".signal-trace")).toHaveCSS("clip-path", /100%/);
  const vessel = page.locator("[data-signal-vessel]");
  const firstBreath = await vessel.evaluate((e) =>
    (e as HTMLElement).style.getPropertyValue("--signal-breath"),
  );
  await expect
    .poll(() =>
      vessel.evaluate((e) =>
        (e as HTMLElement).style.getPropertyValue("--signal-breath"),
      ),
    )
    .not.toBe(firstBreath);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(root)).toHaveAttribute("data-narrative", "off");
  await expect.poll(count).toBe(0);
  await expect(page.locator(".narrative-environment")).not.toBeVisible();
  await page.locator('.living-signal a[href="#stack"]').click();
  await expect(page.locator(root)).toHaveAttribute("data-chapter", "stack");
  await expect.poll(count).toBe(0);
  await expect(
    page.locator(".expertise-section .section-heading h2"),
  ).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page);
  await expect.poll(count).toBe(1);
});

test("wheel, keyboard, reflow and route changes retain native control", async ({
  page,
}) => {
  const errors = errorsOn(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/fr");
  await ready(page);
  await page.mouse.wheel(0, 620);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.keyboard.press("End");
  await expect.poll(async () => (await state(page)).progress).toBe(1);
  expect((await state(page)).scene).toBe(5);
  await expect(page.locator(".signal-trace")).toHaveCSS(
    "clip-path",
    /inset\(0px -3px (?:0%|0px)(?: -3px)?\)/,
  );
  await page.keyboard.press("Home");
  await expect.poll(async () => (await state(page)).progress).toBe(0);
  await page.locator('.living-signal a[href="#experience"]').click();
  await expect(page.locator(root)).toHaveAttribute(
    "data-chapter",
    "experience",
  );
  await page.locator("#iaudiogram summary").click();
  await expect(page.locator("#iaudiogram details")).toHaveAttribute("open", "");
  await page.locator('.living-signal a[href="#contact"]').click();
  await expect(page.locator(root)).toHaveAttribute("data-chapter", "contact");
  await page.locator("a.locale-switch").click();
  await ready(page);
  await expect(page).toHaveURL(/\/en#contact$/);
  await expect(page.locator(root)).toHaveAttribute("data-chapter", "contact");
  await page.goto("/en/work/greecheck");
  await expect(page.locator(".narrative-environment")).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Case study navigation" })
    .getByRole("link", { name: /Back to work/ })
    .click();
  await ready(page);
  await expect(page).toHaveURL(/\/en#greecheck$/);
  await expect(page.locator(root)).toHaveAttribute("data-chapter", "projets");
  expect(errors).toEqual([]);
});

test("editorial pins hold their frame and the project reveal travels horizontally", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/fr");
  await ready(page);
  const engineering = await page
    .locator("#stack")
    .evaluate((e) => e.getBoundingClientRect().top + scrollY);
  const heading = page.locator("#stack .section-heading");
  await scroll(page, engineering + 300);
  const first = await heading.boundingBox();
  await scroll(page, engineering + 500);
  const second = await heading.boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(2);
  expect(second!.y).toBe(130);
  await expect(page.locator(".about-portrait")).toHaveCSS("position", "sticky");
  const project = await page
    .locator("#greecheck")
    .evaluate((e) => e.getBoundingClientRect().top + scrollY);
  const image = page.locator("#greecheck .work-image-link");
  await scroll(page, project - 900);
  const before = await image.evaluate((e) => ({
    transform: getComputedStyle(e).transform,
    clip: getComputedStyle(e).clipPath,
  }));
  await scroll(page, project - 350);
  const after = await image.evaluate((e) => ({
    transform: getComputedStyle(e).transform,
    clip: getComputedStyle(e).clipPath,
  }));
  expect(before.transform).not.toBe(after.transform);
  expect(before.clip).not.toBe(after.clip);
  await image.focus();
  await expect(image).toHaveCSS("clip-path", "none");
});
